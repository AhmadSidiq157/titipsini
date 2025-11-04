<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service; // Import model Service
use Illuminate\Foundation\Application; // Import Application
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route; // Import Route
use Illuminate\Support\Facades\Auth;  // <-- 1. TAMBAHKAN IMPORT INI
use Inertia\Inertia;

class WelcomeController extends Controller
{
    public function index()
    {
        // Ambil semua data dari model Service
        $services = Service::all();

        // --- 2. TAMBAHKAN BLOK LOGIKA INI ---
        $user = Auth::user();
        $verificationStatus = null;

        // Cek status verifikasi KTP hanya jika user sudah login
        if ($user) {
            // Kita panggil relasi 'verification' yang sudah kita buat di Model User
            $verification = $user->verification;

            // Tentukan statusnya: 'null' (belum isi), 'pending', 'approved', 'rejected'
            $verificationStatus = $verification ? $verification->status : null;
        }
        // --- AKHIR BLOK ---

        // Render komponen React 'Welcome' dan kirim semua data yang dibutuhkan
        return Inertia::render('Welcome', [
            'services' => $services,
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,

            // --- 3. TAMBAHKAN PROP BARU INI ---
            'userVerificationStatus' => $verificationStatus,
        ]);
    }
}
