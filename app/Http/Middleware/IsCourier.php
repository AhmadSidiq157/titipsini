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
            return redirect()->route('login');
        }

        $status = $user->courierVerificationStatus(); // (null, 'pending', 'approved', 'rejected')
        $currentRoute = $request->route()->getName();

        // [MODIFIKASI LOGIKA]

        // 1. Jika user SUDAH DISETUJUI
        if ($status === 'approved') {
            $verificationRoutes = [
                'courier.verification.create',
                'courier.verification.pending',
            ];

            // Jika dia disetujui TAPI masih 'terjebak' di halaman verifikasi/pending
            // (karena polling), paksa dia ke dashboard.
            if (in_array($currentRoute, $verificationRoutes)) {
                return redirect()->route('courier.dashboard');
            }

            // Jika dia disetujui dan ada di halaman lain (dashboard, tasks), biarkan lanjut.
            return $next($request);
        }

        // 2. Jika user BELUM DISETUJUI (pending, rejected, null)
        $safeRoutes = [
            'courier.verification.create',
            'courier.verification.store',
            'courier.verification.pending',
            'logout',
        ];

        // Jika dia mencoba mengakses halaman aman (verifikasi, pending, logout), biarkan.
        if (in_array($currentRoute, $safeRoutes)) {

            // Pengecualian: Jika dia ditolak (rejected) tapi masih di halaman pending
            // (karena polling), paksa dia kembali ke halaman 'create' untuk melihat alasannya.
            if ($status === 'rejected' && $currentRoute === 'courier.verification.pending') {
                return redirect()->route('courier.verification.create');
            }

            return $next($request);
        }

        // 3. Jika user BELUM DISETUJUI dan mencoba mengakses halaman TERLARANG (misal /dashboard)
        // Paksa dia kembali ke alur verifikasi yang benar.
        switch ($status) {
            case 'pending':
                return redirect()->route('courier.verification.pending');
            case 'rejected':
            case null:
            default:
                return redirect()->route('courier.verification.create');
        }
    }
}
