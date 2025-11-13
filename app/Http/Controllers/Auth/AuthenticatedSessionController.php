<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // <-- Pastikan Auth di-import
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        // --- [INI DIA PERBAIKANNYA] ---
        
        // 1. Ambil user yang baru saja login
        $user = Auth::user();

        // 2. Eager load relasi 'roles' (berdasarkan file UserManagementController kamu)
        // Pastikan model User kamu punya: public function roles() { return $this->belongsToMany(Role::class); }
        $user->load('roles'); 

        // 3. Cek apakah user punya role 'admin'
        // (Pastikan 'admin' adalah nama role di database kamu)
        if ($user->roles->contains('name', 'admin')) {
            
            // JIKA ADMIN: Arahkan ke rute 'dashboard' (Admin Dashboard)
            return redirect()->intended(route('dashboard', absolute: false));

        } else {
            
            // JIKA USER BIASA: Arahkan ke rute 'home' (Halaman Utama)
            return redirect()->intended(route('home', absolute: false));
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}