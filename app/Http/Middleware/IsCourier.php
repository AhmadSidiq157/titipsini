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

        // 2. Ambil status verifikasi kurir
        $status = $user->courierVerificationStatus(); // (null, 'pending', 'approved', 'rejected')
        $currentRoute = $request->route()->getName();

        // 3. Definisikan rute-rute "aman" yang selalu boleh diakses
        $safeRoutes = [
            'courier.verification.create',
            'courier.verification.store',
            'courier.verification.pending',
            'logout', // Pastikan kurir selalu bisa logout
        ];

        // Jika rute saat ini ada di daftar aman, biarkan saja.
        if (in_array($currentRoute, $safeRoutes)) {
            return $next($request);
        }

        // 4. Logika Pengalihan (Routing) berdasarkan Status
        switch ($status) {

            // 4A. Jika SUDAH DISETUJUI ('approved')
            case 'approved':
                // Dia sudah disetujui, biarkan dia akses semua halaman kurir
                return $next($request);

                // 4B. Jika SEDANG DITINJAU ('pending')
            case 'pending':
                // Dia 'pending' dan mencoba akses halaman terlarang (misal dashboard)
                // Paksa dia ke halaman "pending"
                return redirect()->route('courier.verification.pending');

                // 4C. Jika DITOLAK ('rejected') atau BARU (null)
            case 'rejected':
            case null:
            default:
                // Dia 'ditolak' atau 'baru' dan mencoba akses halaman terlarang
                // Paksa dia ke formulir verifikasi
                return redirect()->route('courier.verification.create');
        }
    }
}
