<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    /**
     * Tampilkan halaman daftar semua notifikasi (Halaman Riwayat).
     * URL: /notifications
     */
    public function index(Request $request)
    {
        return Inertia::render('Notifications/Index', [
            // Kita ambil semua notifikasi (baca/belum), diurutkan terbaru
            // Pagination 20 per halaman biar muat banyak
            'notifications' => $request->user()
                ->notifications()
                ->latest()
                ->paginate(20)
        ]);
    }

    /**
     * Tandai SATU notifikasi sudah dibaca.
     * URL: /notifications/{id}/read
     */
    public function markAsRead(Request $request, $id)
    {
        // Cari notifikasi milik user ini berdasarkan ID
        // Pakai 'first()' supaya kalau ga ketemu, dia return null (bukan error)
        $notification = $request->user()
            ->notifications()
            ->where('id', $id)
            ->first();

        // Kalau notifikasinya ada, tandai sudah dibaca
        if ($notification) {
            $notification->markAsRead();
        }

        // Kembali ke halaman sebelumnya (biar user ga ngerasa pindah halaman)
        return redirect()->back();
    }

    /**
     * Tandai SEMUA notifikasi sudah dibaca.
     * URL: /notifications/read-all
     */
    public function markAllRead(Request $request)
    {
        // Ambil semua yang unread, langsung tandai read semua
        $request->user()->unreadNotifications->markAsRead();
        
        return redirect()->back();
    }
}