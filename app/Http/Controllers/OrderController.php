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

        return response()->json([
            'product' => $product,
            'productType' => $type,
            'productModelClass' => $productModelClass,
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
            // Kita hapus validasi 'final_amount' input, karena kita akan hitung sendiri
            'form_details' => 'required|array',
        ];

        // Validasi Cabang (Wajib untuk Penitipan/Service)
        if ($modelClass === Service::class) {
            $rules['form_details.branch_id'] = 'required|exists:branches,id';
        } else {
            $rules['form_details.branch_id'] = 'nullable';
        }

        // 3. Tambahkan Aturan Spesifik
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

            // Jika Request Jemput (Pickup), Wajib Alamat & Telepon
            if ($request->input('form_details.delivery_method') === 'pickup') {
                $rules['form_details.alamat_penjemputan'] = 'required|string|max:500';
                $rules['form_details.telepon'] = 'required|string|max:20';
            } else {
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

        // 5. Handle Upload Foto Barang (Jika ada)
        if ($request->hasFile('form_details.item_photo')) {
            $path = $request->file('form_details.item_photo')->store('order_items', 'public');
            $formDetails['item_photo_path'] = $path;
            unset($formDetails['item_photo']); // Hapus objek file mentah
        }

        // 6. Ambil Data Produk Asli dari Database
        $product = $modelClass::find($validatedData['product_id']);

        // Snapshot Data Cabang (Agar aman jika data cabang berubah di masa depan)
        if (!empty($formDetails['branch_id'])) {
            $branch = Branch::find($formDetails['branch_id']);
            $formDetails['branch_name'] = $branch ? $branch->name : 'Unknown';
            $formDetails['branch_address'] = $branch ? $branch->address : '';
        }

        if (!$product) {
            throw ValidationException::withMessages(['product_id' => 'Produk tidak ditemukan.']);
        }

        // 7. SECURITY: Kalkulasi Ulang Harga di Backend
        $finalAmount = 0;

        if ($modelClass === Service::class) {
            $basePrice = $product->price;
            $duration = (int) $formDetails['duration_value'];

            // Logic Multiplier (HARUS SAMA PERSIS dengan Frontend)
            $timeMultiplier = match ($formDetails['duration_unit']) {
                'hour' => 0.1,
                'day' => 1,
                'week' => 6,   // Diskon: Bayar 6 hari dapat 1 minggu
                'month' => 25, // Diskon: Bayar 25 hari dapat 1 bulan
                default => 1,
            };

            $finalAmount = round($basePrice * $duration * $timeMultiplier);
        } elseif ($modelClass === MovingPackage::class) {
            // Untuk pindahan, harga fix sesuai paket
            $finalAmount = $product->price;
        }

        // 8. Buat Order
        $order = $product->orders()->create([
            'user_id' => Auth::id(),
            'final_amount' => $finalAmount, // Menggunakan harga hitungan server
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
            // Support Image + PDF
            'payment_proof' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'notes' => 'nullable|string|max:1000',
        ]);

        $path = $request->file('payment_proof')->store('payment_proofs', 'public');

        // Simpan ke tabel manual_payments (Relasi Morph/HasOne)
        // Pastikan Model Order punya method payment()
        $order->payment()->create([
            'user_id' => Auth::id(),
            'payment_proof_path' => $path,
            'notes' => $request->input('notes'),
            'status' => 'pending_verification',
            'amount' => $order->final_amount, // Rekam jumlah yang dibayar
        ]);

        // Update status order utama
        $order->update(['status' => 'awaiting_verification']);

        return response()->json(['orderStatus' => $order->status]);
    }

    /**
     * Polling status order (Untuk Step 3 Success Page).
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
