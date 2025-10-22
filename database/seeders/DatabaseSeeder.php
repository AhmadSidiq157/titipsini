<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Panggil seeder lain yang sudah ada dan yang baru
        $this->call([
            RoleSeeder::class,    // Seeder untuk role yang sudah ada
            SettingSeeder::class, // Seeder baru yang kita buat untuk settings
            ServiceSeeder::class, // Seeder baru untuk services
            MovingPackageSeeder::class, // Seeder baru untuk moving packages
            InternshipPositionSeeder::class, // Seeder baru untuk internship positions
            InternshipProjectSeeder::class, // Seeder baru untuk internship projects
            CareerProgramSeeder::class, // Seeder baru untuk career programs
            CurriculumSeeder::class,    // Seeder baru untuk curriculums
        ]);

        // KODE BARU YANG BENAR
        $adminUser = User::factory()->create([
            'name' => 'Ulul Azmi A. Latala',
            'email' => 'ullulazmia.l@gmail.com',
            'password' => 'password',
        ]);

        $adminUser1 = User::factory()->create([
            'name' => 'Ahmad Sidiq Imawan',
            'email' => 'sidiq@gmail.com',
            'password' => 'password',
        ]);

        // 'attach(1)' akan membuat entri di tabel 'role_user'
        // untuk menghubungkan user ini dengan role yang memiliki ID 1 (Admin)
        $adminUser->roles()->attach(1);
        $adminUser1->roles()->attach(1);

        // Anda juga bisa membuat user biasa jika perlu
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
        ]);
    }
}
