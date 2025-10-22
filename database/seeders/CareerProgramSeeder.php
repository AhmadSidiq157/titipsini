<?php

namespace Database\Seeders;

use App\Models\CareerProgram; // <-- TAMBAHKAN BARIS INI
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CareerProgramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        CareerProgram::create([
            'title' => 'Program Magang Profesional',
            'description' => 'Program magang 6 bulan untuk mahasiswa tingkat akhir dengan bimbingan mentor berpengalaman.',
            'duration' => '6 Bulan',
            'benefits' => ['Sertifikat', 'Uang Saku', 'Mentoring', 'Networking'],
            'is_popular' => true,
            'tags' => ['Magang'],
            'cta_text' => 'Daftar Sekarang',
            'cta_color' => 'green',
        ]);

        CareerProgram::create([
            'title' => 'Fresh Graduate Program',
            'description' => 'Program pengembangan karir untuk fresh graduate dengan pelatihan intensif.',
            'duration' => '12 Bulan',
            'benefits' => [
                'Gaji Kompetitif',
                'Training',
                'Career Path',
                'Health Insurance',
            ],
            'is_popular' => false,
            'tags' => ['Full-time'],
            'cta_text' => 'Pelajari Lebih Lanjut',
            'cta_color' => 'dark',
        ]);

        CareerProgram::create([
            'title' => 'Leadership Development',
            'description' => 'Program pengembangan kepemimpinan untuk karyawan dengan potensi tinggi.',
            'duration' => '9 Bulan',
            'benefits' => [
                'Leadership Training',
                'Project Management',
                'Team Building',
                'Certification',
            ],
            'is_popular' => false,
            'tags' => ['Development'],
            'cta_text' => 'Pelajari Lebih Lanjut',
            'cta_color' => 'dark',
        ]);
    }
}
