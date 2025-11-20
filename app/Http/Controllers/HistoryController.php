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
     * Menampilkan riwayat pesanan milik user yang sedang login.
     */
    public function index(): Response
    {
        $user = Auth::user();

        // Ambil semua order milik user ini
        $orders = Order::where('user_id', $user->id)
            ->with([
                'orderable', // Detail Paket (Nama, Harga, dll)
                'payment',   // Status Pembayaran & Bukti

                // [BARU] Muat data tracking (Timeline perjalanan)
                'trackings' => function ($query) {
                    $query->latest(); // Urutkan tracking dari yang terbaru
                },

                // [BARU] Muat data Kurir (Hanya jika sudah ditugaskan)
                'courier' => function ($query) {
                    $query->select('id', 'name', 'email', 'phone', 'courier_status');
                },

                // [BARU] Muat detail kendaraan kurir (Plat nomor, Jenis Mobil)
                // Ini penting agar klien merasa aman
                'courier.courierVerification'
            ])
            ->latest() // Urutkan pesanan dari yang terbaru dibuat
            ->paginate(10); // Pagination 10 item per halaman

        return Inertia::render('History/Index', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order)
    {
        $user = \Illuminate\Support\Facades\Auth::user();

        // KEAMANAN: Pastikan user hanya bisa melihat order miliknya sendiri
        if ($order->user_id !== $user->id) {
            abort(403, 'Anda tidak memiliki akses ke pesanan ini.');
        }

        // Load semua relasi lengkap
        $order->load([
            'orderable',
            'payment',
            'trackings' => function ($query) {
                $query->latest();
            },
            'courier' => function ($query) {
                $query->select('id', 'name', 'phone', 'courier_status', 'latitude', 'longitude');
            },
            'courier.courierVerification' // Untuk plat nomor & jenis kendaraan
        ]);

        return Inertia::render('History/Show', [
            'order' => $order,
        ]);
    }
}
