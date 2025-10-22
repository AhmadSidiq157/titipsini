<?php

namespace Database\Seeders;

use App\Models\MovingPackage;
use Illuminate\Database\Seeder;

class MovingPackageSeeder extends Seeder
{
    public function run(): void
    {
        MovingPackage::create([
            'name' => 'Dalam Kota',
            'description' => 'Solusi cepat dan efisien untuk pindahan di dalam area kota yang sama.',
            'features' => [
                'Pickup & delivery dalam kota',
                'Maksimal 20 box sedang',
                'Asuransi dasar',
                '1 helper profesional',
            ],
            'popular' => false,
        ]);

        MovingPackage::create([
            'name' => 'Luar Kota',
            'description' => 'Paket lengkap untuk pindahan antar kota dengan jaminan keamanan penuh.',
            'features' => [
                'Pickup & delivery antar kota',
                'Maksimal 50 box besar',
                'Asuransi penuh',
                '2 helper + supervisor',
                'Layanan packing gratis',
            ],
            'popular' => true, // Kita buat ini menjadi populer
        ]);
    }
}
