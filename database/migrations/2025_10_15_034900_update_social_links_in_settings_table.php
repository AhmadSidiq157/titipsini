<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Ambil semua data sosmed yang lama
        $oldSocials = DB::table('settings')
            ->whereIn('key', ['social_facebook', 'social_instagram', 'social_twitter'])
            ->pluck('value', 'key');

        $newSocialLinks = [];

        // 2. Ubah formatnya menjadi array of objects
        if ($oldSocials->has('social_facebook') && !empty($oldSocials['social_facebook'])) {
            $newSocialLinks[] = ['name' => 'Facebook', 'url' => $oldSocials['social_facebook']];
        }
        if ($oldSocials->has('social_instagram') && !empty($oldSocials['social_instagram'])) {
            $newSocialLinks[] = ['name' => 'Instagram', 'url' => $oldSocials['social_instagram']];
        }
        if ($oldSocials->has('social_twitter') && !empty($oldSocials['social_twitter'])) {
            $newSocialLinks[] = ['name' => 'Twitter', 'url' => $oldSocials['social_twitter']];
        }

        // 3. Simpan data baru sebagai satu entri JSON
        if (!empty($newSocialLinks)) {
            DB::table('settings')->updateOrInsert(
                ['key' => 'social_links'],
                ['value' => json_encode($newSocialLinks)]
            );
        }

        // 4. Hapus data lama
        DB::table('settings')->whereIn('key', ['social_facebook', 'social_instagram', 'social_twitter'])->delete();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // 1. Ambil data JSON dari 'social_links'
        $socialLinksValue = DB::table('settings')->where('key', 'social_links')->value('value');

        if ($socialLinksValue) {
            $socialLinks = json_decode($socialLinksValue, true);

            // 2. Kembalikan data ke format lama
            foreach ($socialLinks as $link) {
                $key = 'social_' . strtolower($link['name']);
                DB::table('settings')->updateOrInsert(
                    ['key' => $key],
                    ['value' => $link['url']]
                );
            }
        }

        // 3. Hapus entri 'social_links'
        DB::table('settings')->where('key', 'social_links')->delete();
    }
};
