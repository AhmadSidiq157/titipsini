<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Service;
use App\Models\MovingPackage;
use App\Models\ManualPayment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator; // <-- 1. TAMBAHKAN IMPORT INI
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    /**
     * Mengambil detail produk untuk modal (API-friendly).
     */
    public function create(Request $request)
    {
        // --- 2. GANTI BLOK VALIDASI ---
        // Kita butuh validator manual agar bisa return JSON 422
        $validator = Validator::make($request->all(), [
            'type' => 'required|string|in:service,moving_package',
            'id' => 'required|integer',
        ]);

        // Jika validasi gagal, kirim error JSON, jangan redirect
        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 422);
        }
        // --- AKHIR BLOK PENGGANTI ---

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

        // --- 3. GANTI BLOK VALIDASI HARGA ---
        // Jika tidak ada harga, jangan redirect, kirim error JSON
        if ($product->price <= 0) {
            return response()->json(['message' => 'Layanan ini tidak dapat dipesan saat ini.'], 422);
        }
        // --- AKHIR BLOK PENGGANTI ---

        // --- 4. GANTI RESPONS ---
        // Kirim JSON murni, bukan halaman Inertia
        return response()->json([
            'product' => $product,
            'productType' => $type,
            'productModelClass' => $productModelClass,
        ]);
        // --- AKHIR BLOK PENGGANTI ---
    }

    /**
     * Menyimpan data dari form pemesanan (Langkah 1 & 2).
     * Membuat Order, lalu redirect ke halaman pembayaran.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|integer',
            'product_model' => 'required|string', // cth: "App\Models\Service"
            'final_amount' => 'required|numeric|min:1',
            'form_details' => 'required|array', // Data dari form (cth: tanggal, alamat, dll)
        ]);

        // Cari model produk berdasarkan string yg dikirim
        $modelClass = $request->input('product_model');
        $product = $modelClass::find($request->input('product_id'));

        if (!$product) {
            throw ValidationException::withMessages(['product_id' => 'Produk tidak valid.']);
        }

        // Buat Order baru
        $order = $product->orders()->create([
            'user_id' => Auth::id(),
            'final_amount' => $request->input('final_amount'),
            'user_form_details' => $request->input('form_details'),
            'status' => 'awaiting_payment', // Status: Menunggu pembayaran
        ]);

        // --- 5. GANTI RESPONS (PENTING!) ---
        // Karena ini dipanggil oleh modal, kita return data 'order' sebagai JSON
        // Kita tidak bisa redirect di sini
        $order->load('orderable'); // Muat detail produk untuk Step 2
        return response()->json([
            'order' => $order
        ]);
    }

    /**
     * Menampilkan halaman upload pembayaran (Langkah 3).
     * (Fungsi ini tidak lagi dipakai oleh modal, tapi kita biarkan saja)
     */
    public function payment(Order $order)
    {
        // ... (kode lama biarkan saja)
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
     * Menyimpan bukti pembayaran (Langkah 3).
     */
    public function submitPayment(Request $request, Order $order)
    {
        if ($order->user_id !== Auth::id()) {
            // --- 6. GANTI RESPONS ERROR ---
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'payment_proof' => 'required|image|mimes:jpg,jpeg,png|max:2048',
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

        // --- 7. GANTI RESPONS SUKSES ---
        // Kirim status order baru sebagai JSON
        return response()->json([
            'orderStatus' => $order->status,
        ]);
    }

    /**
     * Menampilkan halaman "Terima Kasih / Sukses".
     * (Fungsi ini tidak lagi dipakai oleh modal, tapi kita biarkan saja)
     */
    public function success(Order $order)
    {
        // ... (kode lama biarkan saja)
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }
        return Inertia::render('Order/Success', [
            'orderStatus' => $order->status,
        ]);
    }
}
