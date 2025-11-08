<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CareerProgram;
use App\Models\InternshipPosition;
use App\Models\JobVacancy;
use App\Models\MovingPackage;
use App\Models\Service;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // <-- Pastikan ini Auth
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user(); // <-- Menggunakan Auth::user()

        // [PERBAIKAN LOGIKA]

        // 1. Cek apakah pengguna adalah admin
        if ($user->isAdmin()) {

            // --- JIKA PENGGUNA ADALAH ADMIN, KUMPULKAN SEMUA DATA STATISTIK ---
            $stats = [
                'total_users' => User::count(),
                'new_users_this_week' => User::where('created_at', '>=', Carbon::now()->subWeek())->count(),
                'total_job_vacancies' => JobVacancy::count(),
                'total_services' => Service::count(),
                'total_moving_packages' => MovingPackage::count(),
                'total_internship_positions' => InternshipPosition::count(),
                'total_career_programs' => CareerProgram::count(),
            ];

            // Contoh data aktivitas terbaru
            $recent_activities = [
                ['type' => 'user_registered', 'description' => 'User baru, Budi Santoso, telah mendaftar.', 'time' => '5 menit lalu'],
                ['type' => 'item_created', 'description' => 'Posisi Magang "Marketing Intern" telah ditambahkan.', 'time' => '1 jam lalu'],
                ['type' => 'item_updated', 'description' => 'Paket Pindahan "Luar Kota" telah diperbarui.', 'time' => '3 jam lalu'],
                ['type' => 'user_login', 'description' => 'Anda login ke sistem.', 'time' => 'Kemarin'],
            ];

            // Render komponen Admin/Dashboard
            return Inertia::render('Admin/Dashboard', [
                'stats' => $stats,
                'recentActivities' => $recent_activities,
            ]);
        }
        // 2. [BARU] Cek apakah pengguna adalah kurir
        else if ($user->isCourier()) {

            // Jika kurir, alihkan ke rute dashboard kurir
            // (Middleware IsCourier kemudian akan mengambil alih
            // dan mengarahkannya ke form verifikasi jika diperlukan)
            return redirect()->route('courier.dashboard');
        }
        // 3. Jika bukan admin atau kurir (dia adalah client)
        else {

            // Tampilkan dashboard pengguna biasa (client)
            return Inertia::render('Dashboard');
        }
    }
}
