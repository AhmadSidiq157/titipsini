<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\InternshipProject;
use Illuminate\Database\Seeder;

class InternshipProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        InternshipProject::create([
            'title' => 'Sistem Inventory Management',
            'category' => 'Operations Project',
            'description' => 'Mengembangkan dan mengoptimalkan sistem tracking barang untuk meningkatkan efisiensi operasional warehouse.',
            'learnings' => [
                'Database design dan management',
                'Process mapping dan optimization',
                'Data analysis dan reporting',
            ],
            'duration' => '3-4 bulan',
            'team_size' => 'Tim 2-3 orang',
        ]);

        InternshipProject::create([
            'title' => 'Sistem Okeokeee Management',
            'category' => 'Operations Project',
            'description' => 'Mengembangkan dan mengoptimalkan sistem tracking barang untuk meningkatkan efisiensi operasional warehouse.',
            'learnings' => [
                'Database design dan management',
                'Process mapping dan optimization',
                'Data analysis dan reporting',
            ],
            'duration' => '3-4 bulan',
            'team_size' => 'Tim 2-3 orang',
        ]);

        InternshipProject::create([
            'title' => 'Sistem Hahayy Management',
            'category' => 'Operations Project',
            'description' => 'Mengembangkan dan mengoptimalkan sistem tracking barang untuk meningkatkan efisiensi operasional warehouse.',
            'learnings' => [
                'Database design dan management',
                'Process mapping dan optimization',
                'Data analysis dan reporting',
            ],
            'duration' => '3-4 bulan',
            'team_size' => 'Tim 2-3 orang',
        ]);
    }
}
