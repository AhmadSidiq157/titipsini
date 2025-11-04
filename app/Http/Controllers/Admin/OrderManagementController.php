<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

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
        $order->load(['user', 'orderable', 'payment']);

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order,
        ]);
    }

    /**
     * Menyetujui pembayaran.
     */
    public function approvePayment(Order $order)
    {
        // Pastikan ada pembayaran yang bisa diapprove
        if (!$order->payment || $order->payment->status !== 'pending_verification') {
            return redirect()->back()->with('error', 'Pembayaran tidak ditemukan atau sudah diproses.');
        }

        // Update status pembayaran
        $order->payment->update(['status' => 'verified']);

        // Update status pesanan utama
        $order->update(['status' => 'completed']);

        // TODO Nanti: Kirim email notifikasi ke user bahwa pesanan dikonfirmasi

        return redirect()->route('admin.orders.show', $order->id)->with('success', 'Pembayaran berhasil diverifikasi.');
    }

    /**
     * Menolak pembayaran.
     */
    public function rejectPayment(Request $request, Order $order)
    {
        // Pastikan ada pembayaran yang bisa direject
        if (!$order->payment) {
            return redirect()->back()->with('error', 'Pembayaran tidak ditemukan.');
        }

        $payment = $order->payment;

        // 1. Hapus file bukti bayar dari storage
        Storage::disk('public')->delete($payment->payment_proof_path);

        // 2. Hapus record pembayaran
        $payment->delete();

        // 3. Kembalikan status order ke "awaiting_payment"
        $order->update(['status' => 'awaiting_payment']);

        // TODO Nanti: Kirim email notifikasi ke user bahwa pembayaran ditolak & suruh upload ulang

        return redirect()->route('admin.orders.show', $order->id)->with('success', 'Pembayaran ditolak. User harus meng-upload ulang.');
    }
}
