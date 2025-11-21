<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MovingPackage;
use App\Models\Service;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;
use Inertia\Response; // <-- [PERBAIKAN] Ini dia baris yang hilang

class DashboardController extends Controller
{
    // [MODIFIKASI] Ganti return type ke 'Response|RedirectResponse'
    public function index(Request $request): Response|RedirectResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // 1. Cek apakah pengguna adalah admin
        if ($user->isAdmin()) {

            // --- JIKA ADMIN: Tampilkan Admin Dashboard ---
            $stats = [
                'total_users' => User::count(),
                'new_users_this_week' => User::where('created_at', '>=', Carbon::now()->subWeek())->count(),
                'total_services' => Service::count(),
                'total_moving_packages' => MovingPackage::count(),
               
            ];
            $recent_activities = [
                ['type' => 'user_registered', 'description' => 'User baru, Budi Santoso, telah mendaftar.', 'time' => '5 menit lalu'],
                ['type' => 'item_created', 'description' => 'Posisi Magang "Marketing Intern" telah ditambahkan.', 'time' => '1 jam lalu'],
                ['type' => 'item_updated', 'description' => 'Paket Pindahan "Luar Kota" telah diperbarui.', 'time' => '3 jam lalu'],
                ['type' => 'user_login', 'description' => 'Anda login ke sistem.', 'time' => 'Kemarin'],
            ];

            return Inertia::render('Admin/Dashboard', [
                'stats' => $stats,
                'recentActivities' => $recent_activities,
            ]);
        }
        // 2. Cek apakah pengguna adalah kurir
        else if ($user->isCourier()) {

            // JIKA KURIR: Arahkan ke rute dashboard kurir
            return redirect()->route('courier.dashboard');
        }
        // 3. [PERBAIKAN] Jika bukan admin atau kurir (dia adalah KLIEN)
        else {

            // JIKA KLIEN: Arahkan kembali ke Halaman Utama (Homepage)
            return redirect()->route('home');
        }
    }
}
