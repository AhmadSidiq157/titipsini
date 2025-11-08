<?php

namespace App\Http\Controllers\Courier; // <-- Namespace Kurir

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // <-- Pastikan ini ada
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Menampilkan dashboard untuk kurir.
     */
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Ambil tugas (orders) yang ditugaskan ke kurir ini
        // Kita juga load relasi 'user' (client) agar tahu siapa pemesannya
        $tasks = $user->courierTasks()
            ->with('user') // 'user' adalah relasi client di model Order
            ->whereIn('status', ['ready_for_pickup', 'picked_up', 'on_delivery'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Courier/Dashboard', [
            'tasks' => $tasks,
        ]);
    }
}
