<?php

namespace Database\Seeders;

use App\Models\Curriculum;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CurriculumSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Curriculum::create([
            'title' => 'Fundamental Storage',
            'icon_name' => 'Library',
            'points' => [
                'Dasar-dasar industri penyimpanan dan logistik modern',
                'Pengenalan Warehouse Management',
                'Sistem Inventory Control',
                'Safety & Security Protocols',
                'Customer Service Excellence',
            ],
        ]);

        Curriculum::create([
            'title' => 'Advanced Operations',
            'icon_name' => 'BrainCircuit',
            'points' => [
                'Operasional lanjutan dan optimasi sistem penyimpanan',
                'Digital Transformation',
                'Data Analytics & Reporting',
                'Process Optimization',
                'Quality Management',
            ],
        ]);

        Curriculum::create([
            'title' => 'Business Development',
            'icon_name' => 'TrendingUp',
            'points' => [
                'Pengembangan bisnis dan strategi pertumbuhan perusahaan',
                'Market Analysis & Strategy',
                'Financial Management',
                'Leadership & Team Management',
                'Innovation & Technology',
            ],
        ]);
    }
}
