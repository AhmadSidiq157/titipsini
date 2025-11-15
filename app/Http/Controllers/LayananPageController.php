<?php

namespace App\Http\Controllers;

use App\Models\MovingPackage; // Model Anda sudah ada
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth; // <-- [BARU] Import Auth

class LayananPageController extends Controller
{
    public function show()
    {
        // 1. Ambil semua data paket pindahan (kode asli Anda)
        $packages = MovingPackage::all();

        // 2. [BARU] Ambil data verifikasi KTP user
        $user = Auth::user();
        $verificationStatus = null; // Default untuk tamu (guest)

        if ($user) {
            // Kita muat relasi 'verification' (verifikasi KTP klien)
            $user->load('verification');

            // Dapatkan statusnya (bisa null, 'pending', 'approved', 'rejected')
            $verificationStatus = $user->verification?->status;
        }

        // 3. Kirim data 'packages' DAN 'userVerificationStatus' ke frontend
        return Inertia::render('Layanan', [
            'packages' => $packages,
            'userVerificationStatus' => $verificationStatus, // <-- [BARU] Prop yang hilang
        ]);
    }
}
