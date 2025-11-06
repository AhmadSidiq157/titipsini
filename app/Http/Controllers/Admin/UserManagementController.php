<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request; // <-- DITAMBAHKAN
use App\Models\User;
use App\Models\UserVerification; // <-- Pastikan ini di-import
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect; // <-- DITAMBAHKAN

class UserManagementController extends Controller
{
    /**
     * Menampilkan daftar user
     */
    public function index()
    {
        $users = User::with('roles')->latest()->get();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users
        ]);
    }

    /**
     * Menampilkan halaman daftar verifikasi user untuk admin.
     */
    public function verificationIndex()
    {
        $verifications = UserVerification::with('user')
                            ->orderBy('updated_at', 'desc')
                            ->paginate(10);

        // --- INI PERBAIKANNYA ---
        // Kita ubah dari 'Admin/Verifications/Index' (plural)
        // menjadi 'Admin/Verification/Index' (singular) agar cocok
        // dengan nama folder kamu.
        return Inertia::render('Admin/Verification/Index', [
            'verifications' => $verifications,
        ]);
    }

    /**
     * Menampilkan detail satu verifikasi untuk ditinjau Admin.
     */
    public function verificationShow(UserVerification $userVerification)
    {
        $userVerification->load('user');
        
        // Sesuaikan ini juga agar konsisten
        return Inertia::render('Admin/Verification/Show', [
            'verification' => $userVerification
        ]);
    }

    // --- METHOD APPROVE & REJECT YANG HILANG SAYA TAMBAHKAN DI SINI ---

    /**
     * Menyetujui verifikasi user.
     */
    public function verificationApprove(Request $request, UserVerification $userVerification)
    {
        // Ubah status verifikasi
        $userVerification->status = 'approved';
        $userVerification->save();

        // Update juga status di tabel user
        $userVerification->user()->update(['is_verified' => true]);

        return Redirect::route('admin.verification.index')->with('success', 'Verifikasi berhasil disetujui.');
    }

    /**
     * Menolak verifikasi user.
     */
    public function verificationReject(Request $request, UserVerification $userVerification)
    {
        $userVerification->status = 'rejected';
        $userVerification->save();

        // Pastikan status user tetap false (atau tidak diubah)
        $userVerification->user()->update(['is_verified' => false]);

        return Redirect::route('admin.verification.index')->with('success', 'Verifikasi berhasil ditolak.');
    }
    
    // ... (method kamu yang lain) ...

}

