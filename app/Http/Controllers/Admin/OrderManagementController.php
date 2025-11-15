<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Models\Service; // <-- [BARU] Import
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class OrderManagementController extends Controller
{
    /**
     * Menampilkan daftar semua pesanan PENITIPAN.
     */
    public function index()
    {
        $orders = Order::with(['user', 'orderable'])
            // [MODIFIKASI] Hanya ambil order yang tipenya Service
            ->whereHasMorph('orderable', [Service::class])
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
        ]);
    }

    /**
     * Menampilkan detail satu pesanan PENITIPAN.
     */
    public function show(Order $order)
    {
        // [MODIFIKASI] Pastikan ini adalah order penitipan
        if ($order->orderable_type !== Service::class) {
            abort(404);
        }

        // [MODIFIKASI] Logika kurir dihapus
        $order->load(['user', 'orderable', 'payment']);

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order,
            // [MODIFIKASI] $couriers dihapus
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
        // [MODIFIKASI] Status order penitipan, misal 'processing' (sedang dititip)
        $order->update(['status' => 'processing']);

        return redirect()->route('admin.orders.show', $order->id)->with('success', 'Pembayaran berhasil diverifikasi.');
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
     * [DIHAPUS] Method assignCourier() sudah dihapus dari controller ini.
     */
}
