<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class OrderManagementController extends Controller
{
    public function index()
    {
        $orders = Order::with(['user', 'orderable'])
            ->whereHasMorph('orderable', [Service::class])
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order)
    {
        if ($order->orderable_type !== Service::class) {
            abort(404);
        }

        // [MODIFIKASI] Load relasi courier dan courierVerification
        $order->load(['user', 'orderable', 'payment', 'courier.courierVerification']);

        // [BARU] Ambil daftar kurir untuk dropdown
        $couriers = User::whereHas('roles', function ($query) {
            $query->where('name', 'kurir');
        })->select('id', 'name', 'courier_status')->get();

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order,
            'couriers' => $couriers, // Kirim ke frontend
        ]);
    }

    public function approvePayment(Order $order)
    {
        if (!$order->payment || $order->payment->status !== 'pending_verification') {
            return redirect()->back()->with('error', 'Pembayaran tidak valid.');
        }

        $order->payment->update(['status' => 'verified']);

        // [LOGIKA BARU]
        // Cek apakah user minta dijemput?
        $details = $order->user_form_details; // array
        $needsPickup = isset($details['delivery_method']) && $details['delivery_method'] === 'pickup';

        if ($needsPickup) {
            // Jika butuh jemput, status jadi 'ready_for_pickup' (Tunggu Kurir)
            $order->update(['status' => 'ready_for_pickup']);
        } else {
            // Jika antar sendiri, langsung 'processing' (Disimpan)
            $order->update(['status' => 'processing']);
        }

        return redirect()->back()->with('success', 'Pembayaran diterima.');
    }

    public function rejectPayment(Request $request, Order $order)
    {
        if (!$order->payment) return redirect()->back();

        Storage::disk('public')->delete($order->payment->payment_proof_path);
        $order->payment->delete();
        $order->update(['status' => 'awaiting_payment']);

        return redirect()->back()->with('success', 'Pembayaran ditolak.');
    }

    public function completeOrder(Order $order)
    {
        // Selesaikan pesanan (barang diambil kembali oleh klien)
        $order->update(['status' => 'completed']);
        return redirect()->back()->with('success', 'Pesanan selesai.');
    }

    /**
     * [BARU] Method Assign Courier untuk Penitipan
     */
    public function assignCourier(Request $request, Order $order)
    {
        $courierIds = User::whereHas('roles', fn($q) => $q->where('name', 'kurir'))->pluck('id')->toArray();

        $validated = $request->validate([
            'courier_id' => ['required', 'integer', Rule::in($courierIds)],
        ]);

        $order->update([
            'courier_id' => $validated['courier_id'],
            // Tetap 'ready_for_pickup' sampai kurir ambil barangnya
            'status' => 'ready_for_pickup',
        ]);

        return redirect()->back()->with('success', 'Kurir penjemputan berhasil ditugaskan!');
    }
}
