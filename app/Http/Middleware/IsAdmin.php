<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class IsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        // Pertama, pastikan user sudah login
        if (!Auth::check()) {
            // Jika belum login, bisa langsung redirect ke halaman login
            return redirect()->route('login');
        }

        // Ambil user yang sedang login
        $user = Auth::user();

        // ---- BARIS AJAIBNYA DI SINI ----
        /** @var \App\Models\User $user */

        // Cek apakah user memiliki role 'admin'
        if ($user && $user->roles()->where('name', 'admin')->exists()) {
            return $next($request);
        }

        return redirect('/dashboard')->with('error', 'Anda tidak memiliki hak akses admin.');
    }
}
