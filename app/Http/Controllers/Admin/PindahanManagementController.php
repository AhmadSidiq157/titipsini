<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Models\MovingPackage; // <-- [BARU] Import
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Redirect; // <-- [BARU] Import

class PindahanManagementController extends Controller
{
    /**
     * Menampilkan daftar semua pesanan PINDAHAN.
     */
    public function index()
    {
        $orders = Order::with(['user', 'orderable', 'payment', 'courier'])
            ->whereHasMorph('orderable', [MovingPackage::class])
            ->latest()
            ->paginate(10);

        // [MODIFIKASI] Ambil 'courier_status' juga, bukan cuma id dan name
        $couriers = User::whereHas('roles', function ($query) {
            $query->where('name', 'kurir');
        })->select('id', 'name', 'courier_status')->get(); // <-- UBAH DI SINI

        return Inertia::render('Admin/Pindahan/Index', [
            'orders' => $orders,
            'couriers' => $couriers,
        ]);
    }

    /**
     * Menyetujui pembayaran.
     */
    public function approvePayment(Order $order)
    {
        if (!$order->payment || $order->payment->status !== 'pending_verification') {
            return Redirect::back()->with('error', 'Pembayaran tidak ditemukan atau sudah diproses.');
        }

        $order->payment->update(['status' => 'verified']);
        $order->update(['status' => 'processing']); // Siap ditugaskan

        // [MODIFIKASI] Redirect kembali ke halaman Index
        return Redirect::back()->with('success', 'Pembayaran berhasil diverifikasi. Order siap ditugaskan.');
    }

    /**
     * Menolak pembayaran.
     */
    public function rejectPayment(Request $request, Order $order)
    {
        if (!$order->payment) {
            return Redirect::back()->with('error', 'Pembayaran tidak ditemukan.');
        }

        $payment = $order->payment;
        Storage::disk('public')->delete($payment->payment_proof_path);
        $payment->delete();
        $order->update(['status' => 'awaiting_payment']);

        // [MODIFIKASI] Redirect kembali ke halaman Index
        return Redirect::back()->with('success', 'Pembayaran ditolak. User harus meng-upload ulang.');
    }

    /**
     * Menugaskan kurir ke pesanan.
     */
    public function assignCourier(Request $request, Order $order)
    {
        // 1. Pastikan order sudah dibayar
        if ($order->status !== 'processing' && $order->status !== 'ready_for_pickup') {
            return Redirect::back()->with('error', 'Pesanan ini belum bisa ditugaskan ke kurir.');
        }

        // 2. Ambil daftar ID kurir yang valid
        $courierIds = User::whereHas('roles', function ($query) {
            $query->where('name', 'kurir');
        })->pluck('id')->toArray();

        // 3. Validasi input
        $validated = $request->validate([
            'courier_id' => [
                'required',
                'integer',
                Rule::in($courierIds),
            ],
        ], [
            'courier_id.in' => 'User yang dipilih bukan seorang kurir atau tidak valid.'
        ]);

        // 4. Update order
        $order->update([
            'courier_id' => $validated['courier_id'],
            'status' => 'ready_for_pickup', // Status baru: siap dijemput kurir
        ]);

        // [MODIFIKASI] Redirect kembali ke halaman Index
        return Redirect::back()->with('success', 'Kurir berhasil ditugaskan!');
    }
}
