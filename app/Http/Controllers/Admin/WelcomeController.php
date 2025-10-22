<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service; // Import model Service
use Illuminate\Foundation\Application; // Import Application
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route; // Import Route
use Inertia\Inertia;

class WelcomeController extends Controller
{
    public function index()
    {
        // Ambil semua data dari model Service
        $services = Service::all();

        // Render komponen React 'Welcome' dan kirim semua data yang dibutuhkan
        return Inertia::render('Welcome', [
            'services' => $services, // <-- Data dinamis kita
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
        ]);
    }
}
