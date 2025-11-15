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
        // Kita WAJIB memuat 'orderable' (untuk tahu nama paketnya)
        // dan 'payment' (untuk tahu status pembayarannya)
        $orders = Order::where('user_id', $user->id)
            ->with(['orderable', 'payment'])
            ->latest() // Tampilkan yang terbaru di atas
            ->paginate(15); // Buat pagination

        return Inertia::render('History/Index', [
            'orders' => $orders,
        ]);
    }
}
