<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class HistoryController extends Controller
{
    /**
     * Menampilkan daftar riwayat pesanan.
     */
    public function index(): Response
    {
        $user = Auth::user();

        $orders = Order::where('user_id', $user->id)
            ->with([
                'user',      // [DITAMBAHKAN] Agar order.user.name bisa dibaca di Frontend
                'orderable',
                'payment',
                'trackings' => function ($query) {
                    $query->latest();
                },
                'courier' => function ($query) {
                    $query->select('id', 'name', 'email', 'phone', 'courier_status');
                },
                'courier.courierVerification'
            ])
            ->latest()
            ->paginate(10);

        return Inertia::render('History/Index', [
            'orders' => $orders,
        ]);
    }

    /**
     * Menampilkan detail satu pesanan.
     */
    public function show(Order $order): Response
    {
        $user = Auth::user();

        if ($order->user_id !== $user->id) {
            abort(403, 'Anda tidak memiliki akses ke pesanan ini.');
        }

        $order->load([
            'user', // [DITAMBAHKAN] Penting untuk halaman detail juga
            'orderable',
            'payment',
            'trackings' => function ($query) {
                $query->latest();
            },
            'courier' => function ($query) {
                $query->select('id', 'name', 'phone', 'courier_status', 'latitude', 'longitude');
            },
            'courier.courierVerification'
        ]);

        return Inertia::render('History/Show', [
            'order' => $order,
        ]);
    }
}
