<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\InternshipPosition;
use Illuminate\Database\Seeder;

class InternshipPositionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        InternshipPosition::create([
            'title' => 'Operations Intern',
            'category' => 'Operations',
            'description' => 'Membantu operasional harian penitipan barang dan koordinasi dengan tim lapangan.',
            'location' => 'Jakarta',
            'duration' => '3-6 Bulan',
            'slots' => 3,
            'deadline' => '2025-11-15',
            'requirements' => [
                'Mahasiswa aktif semester 5-7',
                'Komunikasi yang baik',
                'Detail oriented',
                'Dapat bekerja dalam tim',
            ],
        ]);
        InternshipPosition::create([
            'title' => 'Operations Okelaaah',
            'category' => 'Operations',
            'description' => 'Membantu operasional harian penitipan barang dan koordinasi dengan tim lapangan.',
            'location' => 'Jakarta',
            'duration' => '3-6 Bulan',
            'slots' => 3,
            'deadline' => '2025-11-15',
            'requirements' => [
                'Mahasiswa aktif semester 5-7',
                'Komunikasi yang baik',
                'Detail oriented',
                'Dapat bekerja dalam tim',
            ],
        ]);
        InternshipPosition::create([
            'title' => 'Operations Apaaaa',
            'category' => 'Operations',
            'description' => 'Membantu operasional harian penitipan barang dan koordinasi dengan tim lapangan.',
            'location' => 'Jakarta',
            'duration' => '3-6 Bulan',
            'slots' => 3,
            'deadline' => '2025-11-15',
            'requirements' => [
                'Mahasiswa aktif semester 5-7',
                'Komunikasi yang baik',
                'Detail oriented',
                'Dapat bekerja dalam tim',
            ],
        ]);
    }
}
