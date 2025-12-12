<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Service;
use App\Models\MovingPackage;
use App\Models\Branch;
use App\Models\ManualPayment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    // Konfigurasi Limit Order Harian untuk Pindahan (Kuota Armada)
    const DAILY_MOVING_LIMIT = 3;

    /**
     * Helper Private: Menghitung jarak antara dua koordinat (Haversine Formula)
     * Returns distance in Kilometers.
     */
    private function calculateDistance($lat1, $lon1, $lat2, $lon2)
    {
        if (($lat1 == $lat2) && ($lon1 == $lon2)) {
            return 0;
        }

        $theta = $lon1 - $lon2;
        $dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) +  cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));
        $dist = acos($dist);
        $dist = rad2deg($dist);
        $miles = $dist * 60 * 1.1515;
        $km = $miles * 1.609344;

        return round($km, 2); // Pembulatan 2 desimal
    }

    /**
     * Mengambil detail produk & Data Tanggal Penuh untuk modal.
     */
    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'type' => 'required|string|in:service,moving_package',
            'id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 422);
        }

        $type = $request->query('type');
        $id = $request->query('id');

        $product = null;
        $productModelClass = null;
        $blockedDates = []; // Array untuk menampung tanggal yang penuh

        if ($type === 'service') {
            $product = Service::findOrFail($id);
            $productModelClass = Service::class;
        } elseif ($type === 'moving_package') {
            $product = MovingPackage::findOrFail($id);
            $productModelClass = MovingPackage::class;

            // [LOGIKA DATE BLOCKING]
            // Cek order pindahan yang aktif (tidak cancel/reject)
            $orders = Order::where('orderable_type', MovingPackage::class)
                ->whereNotIn('status', ['cancelled', 'rejected']) 
                ->get();

            // Hitung jumlah order per tanggal
            $dateCounts = [];
            foreach ($orders as $o) {
                if (isset($o->user_form_details['tanggal_pindahan'])) {
                    $date = $o->user_form_details['tanggal_pindahan'];
                    if (!isset($dateCounts[$date])) {
                        $dateCounts[$date] = 0;
                    }
                    $dateCounts[$date]++;
                }
            }

            // Masukkan tanggal yang mencapai limit ke array blockedDates
            foreach ($dateCounts as $date => $count) {
                if ($count >= self::DAILY_MOVING_LIMIT) {
                    $blockedDates[] = $date;
                }
            }
        }

        return response()->json([
            'product' => $product,
            'productType' => $type,
            'productModelClass' => $productModelClass,
            'blockedDates' => $blockedDates,
        ]);
    }

    /**
     * [MODIFIKASI UTAMA] Menghitung estimasi biaya pengiriman ke SEMUA CABANG (Multi-Option).
     * Mengembalikan daftar harga agar user bisa memilih sendiri.
     */
    public function calculateShipping(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'vehicle_type' => 'required_if:delivery_method,pickup',
            'delivery_method' => 'required|in:pickup,dropoff',
        ]);

        // 1. Jika Antar Sendiri, Biaya 0 (Tetap sama)
        if ($request->delivery_method === 'dropoff') {
            return response()->json([
                'options' => [], // Kosong karena user pilih manual di frontend dropoff
                'message' => 'Antar sendiri (Gratis Ongkir)'
            ]);
        }

        // 2. Hitung Jarak ke SEMUA Cabang (Looping)
        $userLat = $request->latitude;
        $userLng = $request->longitude;
        
        $branches = Branch::where('status', 'Buka')->get();
        
        $options = []; // Array untuk menampung hasil perhitungan semua cabang

        foreach ($branches as $branch) {
            // Skip cabang tanpa koordinat
            if (!$branch->latitude || !$branch->longitude) continue;

            // Hitung Jarak (Haversine)
            $km = $this->calculateDistance($userLat, $userLng, $branch->latitude, $branch->longitude);

            // Tentukan Tarif Dasar & Per KM
            $ratePerKm = 2500;
            $baseFee = 0;

            switch ($request->vehicle_type) {
                case 'motor': $baseFee = 10000; $ratePerKm = 2500; break;
                case 'pickup': $baseFee = 50000; $ratePerKm = 4000; break;
                case 'truck': $baseFee = 150000; $ratePerKm = 7000; break;
            }

            // --- PROMO JARAK DEKAT ---
            $shippingCost = 0;
            $note = "";

            if ($km <= 3) {
                if ($request->vehicle_type === 'motor') {
                    $shippingCost = 0;
                    $note = "Promo Jarak Dekat (< 3KM): Ongkir GRATIS!";
                } else {
                    $shippingCost = $baseFee;
                    $note = "Jarak Dekat (< 3KM): Hanya dikenakan biaya sewa armada.";
                }
            } else {
                $rawCost = ($km * $ratePerKm) + $baseFee;
                $shippingCost = ceil($rawCost);
                $note = "Tarif Normal";
            }

            // Pembulatan ke 500 terdekat
            if ($shippingCost > 0) {
                $shippingCost = ceil($shippingCost / 500) * 500;
            }

            // Masukkan data cabang ini ke dalam array opsi
            $options[] = [
                'branch' => $branch, // Data lengkap cabang (id, nama, alamat, dll)
                'distance' => $km,
                'shipping_cost' => $shippingCost,
                'note' => $note
            ];
        }

        if (empty($options)) {
            return response()->json(['error' => 'Tidak ada cabang tersedia saat ini.'], 404);
        }

        // 3. Urutkan dari yang Ongkirnya Termurah (Rekomendasi Paling Atas)
        usort($options, function ($a, $b) {
            return $a['shipping_cost'] <=> $b['shipping_cost'];
        });

        // Kembalikan ARRAY options ke Frontend
        return response()->json([
            'options' => $options, 
            'vehicle' => $request->vehicle_type
        ]);
    }

    /**
     * STORE: Menyimpan Order Baru & Kalkulasi Harga Server-Side
     */
    public function store(Request $request)
    {
        // 1. Ambil Tipe Model Produk
        $modelClass = $request->input('product_model');

        // 2. Aturan Validasi Dasar
        $rules = [
            'product_id' => 'required|integer',
            'product_model' => 'required|string',
            'form_details' => 'required|array',
            'form_details.latitude' => 'nullable', 
            'form_details.longitude' => 'nullable',
            'form_details.shipping_cost' => 'nullable|numeric',
        ];

        // Validasi Cabang (Wajib untuk Penitipan/Service)
        if ($modelClass === Service::class) {
            $rules['form_details.branch_id'] = 'required|exists:branches,id'; // Pastikan cabang valid
            
            $rules = array_merge($rules, [
                'form_details.start_date' => 'required|date|after_or_equal:today',
                'form_details.duration_value' => 'required|integer|min:1',
                'form_details.duration_unit' => 'required|string|in:hour,day,week,month',
                'form_details.delivery_method' => 'required|string|in:drop_off,pickup',
                'form_details.item_photo' => 'nullable|image|max:5120',
                'form_details.notes' => 'nullable|string|max:1000',
            ]);

            if ($request->input('form_details.delivery_method') === 'pickup') {
                $rules['form_details.alamat_penjemputan'] = 'required|string|max:500';
                $rules['form_details.telepon'] = 'required|string|max:20';
            }
        } 
        elseif ($modelClass === MovingPackage::class) {
            // Validasi Pindahan
            $rules = array_merge($rules, [
                'form_details.tanggal_pindahan' => 'required|date|after_or_equal:today',
                'form_details.telepon' => 'required|string|max:20',
                'form_details.alamat_penjemputan' => 'required|string|max:2000',
                'form_details.alamat_tujuan' => 'required|string|max:2000',
                'form_details.notes' => 'nullable|string|max:1000',
                // Koordinat wajib
                'form_details.origin_latitude' => 'required|numeric',
                'form_details.origin_longitude' => 'required|numeric',
                'form_details.destination_latitude' => 'required|numeric',
                'form_details.destination_longitude' => 'required|numeric',
            ]);
        }

        // 3. Jalankan Validasi
        $validatedData = $request->validate($rules);
        $formDetails = $validatedData['form_details'];

        // 4. Handle Upload Foto
        if ($request->hasFile('form_details.item_photo')) {
            $path = $request->file('form_details.item_photo')->store('order_items', 'public');
            $formDetails['item_photo_path'] = $path;
            unset($formDetails['item_photo']);
        }

        // 5. Ambil Data Produk
        $product = $modelClass::find($validatedData['product_id']);
        
        if (!empty($formDetails['branch_id'])) {
            $branch = Branch::find($formDetails['branch_id']);
            $formDetails['branch_name'] = $branch ? $branch->name : 'Unknown';
            $formDetails['branch_address'] = $branch ? $branch->address : '';
        }

        if (!$product) {
            throw ValidationException::withMessages(['product_id' => 'Produk tidak ditemukan.']);
        }

        // 6. Kalkulasi Harga Final
        $finalAmount = 0;

        if ($modelClass === Service::class) {
            $basePrice = $product->price;
            $duration = (int) $formDetails['duration_value'];

            $timeMultiplier = match ($formDetails['duration_unit']) {
                'hour' => 0.1,
                'day' => 1,
                'week' => 6,
                'month' => 25,
                default => 1,
            };

            $servicePrice = round($basePrice * $duration * $timeMultiplier);
            $shippingCost = isset($formDetails['shipping_cost']) ? (int) $formDetails['shipping_cost'] : 0;
            $finalAmount = $servicePrice + $shippingCost;

        } 
        elseif ($modelClass === MovingPackage::class) {
            // [LOGIKA BARU] Pindahan
            
            // A. Cek Kuota Tanggal
            $date = $formDetails['tanggal_pindahan'];
            $existingOrdersCount = Order::where('orderable_type', MovingPackage::class)
                ->whereNotIn('status', ['cancelled', 'rejected'])
                ->get()
                ->filter(function ($order) use ($date) {
                    return isset($order->user_form_details['tanggal_pindahan']) && 
                           $order->user_form_details['tanggal_pindahan'] === $date;
                })
                ->count();

            if ($existingOrdersCount >= self::DAILY_MOVING_LIMIT) {
                throw ValidationException::withMessages([
                    'form_details.tanggal_pindahan' => 'Mohon maaf, kuota armada untuk tanggal ini baru saja penuh.'
                ]);
            }

            // B. Hitung Jarak Real
            $distanceKm = $this->calculateDistance(
                $formDetails['origin_latitude'],
                $formDetails['origin_longitude'],
                $formDetails['destination_latitude'],
                $formDetails['destination_longitude']
            );

            // C. Validasi Batas Jarak Paket (Max Distance)
            // Jika max_distance tidak null, maka kita cek
            if (!is_null($product->max_distance) && $distanceKm > $product->max_distance) {
                throw ValidationException::withMessages([
                    'form_details.alamat_tujuan' => 'Jarak pengiriman (' . $distanceKm . ' KM) melebihi batas maksimal paket ini (' . $product->max_distance . ' KM). Silakan pilih paket Luar Kota.'
                ]);
            }

            // D. Hitung Harga: Base Price + Surcharge Jarak
            $basePrice = $product->price; // Harga 3KM pertama
            $pricePerKm = $product->price_per_km; // Harga per KM tambahan
            $freeDistance = 3;

            // Hitung kelebihan jarak (minimal 0)
            $extraDistance = max(0, $distanceKm - $freeDistance);
            
            // Biaya tambahan = kelebihan jarak (dibulatkan ke atas) * harga per km
            $distanceSurcharge = ceil($extraDistance) * $pricePerKm;

            $finalAmount = $basePrice + $distanceSurcharge;

            // Simpan detail kalkulasi ke form data (untuk history/admin)
            $formDetails['distance_km'] = $distanceKm;
            $formDetails['distance_surcharge'] = $distanceSurcharge;
        }

        // 7. Buat Order
        $order = $product->orders()->create([
            'user_id' => Auth::id(),
            'final_amount' => $finalAmount,
            'user_form_details' => $formDetails,
            'status' => 'awaiting_payment',
        ]);

        return response()->json([
            'message' => 'Order berhasil dibuat',
            'order' => $order
        ]);
    }

    /**
     * Menyimpan bukti pembayaran.
     */
    public function submitPayment(Request $request, Order $order)
    {
        if ($order->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'payment_proof' => 'required|image|mimes:jpeg,png,jpg,pdf|max:2048',
            'notes'         => 'nullable|string|max:500',
        ]);

        // Simpan File Bukti Bayar
        $path = null;
        if ($request->hasFile('payment_proof')) {
            // Hapus file lama jika ada (untuk re-upload saat ditolak)
            $existingPayment = $order->payment;
            if ($existingPayment && $existingPayment->payment_proof_path) {
                 Storage::disk('public')->delete($existingPayment->payment_proof_path);
            }
            
            $path = $request->file('payment_proof')->store('payments', 'public');
        }

        // Simpan ke tabel manual_payments (Relasi One-to-One)
        $order->payment()->updateOrCreate(
            ['order_id' => $order->id],
            [
                'user_id' => Auth::id(),
                'payment_proof_path' => $path,
                'notes' => $request->notes,
                'amount' => $order->final_amount, // Asumsi bayar full
                'status' => 'pending_verification'
            ]
        );

        // Update status order utama
        $order->update(['status' => 'awaiting_verification']);

        return response()->json([
            'message' => 'Bukti pembayaran berhasil diupload.',
            'orderStatus' => $order->status,
        ]);
    }

    /**
     * Polling status order.
     */
    public function getStatus(Order $order)
    {
        if ($order->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'status' => $order->status
        ]);
    }
}