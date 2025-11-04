<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Service;
use App\Models\MovingPackage;
use App\Models\ManualPayment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    /**
     * Menampilkan halaman form pemesanan (Langkah 1 & 2 Anda digabung).
     * Pengguna memilih produk di 'Welcome.jsx', lalu diarahkan ke sini.
     */
    public function create(Request $request)
    {
        // Validasi input query string (apa yg dibeli?)
        $request->validate([
            'type' => 'required|string|in:service,moving_package',
            'id' => 'required|integer',
        ]);

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

        // Jika tidak ada harga, jangan biarkan dipesan
        if ($product->price <= 0) {
            return redirect()->route('home')->with('error', 'Layanan ini tidak dapat dipesan saat ini.');
        }

        return Inertia::render('Order/Create', [
            'product' => $product,
            'productType' => $type,
            'productModelClass' => $productModelClass,
        ]);
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

        // Redirect ke halaman upload bukti bayar
        return redirect()->route('order.payment', $order);
    }

    /**
     * Menampilkan halaman upload pembayaran (Langkah 3).
     */
    public function payment(Order $order)
    {
        // Pastikan hanya pemilik order yg bisa bayar
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }

        // Pastikan order ini memang sedang menunggu pembayaran
        if ($order->status !== 'awaiting_payment') {
            return redirect()->route('order.success', $order);
        }

        // Ambil data produk yg dipesan
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
        // Pastikan hanya pemilik order yg bisa submit
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'payment_proof' => 'required|image|mimes:jpg,jpeg,png|max:2048',
            'notes' => 'nullable|string|max:1000',
        ]);

        // 1. Upload file
        $path = $request->file('payment_proof')->store('payment_proofs', 'public');

        // 2. Buat record ManualPayment
        $order->payment()->create([
            'user_id' => Auth::id(),
            'payment_proof_path' => $path,
            'notes' => $request->input('notes'),
            'status' => 'pending_verification',
        ]);

        // 3. Update status order utama
        $order->update(['status' => 'awaiting_verification']);

        // 4. Redirect ke halaman sukses
        return redirect()->route('order.success', $order);
    }

    /**
     * Menampilkan halaman "Terima Kasih / Sukses".
     */
    public function success(Order $order)
    {
        // Pastikan hanya pemilik order yg bisa lihat
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Order/Success', [
            'orderStatus' => $order->status,
        ]);
    }
}
