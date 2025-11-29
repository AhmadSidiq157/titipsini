<?php

namespace App\Http\Controllers\Courier;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Role;
use App\Models\CourierVerification;
use Illuminate\Validation\Rules;

class AuthController extends Controller
{
    /**
     * Menampilkan halaman login kurir.
     */
    public function showLoginForm()
    {
        return Inertia::render('Courier/Auth/Login');
    }

    /**
     * Menangani proses login kurir.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            $user = Auth::user();

            /** @var \App\Models\User $user */

            // Cek apakah user punya role kurir
            if (!$user->hasRole('kurir')) {
                Auth::logout();
                return redirect()->back()->withErrors([
                    'email' => 'Akun ini tidak terdaftar sebagai kurir.',
                ]);
            }

            $request->session()->regenerate();

            // Redirect ke dashboard. 
            // Middleware 'IsCourier' yang akan menangkapnya jika statusnya masih 'pending'
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
        // 1. Validasi Input
        $request->validate([
            // Data Akun
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            // [PERBAIKAN 1] Tambahkan validasi phone
            'phone' => 'required|string|max:20',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],

            // Data Kendaraan & Dokumen
            'vehicle_type' => 'required|string|in:motor,mobil,pickup,box,truk',
            'vehicle_brand' => 'required|string|max:255',
            'vehicle_model' => 'required|string|max:255',
            'plat_nomor' => 'required|string|max:20|unique:courier_verifications,plat_nomor',
            'no_bpkb' => 'required|string|max:255|unique:courier_verifications,no_bpkb',
            'no_sim' => 'required|string|max:255|unique:courier_verifications,no_sim',

            // Validasi File Foto
            'foto_ktp' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'foto_sim' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'foto_stnk' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'foto_kendaraan' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        try {
            DB::beginTransaction();

            // 2. Buat User Baru
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                // [PERBAIKAN 2] Masukkan request phone ke database
                'phone' => $request->phone,
                'password' => Hash::make($request->password),
                'courier_status' => 'offline', // Default status kehadiran
            ]);

            // 3. Berikan Role Kurir
            // Ini wajib agar user bisa login. 
            // Keamanan akses dashboard dijaga oleh status 'pending' di tabel verifikasi.
            $courierRole = Role::where('name', 'kurir')->first();
            $user->roles()->attach($courierRole);

            // 4. Upload File ke Storage
            $storagePath = 'courier_verification/' . $user->id;

            $ktpPath = $request->file('foto_ktp')->store($storagePath, 'public');
            $simPath = $request->file('foto_sim')->store($storagePath, 'public');
            $stnkPath = $request->file('foto_stnk')->store($storagePath, 'public');
            $kendaraanPath = $request->file('foto_kendaraan')->store($storagePath, 'public');

            // 5. Simpan Data Verifikasi
            CourierVerification::create([
                'user_id' => $user->id,
                'vehicle_type' => $request->vehicle_type,
                'vehicle_brand' => $request->vehicle_brand,
                'vehicle_model' => $request->vehicle_model,
                'plat_nomor' => $request->plat_nomor,
                'no_bpkb' => $request->no_bpkb,
                'no_sim' => $request->no_sim,

                'foto_ktp_path' => $ktpPath,
                'foto_sim_path' => $simPath,
                'foto_stnk_path' => $stnkPath,
                'foto_kendaraan_path' => $kendaraanPath,

                'status' => 'pending', // Status awal: Menunggu Persetujuan
            ]);

            DB::commit();

            // 6. Auto Login
            Auth::login($user);

            // 7. Redirect
            // Arahkan ke dashboard. Middleware 'IsCourier' akan mendeteksi status 'pending'
            // dan otomatis mengalihkan user ke halaman "Menunggu Persetujuan"
            return redirect(route('courier.dashboard'));
        } catch (\Exception $e) {
            DB::rollBack();

            // Cleanup: Hapus file jika registrasi gagal agar tidak menumpuk sampah
            if (isset($ktpPath)) Storage::disk('public')->delete($ktpPath);
            if (isset($simPath)) Storage::disk('public')->delete($simPath);
            if (isset($stnkPath)) Storage::disk('public')->delete($stnkPath);
            if (isset($kendaraanPath)) Storage::disk('public')->delete($kendaraanPath);

            return redirect()->back()->withInput()->withErrors([
                'email' => 'Registrasi gagal: ' . $e->getMessage(),
            ]);
        }
    }

    public function pending()
    {
        return Inertia::render('Courier/Verification/Pending');
    }

    /**
     * Menangani logout kurir.
     */
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
