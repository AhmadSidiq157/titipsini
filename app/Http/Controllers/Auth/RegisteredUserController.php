<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
// use App\Models\Role; // Kita tidak perlu ini jika kita tahu ID-nya
use Illuminate\Auth\Events\Registered;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Menampilkan halaman registrasi KLIEN.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Menangani request registrasi KLIEN.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // [MODIFIKASI] Otomatis berikan role 'client' (ID 2)
        $user->roles()->attach(2);

        event(new Registered($user));

        Auth::login($user);

        // [MODIFIKASI] Arahkan ke 'dashboard', bukan 'home'
        // Biarkan DashboardController yang "pintar" menyortir mereka
        return redirect(route('dashboard', absolute: false));
    }

    /**
     * [BARU] Menampilkan halaman registrasi KURIR.
     */
    public function createCourier(): Response
    {
        // Kita akan buat halaman React ini di langkah selanjutnya
        return Inertia::render('Auth/RegisterCourier');
    }

    /**
     * [BARU] Menangani request registrasi KURIR.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function storeCourier(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // [PERBEDAAN UTAMA] Otomatis berikan role 'kurir' (ID 3)
        $user->roles()->attach(3);

        event(new Registered($user));

        Auth::login($user);

        // Arahkan ke 'dashboard'. 
        // DashboardController akan mencegatnya dan me-redirect ke form verifikasi kurir
        return redirect(route('dashboard', absolute: false));
    }
}
