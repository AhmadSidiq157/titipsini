<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Service;
use App\Models\MovingPackage;
use App\Models\ManualPayment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule; // <-- [BARU] Import Rule untuk validasi

class OrderController extends Controller
{
    /**
     * Mengambil detail produk untuk modal (API-friendly).
     */
    public function create(Request $request)
    {
        // ... (Method 'create' Anda sudah sempurna, tidak perlu diubah)
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

        if ($product->price <= 0) {
            return response()->json(['message' => 'Layanan ini tidak dapat dipesan saat ini.'], 422);
        }

        return response()->json([
            'product' => $product,
            'productType' => $type,
            'productModelClass' => $productModelClass,
        ]);
    }

    /**
     * [MODIFIKASI TOTAL] Menyimpan data dari form pemesanan (Langkah 1).
     * Sekarang dengan validasi dinamis.
     */
    public function store(Request $request)
    {
        // 1. Validasi dasar (berlaku untuk semua jenis pesanan)
        $baseRules = [
            'product_id' => 'required|integer',
            'product_model' => ['required', 'string', Rule::in([Service::class, MovingPackage::class])],
            'final_amount' => 'required|numeric|min:1',
            'form_details' => 'required|array',
        ];

        // 2. Tentukan aturan validasi dinamis berdasarkan product_model
        $modelClass = $request->input('product_model');
        $formDetailRules = [];

        if ($modelClass === Service::class) {
            // Aturan untuk 'Penitipan'
            $formDetailRules = [
                'form_details.start_date' => 'required|date|after_or_equal:today',
                'form_details.end_date' => 'required|date|after:form_details.start_date',
                'form_details.notes' => 'nullable|string|max:1000',
            ];
        } elseif ($modelClass === MovingPackage::class) {
            // Aturan untuk 'Pindahan'
            $formDetailRules = [
                'form_details.tanggal_pindahan' => 'required|date|after_or_equal:today',
                'form_details.telepon' => 'required|string|max:20',
                'form_details.alamat_penjemputan' => 'required|string|max:2000',
                'form_details.alamat_tujuan' => 'required|string|max:2000',
                'form_details.notes' => 'nullable|string|max:1000',
            ];
        }

        // 3. Gabungkan semua aturan dan jalankan validasi
        $validatedData = $request->validate(array_merge($baseRules, $formDetailRules));

        // 4. Cari model produk (logika lama Anda, sudah benar)
        $product = $modelClass::find($validatedData['product_id']);
        if (!$product) {
            throw ValidationException::withMessages(['product_id' => 'Produk tidak valid.']);
        }

        // 5. Buat Order baru (logika lama Anda, sudah benar)
        $order = $product->orders()->create([
            'user_id' => Auth::id(),
            'final_amount' => $validatedData['final_amount'],
            'user_form_details' => $validatedData['form_details'], // <-- Gunakan data yg sudah divalidasi
            'status' => 'awaiting_payment', // Status: Menunggu pembayaran
        ]);

        // 6. Return JSON (logika lama Anda, sudah benar)
        $order->load('orderable'); // Muat detail produk untuk Step 2
        return response()->json([
            'order' => $order
        ]);
    }

    /**
     * Menampilkan halaman upload pembayaran (Langkah 3).
     */
    public function payment(Order $order)
    {
        // ... (Method 'payment' Anda tidak perlu diubah)
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
        // ... (Method 'submitPayment' Anda tidak perlu diubah)
        if ($order->user_id !== Auth::id()) {
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

        return response()->json([
            'orderStatus' => $order->status,
        ]);
    }

    /**
     * Menampilkan halaman "Terima Kasih / Sukses".
     */
    public function success(Order $order)
    {
        // ... (Method 'success' Anda tidak perlu diubah)
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }
        return Inertia::render('Order/Success', [
            'orderStatus' => $order->status,
        ]);
    }
    public function getStatus(Order $order)
    {
        // Pastikan user yang login adalah pemilik order ini
        if ($order->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Kirim status terbaru sebagai JSON
        return response()->json([
            'status' => $order->status
        ]);
    }
}
