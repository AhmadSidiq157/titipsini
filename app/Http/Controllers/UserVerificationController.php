<?php

namespace App\Http\Controllers;

use App\Models\UserVerification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class UserVerificationController extends Controller
{
    /**
     * Menampilkan form verifikasi.
     * Juga akan menampilkan data lama jika user pernah ditolak (rejected).
     */
    public function create()
    {
        $user = Auth::user();
        $verificationData = $user->verification; // Ambil data verifikasi yg ada (jika ada)

        // Jika status sudah 'approved' atau 'pending', jangan biarkan isi form lagi
        if ($verificationData) {
            if ($verificationData->status === 'approved') {
                return redirect()->route('dashboard'); // Atau ke halaman order
            }
            if ($verificationData->status === 'pending') {
                return redirect()->route('verification.pending');
            }
        }

        // Jika 'rejected' atau null, tampilkan form.
        return Inertia::render('Verification/Create', [
            'verification' => $verificationData, // Kirim data lama (yg rejected) ke form
        ]);
    }

    /**
     * Menyimpan data verifikasi (termasuk upload KTP).
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'legal_name' => 'required|string|max:255',
            'id_card_type' => ['required', Rule::in(['KTP', 'SIM', 'Passport'])],
            'id_card_number' => 'required|string|max:50',
            'address_on_id' => 'required|string',
            'gender' => ['required', Rule::in(['laki-laki', 'perempuan'])],
            'id_card_path' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        // 1. Upload file KTP/SIM
        $path = $request->file('id_card_path')->store('id_cards', 'public');

        // 2. Simpan data ke database
        // Gunakan updateOrCreate untuk menangani jika user resubmit (setelah ditolak)
        $user->verification()->updateOrCreate(
            ['user_id' => $user->id], // Cari berdasarkan user_id
            [ // Data untuk di-update atau di-create
                'legal_name' => $validated['legal_name'],
                'id_card_type' => $validated['id_card_type'],
                'id_card_number' => $validated['id_card_number'],
                'address_on_id' => $validated['address_on_id'],
                'gender' => $validated['gender'],
                'id_card_path' => $path,
                'status' => 'pending', // Set status kembali ke pending
                'rejection_notes' => null, // Hapus catatan penolakan lama
            ]
        );

        // 3. Redirect ke halaman "pending"
        return redirect()->route('verification.pending');
    }

    /**
     * Menampilkan halaman "Menunggu Verifikasi".
     */
    public function pending()
    {
        return Inertia::render('Verification/Pending');
    }
}
