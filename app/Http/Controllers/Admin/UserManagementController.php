<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use App\Models\UserVerification;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class UserManagementController extends Controller
{
    // ==========================================
    // BAGIAN 1: MANAJEMEN USER & ROLE
    // ==========================================

    /**
     * Menampilkan daftar semua user beserta rolenya.
     * Route: admin.users.index
     */
    public function index()
    {
        $users = User::with('roles')
            ->latest()
            ->get();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users
        ]);
    }

    /**
     * Menjadikan user sebagai Admin.
     * Route: admin.users.makeAdmin
     */
    public function makeAdmin($userId)
    {
        $user = User::find($userId);

        if (!$user) {
            return redirect()->back()->with('error', 'User tidak ditemukan!');
        }

        $adminRole = Role::where('name', 'admin')->first();

        if (!$adminRole) {
            return redirect()->back()->with('error', "Role 'admin' belum dibuat di database.");
        }

        // Tambahkan role admin tanpa menghapus role lain (misal: kurir)
        $user->roles()->syncWithoutDetaching([$adminRole->id]);

        return redirect()->back()->with('success', "Sukses! {$user->name} sekarang memiliki akses Admin.");
    }

    /**
     * Mencabut akses Admin dari user.
     * Route: admin.users.removeAdmin
     */
    public function removeAdmin($userId)
    {
        $user = User::find($userId);
        $adminRole = Role::where('name', 'admin')->first();

        if ($user && $adminRole) {
            $user->roles()->detach($adminRole->id);
        }

        return redirect()->back()->with('success', "Hak akses Admin untuk {$user->name} berhasil dicabut.");
    }


    // ==========================================
    // BAGIAN 2: VERIFIKASI KTP (USER)
    // ==========================================

    /**
     * Menampilkan daftar pengajuan verifikasi KTP.
     * Route: admin.verification.index
     */
    public function verificationIndex()
    {
        $verifications = UserVerification::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Admin/Verification/Index', [
            'verifications' => $verifications,
        ]);
    }

    /**
     * Menampilkan detail pengajuan verifikasi.
     * Route: admin.verification.show
     */
    public function verificationShow(UserVerification $userVerification)
    {
        $userVerification->load('user');

        return Inertia::render('Admin/Verification/Show', [
            'verification' => $userVerification
        ]);
    }

    /**
     * Menyetujui verifikasi KTP user.
     * Route: admin.verification.approve
     */
    public function verificationApprove(UserVerification $userVerification)
    {
        $userVerification->update([
            'status' => 'approved',
            'rejection_notes' => null
        ]);

        $userVerification->user()->update(['is_verified' => true]);

        return redirect()->back()->with('success', 'Verifikasi berhasil disetujui.');
    }

    /**
     * Menolak verifikasi KTP user.
     * Route: admin.verification.reject
     */
    public function verificationReject(Request $request, UserVerification $userVerification)
    {
        $request->validate([
            'rejection_notes' => 'required|string|max:1000',
        ]);

        $userVerification->update([
            'status' => 'rejected',
            'rejection_notes' => $request->rejection_notes,
        ]);

        $userVerification->user()->update(['is_verified' => false]);

        return redirect()->back()->with('success', 'Verifikasi berhasil ditolak.');
    }
}