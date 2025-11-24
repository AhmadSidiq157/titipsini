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

        // Ambil semua order milik user ini dengan relasi yang dibutuhkan
        $orders = Order::where('user_id', $user->id)
            ->with([
                'orderable', // Detail Paket (Nama, Harga)
                'payment',   // Status Pembayaran

                // Untuk menampilkan status tracking terakhir di kartu list
                'trackings' => function ($query) {
                    $query->latest();
                },

                // Info Kurir untuk tombol Chat WA di halaman list
                'courier' => function ($query) {
                    $query->select('id', 'name', 'email', 'phone', 'courier_status');
                },

                // Info Kendaraan Kurir
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

        // KEAMANAN: Pastikan user hanya bisa melihat order miliknya sendiri
        if ($order->user_id !== $user->id) {
            abort(403, 'Anda tidak memiliki akses ke pesanan ini.');
        }

        // Load semua relasi lengkap untuk halaman Detail
        $order->load([
            'orderable',
            'payment',

            // Riwayat Tracking lengkap
            'trackings' => function ($query) {
                $query->latest();
            },

            // Info Kurir + Lokasi GPS (PENTING untuk Live Map)
            'courier' => function ($query) {
                $query->select('id', 'name', 'phone', 'courier_status', 'latitude', 'longitude');
            },

            // Detail Kendaraan
            'courier.courierVerification'
        ]);

        return Inertia::render('History/Show', [
            'order' => $order,
            // Kita bisa tambahkan settings global di HandleInertiaRequests, 
            // tapi data order sudah cukup lengkap di sini.
        ]);
    }
}
