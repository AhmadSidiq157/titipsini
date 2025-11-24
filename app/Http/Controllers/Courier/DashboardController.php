<?php

namespace App\Http\Controllers\Courier;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Ambil 10 Tugas Aktif Teratas (Prioritas)
        $activeTasks = $user->courierTasks()
            ->with(['user', 'orderable']) // Eager load data user & paket
            ->whereIn('status', ['ready_for_pickup', 'picked_up', 'on_delivery', 'processing'])
            ->latest()
            ->get(); // Ambil semua yang aktif (biasanya tidak banyak)

        // Ambil 20 Riwayat Terakhir
        $completedTasks = $user->courierTasks()
            ->with(['user', 'orderable'])
            ->whereIn('status', ['delivered', 'completed', 'cancelled', 'rejected'])
            ->latest()
            ->limit(20) // Batasi agar tidak berat
            ->get();

        // Hitung statistik ringkas
        $stats = [
            'active' => $activeTasks->count(),
            'completed' => $user->courierTasks()->where('status', 'completed')->count(),
            'rating' => 5.0, // Placeholder, nanti bisa diambil dari tabel review
        ];

        return Inertia::render('Courier/Dashboard', [
            'activeTasks' => $activeTasks,
            'completedTasks' => $completedTasks,
            'stats' => $stats,
        ]);
    }

    /**
     * Fitur Toggle Status Online/Offline
     */
    public function toggleStatus(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Toggle logika: Jika available -> offline, Jika offline -> available
        $newStatus = $user->courier_status === 'available' ? 'offline' : 'available';

        $user->update(['courier_status' => $newStatus]);

        return back()->with('success', 'Status Anda sekarang: ' . ucfirst($newStatus));
    }
}
