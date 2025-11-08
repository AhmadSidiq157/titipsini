<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User; // <-- [PENTING] Pastikan ini ada
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule; // <-- [PENTING] Pastikan ini ada

class OrderManagementController extends Controller
{
    /**
     * Menampilkan daftar semua pesanan.
     */
    public function index()
    {
        $orders = Order::with(['user', 'orderable'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
        ]);
    }

    /**
     * Menampilkan detail satu pesanan untuk diverifikasi.
     */
    public function show(Order $order)
    {
        // Load relasi yang diperlukan
        $order->load(['user', 'orderable', 'payment', 'courier']);

        // [BARU] Ambil daftar user yang rolenya 'kurir'
        $couriers = User::whereHas('roles', function ($query) {
            $query->where('name', 'kurir');
        })->select('id', 'name')->get();

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order,
            'couriers' => $couriers, // Kirim daftar kurir ke frontend
        ]);
    }

    /**
     * Menyetujui pembayaran.
     */
    public function approvePayment(Order $order)
    {
        if (!$order->payment || $order->payment->status !== 'pending_verification') {
            return redirect()->back()->with('error', 'Pembayaran tidak ditemukan atau sudah diproses.');
        }

        $order->payment->update(['status' => 'verified']);
        // [UPDATE] Ubah status order menjadi 'processing' (siap ditugaskan)
        $order->update(['status' => 'processing']);

        return redirect()->route('admin.orders.show', $order->id)->with('success', 'Pembayaran berhasil diverifikasi. Order siap ditugaskan.');
    }

    /**
     * Menolak pembayaran.
     */
    public function rejectPayment(Request $request, Order $order)
    {
        if (!$order->payment) {
            return redirect()->back()->with('error', 'Pembayaran tidak ditemukan.');
        }

        $payment = $order->payment;
        Storage::disk('public')->delete($payment->payment_proof_path);
        $payment->delete();
        $order->update(['status' => 'awaiting_payment']);

        return redirect()->route('admin.orders.show', $order->id)->with('success', 'Pembayaran ditolak. User harus meng-upload ulang.');
    }

    /**
     * [PERBAIKAN TOTAL] Menugaskan kurir ke pesanan.
     */
    public function assignCourier(Request $request, Order $order)
    {
        // 1. Pastikan order sudah dibayar
        if ($order->status !== 'processing' && $order->status !== 'ready_for_pickup') {
            return redirect()->back()->with('error', 'Pesanan ini belum bisa ditugaskan ke kurir.');
        }

        // 2. [PERBAIKAN] Ambil daftar ID kurir yang valid
        $courierIds = User::whereHas('roles', function ($query) {
            $query->where('name', 'kurir');
        })->pluck('id')->toArray();

        // 3. Validasi input
        $validated = $request->validate([
            'courier_id' => [
                'required',
                'integer',
                // [PERBAIKAN] Validasi bahwa courier_id HARUS ada di dalam daftar ID kurir
                Rule::in($courierIds),
            ],
        ], [
            // Pesan error kustom
            'courier_id.in' => 'User yang dipilih bukan seorang kurir atau tidak valid.'
        ]);

        // 4. Update order
        $order->update([
            'courier_id' => $validated['courier_id'],
            'status' => 'ready_for_pickup', // Status baru: siap dijemput kurir
        ]);

        return redirect()->route('admin.orders.show', $order->id)->with('success', 'Kurir berhasil ditugaskan!');
    }
}
