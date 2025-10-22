<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        Setting::truncate(); // Kosongkan tabel dulu untuk menghindari duplikat

        $settings = [
            // Kontak
            ['key' => 'contact_phone', 'value' => '+62 812-3456-7890'],
            ['key' => 'contact_email', 'value' => 'info@titipsini.com'],
            ['key' => 'contact_address', 'value' => 'Jakarta, Indonesia'],
            ['key' => 'whatsapp_message', 'value' => 'Halo Titipsini, saya ingin bertanya tentang layanan Anda.'],

            // Sosial Media
            ['key' => 'social_facebook', 'value' => '#'],
            ['key' => 'social_instagram', 'value' => '#'],
            ['key' => 'social_twitter', 'value' => '#'],

            // Logo
            ['key' => 'site_logo', 'value' => null],
        ];

        foreach ($settings as $setting) {
            Setting::create($setting);
        }
    }
}
