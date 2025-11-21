<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Service;       // Model Layanan (Gudang/Barang)
use App\Models\MovingPackage; // Model Paket Pindahan

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

        $user = Auth::user();
        $verificationStatus = null;

        if ($user) {
            $user->load('verification');
            $verificationStatus = $user->verification?->status;
        }

        // Render ke file Pindahan.jsx
        return Inertia::render('Pindahan', [
            'packages' => $packages,
            'services' => $services, // Opsional jika tidak dipakai di page Pindahan bisa dihapus
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
        
        $user = Auth::user();
        $verificationStatus = null;

        if ($user) {
            $user->load('verification');
            $verificationStatus = $user->verification?->status;
        }

        // Render ke file Penitipan.jsx
        return Inertia::render('Penitipan', [
            'services' => $services,
            'userVerificationStatus' => $verificationStatus,
        ]);
    }
}