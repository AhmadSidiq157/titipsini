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
    public function index(Request $request)
    {
        // Ambil parameter dari frontend
        $search = $request->input('search');
        $status = $request->input('status');

        $orders = Order::with(['user', 'orderable'])
            ->whereHasMorph('orderable', [Service::class])
            // 1. Logika Pencarian (Search)
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('id', 'like', "%{$search}%") // Cari ID Order
                        ->orWhereHas('user', function ($q) use ($search) {
                            $q->where('name', 'like', "%{$search}%") // Cari Nama User
                                ->orWhere('email', 'like', "%{$search}%"); // Cari Email User
                        });
                });
            })
            // 2. [PERBAIKAN] Logika Filter Status
            // Kita gunakan 'use ($status)' agar nilai string asli terbawa masuk
            ->when($status && $status !== 'all', function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString(); // Agar pagination tidak mereset filter

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            // Kirim balik filter ke frontend
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function show(Order $order)
    {
        if ($order->orderable_type !== Service::class) {
            abort(404);
        }

        // [UPDATE PENTING]: Tambahkan 'trackings' di sini
        $order->load(['user', 'orderable', 'payment', 'courier.courierVerification', 'trackings']);

        $couriers = User::whereHas('roles', function ($query) {
            $query->where('name', 'kurir');
        })->select('id', 'name', 'courier_status')->get();

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order,
            'couriers' => $couriers,
        ]);
    }

    public function approvePayment(Order $order)
    {
        if (!$order->payment || $order->payment->status !== 'pending_verification') {
            return redirect()->back()->with('error', 'Pembayaran tidak valid.');
        }

        $order->payment->update(['status' => 'verified']);

        $details = $order->user_form_details;
        $needsPickup = isset($details['delivery_method']) && $details['delivery_method'] === 'pickup';

        if ($needsPickup) {
            $order->update(['status' => 'ready_for_pickup']);
        } else {
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
        $order->update(['status' => 'completed']);
        return redirect()->back()->with('success', 'Pesanan selesai.');
    }

    public function assignCourier(Request $request, Order $order)
    {
        $courierIds = User::whereHas('roles', fn($q) => $q->where('name', 'kurir'))->pluck('id')->toArray();

        $validated = $request->validate([
            'courier_id' => ['required', 'integer', Rule::in($courierIds)],
        ]);

        $order->update([
            'courier_id' => $validated['courier_id'],
            'status' => 'ready_for_pickup',
        ]);

        return redirect()->back()->with('success', 'Kurir penjemputan berhasil ditugaskan!');
    }
}
