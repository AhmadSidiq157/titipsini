<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CourierVerification;
use App\Models\Role; // <-- 1. PASTIKAN 'Role' DI-IMPORT
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourierVerificationController extends Controller
{
    public function index()
    {
        $verifications = CourierVerification::with('user')
            ->latest()
            ->paginate(15);
            
        // 2. PERBAIKI PATH VIEW: 'CourierVerifications' (pakai 's')
        return Inertia::render('Admin/CourierVerification/Index', [
            'verifications' => $verifications,
        ]);
    }

    public function show(CourierVerification $verification)
    {
        $verification->load('user');

        // 3. PERBAIKI PATH VIEW: 'CourierVerifications' (pakai 's')
        return Inertia::render('Admin/CourierVerification/Show', [
            'verification' => $verification,
        ]);
    }

    public function approve(CourierVerification $verification)
    {
        $verification->update([
            'status' => 'approved',
            'rejection_reason' => null,
        ]);
        
        // 4. [PERBAIKAN WAJIB] Berikan role 'kurir' ke user-nya!
        $user = $verification->user;
        $courierRole = Role::where('name', 'kurir')->first();

        if ($user && $courierRole && !$user->hasRole('kurir')) {
            $user->roles()->attach($courierRole);
        }

        // 5. Redirect kembali ke Index agar lihat flash message
        return redirect()->route('admin.courier_verification.index')
                         ->with('success', 'Verifikasi kurir berhasil disetujui.');
    }

    public function reject(Request $request, CourierVerification $verification)
    {
        // Validasi Anda sudah benar, tapi kita butuh modal di frontend
        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:1000',
        ]);

        $verification->update([
            'status' => 'rejected',
            'rejection_reason' => $validated['rejection_reason'],
        ]);

        return redirect()->route('admin.courier_verification.index')
            ->with('success', 'Verifikasi kurir telah ditolak.');
    }
}