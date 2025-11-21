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
            RoleSeeder::class,      // Seeder untuk role (admin=1, client=2, kurir=3)
            SettingSeeder::class, // Seeder baru yang kita buat untuk settings
            ServiceSeeder::class, // Seeder baru untuk services
            MovingPackageSeeder::class, // Seeder baru untuk moving packages
              // Seeder baru untuk curriculums
        ]);

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

        // [UPDATE] Membuat user client untuk testing
        $clientUser = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@gmail.com',
            'password' => 'password',
        ]);
        // [UPDATE] Attach role client (ID = 2)
        $clientUser->roles()->attach(2);

        // [BARU] Buat user kurir untuk testing
        $courierUser = User::factory()->create([
            'name' => 'Kurir Titipsini',
            'email' => 'kurir@titipsini.com',
            'password' => 'password', // Passwordnya 'password'
        ]);
        // [BARU] Attach role kurir (ID = 3)
        $courierUser->roles()->attach(3);
    }
}
