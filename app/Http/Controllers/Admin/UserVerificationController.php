<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\UserVerification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserVerificationController extends Controller
{
    /**
     * Menampilkan daftar semua data verifikasi.
     */
    public function index(Request $request)
    {
        $verifications = UserVerification::with('user')
            ->when($request->input('status'), function ($query, $status) {
                return $query->where('status', $status);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Verification/Index', [
            'verifications' => $verifications,
            'filters' => $request->only(['status'])
        ]);
    }

    /**
     * Menampilkan detail satu data verifikasi.
     */
    public function show(UserVerification $verification)
    {
        $verification->load('user');
        return Inertia::render('Admin/Verification/Show', [
            'verification' => $verification,
        ]);
    }

    /**
     * Menyetujui verifikasi user.
     */
    public function approve(UserVerification $verification)
    {
        if ($verification->status !== 'pending') {
            return redirect()->back()->with('error', 'Verifikasi ini sudah diproses.');
        }

        $verification->update([
            'status' => 'approved',
            'rejection_notes' => null, // Hapus catatan penolakan jika ada
        ]);

        // TODO Nanti: Kirim email ke user bahwa akunnya sudah aktif

        return redirect()->route('admin.verification.show', $verification->id)->with('success', 'User berhasil diverifikasi.');
    }

    /**
     * Menolak verifikasi user.
     */
    public function reject(Request $request, UserVerification $verification)
    {
        $request->validate([
            'rejection_notes' => 'required|string|max:1000',
        ]);

        if ($verification->status !== 'pending') {
            return redirect()->back()->with('error', 'Verifikasi ini sudah diproses.');
        }

        $verification->update([
            'status' => 'rejected',
            'rejection_notes' => $request->input('rejection_notes'),
        ]);

        // TODO Nanti: Kirim email ke user bahwa verifikasinya ditolak

        return redirect()->route('admin.verification.show', $verification->id)->with('success', 'Verifikasi user ditolak.');
    }
}
