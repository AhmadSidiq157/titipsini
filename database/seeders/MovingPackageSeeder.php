<?php

namespace Database\Seeders;

use App\Models\MovingPackage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MovingPackageSeeder extends Seeder
{
    public function run(): void
    {
        // Kosongkan tabel dulu agar tidak duplikat saat db:seed ulang
        DB::table('moving_packages')->truncate();

        $packages = [
            [
                'name' => 'Dalam Kota',
                'description' => 'Solusi cepat dan hemat untuk pindahan jarak dekat (Maksimal 30 KM).',
                'features' => json_encode([ // Pastikan format JSON valid
                    'Pickup & delivery dalam kota',
                    'Gratis Ongkir 3 KM Pertama',
                    'Termasuk Supir & BBM',
                    'Maksimal 20 box sedang',
                    'Asuransi dasar',
                ]),
                'price' => 150000,        // Harga Dasar (Base Price)
                'price_per_km' => 4000,   // Tarif per KM selanjutnya
                'max_distance' => 30,     // [PENTING] Batas jarak maksimal 30 KM
                'popular' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Luar Kota',
                'description' => 'Paket lengkap untuk pindahan antar kota tanpa batasan jarak.',
                'features' => json_encode([
                    'Pickup & delivery antar kota',
                    'Gratis Ongkir 3 KM Pertama',
                    'Termasuk Supir & BBM',
                    'Maksimal 50 box besar',
                    'Asuransi penuh & Packing',
                ]),
                'price' => 500000,        // Harga Dasar (Lebih mahal karena sewa harian)
                'price_per_km' => 6000,   // Tarif per KM (Lebih mahal untuk luar kota)
                'max_distance' => null,   // [PENTING] Tidak ada batasan jarak (Null)
                'popular' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('moving_packages')->insert($packages);
    }
}