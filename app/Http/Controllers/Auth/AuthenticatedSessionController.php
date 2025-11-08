<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

        // --- INI DIA LOGIKA YANG BENAR ---

        // 1. Ambil data user yang baru login
        $user = $request->user();

        // 2. Cek apakah user itu admin (pakai fungsi isAdmin() dari User.php)
        if ($user->isAdmin()) {
            
            // 3a. JIKA ADMIN: Arahkan ke 'dashboard' (sesuai routes/web.php kamu)
            return redirect()->intended(route('dashboard', absolute: false));
        
        } else {
            
            // 3b. JIKA USER BIASA: Arahkan ke 'home' (sesuai routes/web.php kamu)
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