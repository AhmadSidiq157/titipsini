<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Service;       // Model Layanan (Gudang/Barang)
use App\Models\MovingPackage; // Model Paket Pindahan
use App\Models\Branch;        // [PENTING] Jangan lupa import Model Branch

class LayananPageController extends Controller
{
    /**
     * Method untuk Halaman "Pindahan"
     * Route: /pindahan
     * View: resources/js/Pages/Pindahan.jsx
     */
    public function pindahan() // <--- NAMA FUNCTION DIGANTI DARI 'show' KE 'pindahan'
    {
        // Ambil data paket pindahan
        $packages = MovingPackage::all();
        
        // Ambil data service juga (jika diperlukan di footer/rekomendasi)
        $services = Service::all();
        
        // [PERBAIKAN] Ambil data cabang untuk dropdown di modal
        $branches = Branch::all();

        $user = Auth::user();
        $verificationStatus = null;

        if ($user) {
            $user->load('verification');
            $verificationStatus = $user->verification?->status;
        }

        // Render ke file Pindahan.jsx
        return Inertia::render('Pindahan', [
            'packages' => $packages,
            'services' => $services, 
            'branches' => $branches, // [PERBAIKAN] Kirim data cabang ke view
            'userVerificationStatus' => $verificationStatus,
        ]);
    }

    /**
     * Method untuk Halaman Khusus "Penitipan"
     * Route: /penitipan
     * View: resources/js/Pages/Penitipan.jsx
     */
    public function penitipan()
    {
        $services = Service::all();
        
        // [PERBAIKAN] Ambil data cabang juga untuk halaman penitipan (jika modal order dipakai di sini juga)
        $branches = Branch::all();
        
        $user = Auth::user();
        $verificationStatus = null;

        if ($user) {
            $user->load('verification');
            $verificationStatus = $user->verification?->status;
        }

        // Render ke file Penitipan.jsx
        return Inertia::render('Penitipan', [
            'services' => $services,
            'branches' => $branches, // [PERBAIKAN] Kirim data cabang ke view
            'userVerificationStatus' => $verificationStatus,
        ]);
    }
}