<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Service;
use App\Models\MovingPackage;
use App\Models\Branch;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    /**
     * Mengambil detail produk untuk modal (API-friendly).
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

        if ($type === 'service') {
            $product = Service::findOrFail($id);
            $productModelClass = Service::class;
        } elseif ($type === 'moving_package') {
            $product = MovingPackage::findOrFail($id);
            $productModelClass = MovingPackage::class;
        }

        // Opsional: Cek apakah produk aktif/valid
        // if ($product->price <= 0) { ... }

        return response()->json([
            'product' => $product,
            'productType' => $type,
            'productModelClass' => $productModelClass,
        ]);
    }

    /**
     * STORE: Menyimpan Order Baru
     */
    public function store(Request $request)
    {
        // 1. Ambil Tipe Model Produk
        $modelClass = $request->input('product_model');

        // 2. Aturan Validasi Dasar
        $rules = [
            'product_id' => 'required|integer',
            'product_model' => 'required|string',
            'final_amount' => 'required|numeric|min:0',
            'form_details' => 'required|array',
        ];

        // Validasi Cabang (Opsional untuk Pindahan, Wajib untuk Penitipan)
        if ($modelClass === Service::class) {
            $rules['form_details.branch_id'] = 'required|exists:branches,id';
        } else {
            // Untuk pindahan, branch_id mungkin tidak wajib di awal
            $rules['form_details.branch_id'] = 'nullable'; 
        }

        // 3. Tambahkan Aturan Spesifik Berdasarkan Tipe Produk
        if ($modelClass === Service::class) {
            // --- Aturan Layanan Penitipan ---
            $rules = array_merge($rules, [
                'form_details.start_date' => 'required|date|after_or_equal:today',
                'form_details.duration_value' => 'required|integer|min:1',
                'form_details.duration_unit' => 'required|string|in:hour,day,week,month',
                'form_details.delivery_method' => 'required|string|in:drop_off,pickup',
                'form_details.item_photo' => 'nullable|image|max:5120', // Max 5MB
                'form_details.notes' => 'nullable|string|max:1000',
            ]);

            // [PENTING] Validasi Kondisional: Jika Request Jemput (Pickup), Wajib Alamat & Telepon
            if ($request->input('form_details.delivery_method') === 'pickup') {
                $rules['form_details.alamat_penjemputan'] = 'required|string|max:500';
                $rules['form_details.telepon'] = 'required|string|max:20';
            } else {
                // Jika antar sendiri, field ini nullable
                $rules['form_details.alamat_penjemputan'] = 'nullable|string';
                $rules['form_details.telepon'] = 'nullable|string';
            }

        } elseif ($modelClass === MovingPackage::class) {
            // --- Aturan Paket Pindahan ---
            $rules = array_merge($rules, [
                'form_details.tanggal_pindahan' => 'required|date|after_or_equal:today',
                'form_details.telepon' => 'required|string|max:20',
                'form_details.alamat_penjemputan' => 'required|string|max:2000',
                'form_details.alamat_tujuan' => 'required|string|max:2000',
                'form_details.notes' => 'nullable|string|max:1000',
            ]);
        }

        // 4. Jalankan Validasi
        $validatedData = $request->validate($rules);
        $formDetails = $validatedData['form_details'];

        // 5. Handle Upload Foto Barang (Khusus Penitipan)
        if ($request->hasFile('form_details.item_photo')) {
            $path = $request->file('form_details.item_photo')->store('order_items', 'public');
            $formDetails['item_photo_path'] = $path; // Simpan path file
            unset($formDetails['item_photo']); // Hapus objek file mentah agar tidak error saat masuk JSON
        }

        // 6. Ambil Data Produk & Cabang
        $product = $modelClass::find($validatedData['product_id']);
        
        // Ambil data cabang jika ada (untuk disimpan snapshot namanya)
        if (!empty($formDetails['branch_id'])) {
             $branch = Branch::find($formDetails['branch_id']);
             $formDetails['branch_name'] = $branch ? $branch->name : 'Unknown';
             $formDetails['branch_address'] = $branch ? $branch->address : '';
        }

        if (!$product) {
            throw ValidationException::withMessages(['product_id' => 'Produk tidak ditemukan.']);
        }

        // 7. Kalkulasi Ulang Harga di Backend (Security Best Practice)
        // Agar user tidak bisa memanipulasi harga lewat Inspect Element
        $finalAmount = $validatedData['final_amount']; // Default pakai kiriman frontend (fallback)
        
        if ($modelClass === Service::class) {
            $basePrice = $product->price;
            $duration = $formDetails['duration_value'];
            
            // Multiplier Waktu (Samakan logika dengan frontend)
            $timeMultiplier = match($formDetails['duration_unit']) {
                'hour' => 0.1,
                'day' => 1,
                'week' => 6,   // Diskon
                'month' => 25, // Diskon
                default => 1,
            };

            // Multiplier Ukuran (Jika ada fitur ukuran, tambahkan logika di sini)
            // $sizeMultiplier = ...

            $calculatedTotal = round($basePrice * $duration * $timeMultiplier);
            
            // Timpa final amount dengan hasil hitungan server yang aman
            $finalAmount = $calculatedTotal;
        } elseif ($modelClass === MovingPackage::class) {
            // Untuk pindahan, harga biasanya tetap sesuai paket database
            $finalAmount = $product->price;
        }

        // 8. Buat Order
        $order = $product->orders()->create([
            'user_id' => Auth::id(),
            'final_amount' => $finalAmount,
            'user_form_details' => $formDetails, // Data JSON lengkap (termasuk alamat jemput & no hp)
            'status' => 'awaiting_payment',
        ]);

        $order->load('orderable');
        
        return response()->json([
            'message' => 'Order berhasil dibuat',
            'order' => $order
        ]);
    }

    /**
     * Menampilkan halaman upload pembayaran.
     */
    public function payment(Order $order)
    {
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }
        if ($order->status !== 'awaiting_payment') {
            return redirect()->route('order.success', $order);
        }
        
        $order->load('orderable');
        return Inertia::render('Order/Payment', [
            'order' => $order,
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
            'payment_proof' => 'required|image|mimes:jpg,jpeg,png|max:5120',
            'notes' => 'nullable|string|max:1000',
        ]);

        $path = $request->file('payment_proof')->store('payment_proofs', 'public');

        $order->payment()->create([
            'user_id' => Auth::id(),
            'payment_proof_path' => $path,
            'notes' => $request->input('notes'),
            'status' => 'pending_verification',
        ]);

        $order->update(['status' => 'awaiting_verification']);

        return response()->json(['orderStatus' => $order->status]);
    }

    /**
     * Menampilkan halaman sukses.
     */
    public function success(Order $order)
    {
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }
        return Inertia::render('Order/Success', [
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