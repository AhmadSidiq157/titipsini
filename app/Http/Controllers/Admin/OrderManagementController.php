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

// [PENTING] Kita Import DUA-DUANYA agar sistem berjalan lancar
// 1. Untuk Memberitahu User/Client (Link ke History)
use App\Notifications\OrderStatusNotification;
// 2. Untuk Memberitahu Kurir (Link ke Tugas Kurir - File yang kamu kirim tadi)
use App\Notifications\OrderAssignedNotification;

class OrderManagementController extends Controller
{
    /**
     * Menampilkan daftar pesanan.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $status = $request->input('status');

        $orders = Order::with(['user', 'orderable'])
            ->whereHasMorph('orderable', [Service::class])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('id', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($q) use ($search) {
                            $q->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        });
                });
            })
            ->when($status && $status !== 'all', function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Menampilkan detail pesanan.
     */
    public function show(Order $order)
    {
        if ($order->orderable_type !== Service::class) {
            abort(404);
        }

        $order->load(['user', 'orderable', 'payment', 'courier.courierVerification', 'trackings']);

        $couriers = User::whereHas('roles', function ($query) {
            $query->where('name', 'kurir');
        })->select('id', 'name', 'courier_status')->get();

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order,
            'couriers' => $couriers,
        ]);
    }

    /**
     * Verifikasi Pembayaran (Notif ke User).
     */
    public function verifyPayment(Request $request, $id) 
    {
        $order = Order::with('user', 'payment')->findOrFail($id);

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

        // [TRIGGER] Kirim ke USER (Pake OrderStatusNotification)
        if ($order->user) {
            $order->user->notify(new OrderStatusNotification($order, 'approved'));
        }

        return redirect()->back()->with('success', 'Pembayaran diverifikasi.');
    }

    /**
     * Menolak Pembayaran (Notif ke User).
     */
    public function rejectPayment(Request $request, Order $order)
    {
        if (!$order->payment) return redirect()->back();

        if ($order->payment->payment_proof_path) {
             Storage::disk('public')->delete($order->payment->payment_proof_path);
        }
        
        $order->payment->delete();
        $order->update(['status' => 'awaiting_payment']);

        // [TRIGGER] Kirim ke USER (Pake OrderStatusNotification)
        if ($order->user) {
            $order->user->notify(new OrderStatusNotification($order, 'rejected'));
        }

        return redirect()->back()->with('success', 'Pembayaran ditolak.');
    }

    /**
     * Selesaikan Order (Notif ke User).
     */
    public function completeOrder(Order $order)
    {
        $order->update(['status' => 'completed']);

        // [TRIGGER] Kirim ke USER (Pake OrderStatusNotification)
        if ($order->user) {
            $order->user->notify(new OrderStatusNotification($order, 'completed'));
        }

        return redirect()->back()->with('success', 'Pesanan selesai.');
    }

    /**
     * Assign Kurir (Notif ke User DAN Kurir).
     */
    public function assignCourier(Request $request, Order $order)
    {
        $courierIds = User::whereHas('roles', fn($q) => $q->where('name', 'kurir'))->pluck('id')->toArray();

        $validated = $request->validate([
            'courier_id' => ['required', 'integer', Rule::in($courierIds)],
        ]);

        $order->update([
            'courier_id' => $validated['courier_id'],
            'status' => 'courier_assigned', 
        ]);

        // 1. Notifikasi ke USER/CLIENT (Pake OrderStatusNotification)
        // Pesan: "Kurir sedang menuju lokasi"
        if ($order->user) {
            $order->user->notify(new OrderStatusNotification($order, 'pickup_ready'));
        }

        // 2. Notifikasi ke KURIR (Pake OrderAssignedNotification - File Kamu)
        // Pesan: "Tugas Baru Masuk!"
        $courier = User::find($validated['courier_id']);
        if ($courier) {
            $courier->notify(new OrderAssignedNotification($order));
        }

        return redirect()->back()->with('success', 'Kurir ditugaskan. Notifikasi terkirim ke User & Kurir!');
    }
}