<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CourierVerification;
use App\Models\Role; // <-- [PENTING] Import Role
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourierVerificationController extends Controller
{
    /**
     * Menampilkan daftar verifikasi.
     */
    public function index()
    {
        $verifications = CourierVerification::with('user')
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/CourierVerification/Index', [
            'verifications' => $verifications,
        ]);
    }

    /**
     * Menampilkan detail verifikasi.
     */
    public function show(CourierVerification $verification)
    {
        $verification->load('user');

        return Inertia::render('Admin/CourierVerification/Show', [
            'verification' => $verification,
        ]);
    }

    /**
     * Menyetujui verifikasi.
     */
    public function approve(CourierVerification $verification)
    {
        // 1. Update status verifikasi
        $verification->update([
            'status' => 'approved',
            'rejection_reason' => null,
        ]);

        // 2. [PERBAIKAN UTAMA] Berikan role 'kurir' ke user
        $user = $verification->user;

        // Cari role dengan nama 'kurir'
        $courierRole = Role::where('name', 'kurir')->first();

        // Jika user dan role ada, dan user belum punya role tersebut
        if ($user && $courierRole) {
            // Gunakan syncWithoutDetaching untuk mencegah duplikasi role jika tombol ditekan 2x
            $user->roles()->syncWithoutDetaching([$courierRole->id]);

            // Opsional: Set status kurir jadi 'available' otomatis
            $user->update(['courier_status' => 'available']);
        }

        // 3. Redirect (Perhatikan nama route pakai 's' jamak sesuai routes/web.php)
        return redirect()->route('admin.courier_verifications.index')
            ->with('success', 'Verifikasi kurir berhasil disetujui. User sekarang resmi menjadi Kurir.');
    }

    /**
     * Menolak verifikasi.
     */
    public function reject(Request $request, CourierVerification $verification)
    {
        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:1000',
        ]);

        $verification->update([
            'status' => 'rejected',
            'rejection_reason' => $validated['rejection_reason'],
        ]);

        // Jika ditolak, kita mungkin ingin mencabut role kurir jika sebelumnya sudah punya
        // (Opsional, tergantung kebijakan bisnis Anda)
        // $courierRole = Role::where('name', 'kurir')->first();
        // $verification->user->roles()->detach($courierRole->id);

        return redirect()->route('admin.courier_verifications.index')
            ->with('success', 'Verifikasi kurir telah ditolak.');
    }
}
