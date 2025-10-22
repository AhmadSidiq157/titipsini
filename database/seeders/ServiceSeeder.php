<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Service::create([
            'title' => 'Penitipan Traveling',
            'description' => 'Liburan tenang tanpa khawatir barang bawaan berlebih. Simpan koper dan barang lain dengan aman.',
            'features' => ['Akses 24/7', 'Keamanan Terjamin', 'Harian/Bulanan'],
            'illustration' => '/images/traveling.jpg',
        ]);

        Service::create([
            'title' => 'Pindahan Kost/Kontrakan',
            'description' => 'Butuh tempat sementara untuk perabotan saat pindahan? Kami siapkan ruang yang bersih dan aman.',
            'features' => ['Penyimpanan Fleksibel', 'Bantuan Pengepakan', 'Layanan Antar-Jemput'],
            'illustration' => '/images/pindahan.jpg',
        ]);

        Service::create([
            'title' => 'Penitipan Kendaraan',
            'description' => 'Titipkan motor atau mobil Anda di lokasi yang aman dengan pengawasan penuh dan perawatan opsional.',
            'features' => ['Parkir Indoor', 'CCTV 24 Jam', 'Perawatan Berkala'],
            'illustration' => '/images/kendaraan.jpg',
        ]);

        Service::create([
            'title' => 'Penitipan Cuksmiaw',
            'description' => 'Titipkan motor atau mobil Anda di lokasi yang aman dengan pengawasan penuh dan perawatan opsional.',
            'features' => ['Parkir Indoor', 'CCTV 24 Jam', 'Perawatan Berkala'],
            'illustration' => '/images/kendaraan.jpg',
        ]);

        Service::create([
            'title' => 'Penitipan Sidiq',
            'description' => 'Titipkan motor atau mobil Anda di lokasi yang aman dengan pengawasan penuh dan perawatan opsional.',
            'features' => ['Parkir Indoor', 'CCTV 24 Jam', 'Perawatan Berkala'],
            'illustration' => '/images/kendaraan.jpg',
        ]);

        Service::create([
            'title' => 'Penitipan Biawak',
            'description' => 'Titipkan motor atau mobil Anda di lokasi yang aman dengan pengawasan penuh dan perawatan opsional.',
            'features' => ['Parkir Indoor', 'CCTV 24 Jam', 'Perawatan Berkala'],
            'illustration' => '/images/kendaraan.jpg',
        ]);
    }
}
