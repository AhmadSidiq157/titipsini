<?php

namespace App\Http\Controllers;

use App\Models\MovingPackage; // <-- Import model baru
use Illuminate\Http\Request;
use Inertia\Inertia;

class LayananPageController extends Controller
{
    public function show()
    {
        // Ambil semua data paket pindahan
        $packages = MovingPackage::all();

        // Kirim data ke komponen 'Layanan' sebagai prop 'packages'
        return Inertia::render('Layanan', [
            'packages' => $packages
        ]);
    }
}
