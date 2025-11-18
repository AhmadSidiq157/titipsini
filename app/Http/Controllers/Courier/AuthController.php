<?php

namespace App\Http\Controllers\Courier;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Role;
use App\Models\CourierVerification;
use Illuminate\Validation\Rules;

class AuthController extends Controller
{
    // ... (method showLoginForm dan login tidak berubah) ...
    public function showLoginForm()
    {
        return Inertia::render('Courier/Auth/Login');
    }
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            $user = Auth::user();

            // Cek ini SANGAT PENTING:
            // Hanya user yang SUDAH DISETUJUI ADMIN (punya role kurir) yang boleh login.
            if (!$user->hasRole('kurir')) {
                Auth::logout();
                return redirect()->back()->withErrors([
                    'email' => 'Akun ini belum disetujui oleh Admin.',
                ]);
            }

            $request->session()->regenerate();
            return redirect()->intended(route('courier.dashboard'));
        }

        return redirect()->back()->withErrors([
            'email' => 'Email atau password salah.',
        ]);
    }

    /**
     * Menampilkan halaman registrasi kurir.
     */
    public function showRegisterForm()
    {
        return Inertia::render('Courier/Auth/Register');
    }

    /**
     * Menangani proses registrasi kurir (termasuk verifikasi).
     */
    public function register(Request $request)
    {
        // 1. Validasi (Sudah benar)
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'vehicle_brand' => 'required|string|max:255',
            'vehicle_model' => 'required|string|max:255',
            'plat_nomor' => 'required|string|max:20',
            'no_bpkb' => 'required|string|max:255',
            'no_sim' => 'required|string|max:255',
            'foto_ktp' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'foto_sim' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'foto_stnk' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'foto_kendaraan' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // 2. Transaksi Database
        try {
            DB::beginTransaction();

            // 3. Buat Akun User Baru
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);
            
            // [PERBAIKAN] JANGAN BERIKAN ROLE DULU!
            // Baris '$user->roles()->attach($courierRole);' DIHAPUS DARI SINI.
            // Role akan diberikan oleh Admin saat approve.

            // 5. Upload File (Sudah benar)
            $ktpPath = $request->file('foto_ktp')->store('courier_verifications', 'public');
            $simPath = $request->file('foto_sim')->store('courier_verifications', 'public');
            $stnkPath = $request->file('foto_stnk')->store('courier_verifications', 'public');
            $kendaraanPath = $request->file('foto_kendaraan')->store('courier_verifications', 'public');
            
            // 6. Buat Data Verifikasi (Sudah benar)
            CourierVerification::create([
                'user_id' => $user->id,
                'vehicle_brand' => $request->vehicle_brand,
                'vehicle_model' => $request->vehicle_model,
                'plat_nomor' => $request->plat_nomor,
                'no_bpkb' => $request->no_bpkb,
                'no_sim' => $request->no_sim,
                'foto_ktp_path' => $ktpPath,
                'foto_sim_path' => $simPath,
                'foto_stnk_path' => $stnkPath,
                'foto_kendaraan_path' => $kendaraanPath,
                'status' => 'pending',
            ]);

            DB::commit();

            // [PERBAIKAN] JANGAN LOGIN-KAN USER.
            // 'Auth::login($user);' DIHAPUS DARI SINI.
            
            // [PERBAIKAN] Kembalikan ke halaman login dengan pesan sukses.
            return redirect(route('courier.login'))->with(
                'status', 
                'Registrasi berhasil! Akun Anda akan ditinjau oleh Admin. Silakan login kembali setelah akun disetujui.'
            );

        } catch (\Exception $e) {
            DB::rollBack();
            // ... (Kode 'catch' Anda untuk hapus file sudah benar)
            if (isset($ktpPath)) \Illuminate\Support\Facades\Storage::disk('public')->delete($ktpPath);
            if (isset($simPath)) \Illuminate\Support\Facades\Storage::disk('public')->delete($simPath);
            if (isset($stnkPath)) \Illuminate\Support\Facades\Storage::disk('public')->delete($stnkPath);
            if (isset($kendaraanPath)) \Illuminate\Support\Facades\Storage::disk('public')->delete($kendaraanPath);

            return redirect()->back()->withInput()->withErrors([
                'submit' => 'Registrasi gagal. Silakan coba lagi. Error: ' . $e->getMessage(),
            ]);
        }
    }
    
    // ... (method logout tidak berubah) ...
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
    }
}