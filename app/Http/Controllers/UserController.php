<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User; // <-- Jangan lupa import model
use App\Models\Role; // <-- Jangan lupa import model

class UserController extends Controller
{
    /**
     * Menjadikan seorang user sebagai admin.
     *
     * @param int $userId
     * @return string
     */
    public function makeAdmin($userId)
    {
        // 1. Cari user berdasarkan ID-nya
        $user = User::find($userId);

        if (!$user) {
            return "Error: User tidak ditemukan!";
        }

        // 2. Cari role 'admin' di database
        $adminRole = Role::where('name', 'admin')->first();

        if (!$adminRole) {
            return "Error: Role 'admin' tidak ditemukan. Pastikan Anda sudah menjalankan seeder.";
        }

        // 3. Gunakan sync() untuk mengubah role user menjadi admin
        $user->roles()->sync([$adminRole->id]);

        return "Sukses! User {$user->name} sekarang adalah seorang admin.";
    }

    public function removeAdmin($userId)
    {
        $user = User::find($userId);
        $adminRole = Role::where('name', 'admin')->first();

        // Gunakan detach() untuk menghapus relasi role
        if ($user && $adminRole) {
            $user->roles()->detach($adminRole->id);
        }

        return redirect()->route('admin.users.index')->with('success', 'Hak akses admin berhasil dicabut.');
    }
}
