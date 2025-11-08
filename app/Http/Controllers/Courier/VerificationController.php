<?php

namespace App\Http\Controllers\Courier;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage; // Pastikan ini di-import

class VerificationController extends Controller
{
    /**
     * Menampilkan formulir verifikasi.
     */
    public function create()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Ambil data verifikasi sebelumnya (jika ada, misal jika ditolak)
        $verificationData = $user->courierVerification;

        return Inertia::render('Courier/Verification/Create', [
            'verificationData' => $verificationData // Kirim data lama (termasuk alasan penolakan)
        ]);
    }

    /**
     * Menampilkan halaman "Menunggu Persetujuan".
     */
    public function pending()
    {
        return Inertia::render('Courier/Verification/Pending');
    }

    /**
     * Menyimpan data verifikasi.
     */
    public function store(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // 1. Validasi Input
        $validated = $request->validate([
            'vehicle_brand' => 'required|string|max:255',
            'vehicle_model' => 'required|string|max:255',
            'plat_nomor' => 'required|string|max:20|unique:courier_verifications,plat_nomor,' . $user->courierVerification?->id,
            'no_bpkb' => 'required|string|max:50|unique:courier_verifications,no_bpkb,' . $user->courierVerification?->id,
            'no_sim' => 'required|string|max:50|unique:courier_verifications,no_sim,' . $user->courierVerification?->id,

            // Validasi file (jika user resubmit, file lama tidak wajib diupload ulang)
            // 'sometimes' berarti hanya validasi jika field ada di request
            // [PERBAIKAN] Ubah 'sometimes|required' menjadi 'nullable' jika update, atau 'required' jika create
            'foto_ktp' => ($user->courierVerification ? 'nullable' : 'required') . '|image|mimes:jpg,jpeg,png|max:2048',
            'foto_sim' => ($user->courierVerification ? 'nullable' : 'required') . '|image|mimes:jpg,jpeg,png|max:2048',
            'foto_kendaraan' => ($user->courierVerification ? 'nullable' : 'required') . '|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $dataToUpdate = $validated;
        $currentVerification = $user->courierVerification;

        // 2. Proses Upload File
        $storagePath = 'courier_verification/' . $user->id;

        if ($request->hasFile('foto_ktp')) {
            // Hapus file lama jika ada
            if ($currentVerification?->foto_ktp_path) {
                Storage::disk('public')->delete($currentVerification->foto_ktp_path);
            }
            $dataToUpdate['foto_ktp_path'] = $request->file('foto_ktp')->store($storagePath, 'public');
        }

        if ($request->hasFile('foto_sim')) {
            if ($currentVerification?->foto_sim_path) {
                Storage::disk('public')->delete($currentVerification->foto_sim_path);
            }
            $dataToUpdate['foto_sim_path'] = $request->file('foto_sim')->store($storagePath, 'public');
        }

        if ($request->hasFile('foto_kendaraan')) {
            if ($currentVerification?->foto_kendaraan_path) {
                Storage::disk('public')->delete($currentVerification->foto_kendaraan_path);
            }
            $dataToUpdate['foto_kendaraan_path'] = $request->file('foto_kendaraan')->store($storagePath, 'public');
        }

        // --- [INI PERBAIKANNYA] ---
        // Hapus data file mentah dari array sebelum disimpan ke DB
        // Karena kita hanya ingin menyimpan PATH-nya, bukan file-nya.
        unset($dataToUpdate['foto_ktp']);
        unset($dataToUpdate['foto_sim']);
        unset($dataToUpdate['foto_kendaraan']);
        // --- [AKHIR PERBAIKAN] ---


        // 3. Simpan ke Database
        // updateOrCreate akan mencari berdasarkan user_id, 
        // atau membuat baru jika belum ada.
        $user->courierVerification()->updateOrCreate(
            ['user_id' => $user->id], // Kunci pencarian
            $dataToUpdate + ['status' => 'pending', 'rejection_reason' => null] // Data untuk diupdate/dibuat
        );

        // 4. Redirect ke halaman pending
        return redirect()->route('courier.verification.pending')->with('success', 'Data verifikasi berhasil dikirim. Harap tunggu persetujuan admin.');
    }
}
