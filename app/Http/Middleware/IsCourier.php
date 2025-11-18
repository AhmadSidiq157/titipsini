<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsCourier
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        // 1. Cek dasar: Apakah dia login dan rolenya kurir?
        if (!$user || !$user->isCourier()) {
            // Jika bukan kurir, tendang ke halaman login (ini sudah benar)
            return redirect()->route('login');
        }

        // [MODIFIKASI]
        // SEMUA logika pengecekan status (approved, pending, rejected)
        // dan semua logika redirect paksa ke 'courier.verification.create'
        // TELAH DIHAPUS.

        // 2. Jika lolos pengecekan #1 (dia adalah kurir),
        //    langsung biarkan dia masuk ke halaman yang dia tuju
        //    (termasuk 'courier.dashboard').
        return $next($request);
    }
}