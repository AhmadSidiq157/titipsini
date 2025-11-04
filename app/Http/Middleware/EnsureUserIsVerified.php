<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsVerified
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        // Cek status verifikasi
        // '?? null' untuk menghindari error jika relasi 'verification' belum ada (null)
        $verificationStatus = $user->verification->status ?? null;

        if ($verificationStatus === 'approved') {
            // 1. Jika sudah disetujui, izinkan lanjut.
            return $next($request);
        }

        if ($verificationStatus === 'pending') {
            // 2. Jika masih 'pending', lempar ke halaman tunggu
            // (Kita akan buat halaman 'verification.pending' nanti)
            return redirect()->route('verification.pending')->with('info', 'Data Anda sedang diverifikasi oleh Admin.');
        }

        // 3. Jika 'rejected' atau null (belum isi form sama sekali),
        // lempar ke form verifikasi.
        // (Kita akan buat halaman 'verification.create' nanti)
        return redirect()->route('verification.create')->with('error', 'Anda harus melengkapi verifikasi data diri untuk melanjutkan.');
    }
}
