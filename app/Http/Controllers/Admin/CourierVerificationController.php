<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CourierVerification; // <-- Import model kita
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourierVerificationController extends Controller
{
    /**
     * Menampilkan daftar semua pengajuan verifikasi kurir.
     */
    public function index()
    {
        $verifications = CourierVerification::with('user') // Ambil data user-nya
            ->latest() // Urutkan dari yang terbaru
            ->paginate(15);

        return Inertia::render('Admin/CourierVerification/Index', [
            'verifications' => $verifications,
        ]);
    }

    /**
     * Menampilkan detail satu pengajuan verifikasi.
     */
    public function show(CourierVerification $verification)
    {
        // Gunakan Route-Model Binding
        // Kita juga load relasi user agar data kurir (nama, email) bisa tampil
        $verification->load('user');

        return Inertia::render('Admin/CourierVerification/Show', [
            'verification' => $verification,
        ]);
    }

    /**
     * Menyetujui pengajuan verifikasi kurir.
     */
    public function approve(CourierVerification $verification)
    {
        $verification->update([
            'status' => 'approved',
            'rejection_reason' => null, // Hapus alasan penolakan jika ada
        ]);

        // TODO: Kirim email notifikasi ke kurir bahwa akunnya disetujui

        return redirect()->route('admin.courier_verifications.show', $verification->id)
            ->with('success', 'Verifikasi kurir berhasil disetujui.');
    }

    /**
     * Menolak pengajuan verifikasi kurir.
     */
    public function reject(Request $request, CourierVerification $verification)
    {
        // Validasi input (alasan penolakan wajib diisi)
        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:1000',
        ]);

        $verification->update([
            'status' => 'rejected',
            'rejection_reason' => $validated['rejection_reason'],
        ]);

        // TODO: Kirim email notifikasi ke kurir bahwa akunnya ditolak

        return redirect()->route('admin.courier_verifications.show', $verification->id)
            ->with('success', 'Verifikasi kurir telah ditolak.');
    }
}
