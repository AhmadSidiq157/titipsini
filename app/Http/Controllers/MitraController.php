<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class MitraController extends Controller
{
    /**
     * Menampilkan halaman landing page Mitra.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // ✅ DIPERBAIKI: Mengarahkan ke komponen React sesuai struktur folder Anda
        // Ini akan mencari file di resources/js/Pages/Mitra/index.jsx
        return Inertia::render('Mitra/index');
    }
}

