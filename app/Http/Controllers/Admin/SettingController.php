<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Setting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    /**
     * Menampilkan form untuk pengaturan kontak.
     */
    public function contact()
    {
        return Inertia::render('Admin/Settings/Contact/Index', [
            'settings' => Setting::all()->pluck('value', 'key')
        ]);
    }

    /**
     * Menampilkan form untuk pengaturan media sosial.
     */
    public function social()
    {
        $settings = Setting::all()->pluck('value', 'key');

        // Decode string JSON dari database menjadi array PHP
        $socialLinks = json_decode($settings->get('social_links', '[]'), true);

        return Inertia::render('Admin/Settings/Social/Index', [
            'settings' => [
                'social_links' => $socialLinks,
            ]
        ]);
    }

    /**
     * Menampilkan form untuk pengaturan logo.
     */
    public function logo()
    {
        return Inertia::render('Admin/Settings/Logo/Index', [
            'settings' => Setting::all()->pluck('value', 'key')
        ]);
    }

    public function destroyLogo()
    {
        // 1. Ambil path logo saat ini dari database
        $logoPath = Setting::where('key', 'site_logo')->value('value');

        // 2. Jika ada path-nya, hapus file dari storage
        if ($logoPath) {
            Storage::disk('public')->delete($logoPath);
        }

        // 3. Update database, set nilai logo menjadi null
        Setting::where('key', 'site_logo')->update(['value' => null]);

        // 4. Bersihkan cache agar perubahan tampil di frontend
        Cache::forget('settings');

        return redirect()->back()->with('success', 'Logo berhasil dihapus.');
    }

    /**
     * Memperbarui pengaturan berbasis teks (Kontak & Sosmed).
     */
    public function update(Request $request)
    {
        // Validasi digabung: validasi untuk data kontak DAN data social_links
        $validated = $request->validate([
            'contact_phone'     => 'sometimes|nullable|string|max:255',
            'contact_email'     => 'sometimes|nullable|email|max:255',
            'contact_address'   => 'sometimes|nullable|string|max:255',
            'whatsapp_message'  => 'sometimes|nullable|string|max:1000',

            // Validasi untuk social_links yang dinamis
            'social_links'      => 'sometimes|nullable|array',
            'social_links.*.name' => 'required_with:social_links|string|max:255',
            'social_links.*.url'  => 'required_with:social_links|url|max:255',
        ]);

        // Loop melalui semua data yang divalidasi
        foreach ($validated as $key => $value) {
            // Jika key adalah 'social_links', kita encode dulu ke JSON sebelum disimpan
            if ($key === 'social_links') {
                Setting::updateOrCreate(
                    ['key' => 'social_links'],
                    ['value' => json_encode($value ?? [])]
                );
            } else {
                // Untuk key lainnya, simpan seperti biasa
                Setting::updateOrCreate(
                    ['key' => $key],
                    ['value' => $value ?? '']
                );
            }
        }

        Cache::forget('settings');

        return redirect()->back()->with('success', 'Pengaturan berhasil diperbarui.');
    }

    /**
     * Memperbarui logo situs.
     */
    public function updateLogo(Request $request)
    {
        $request->validate([
            'logo' => 'required|image|mimes:png,jpg,jpeg,svg,webp|max:2048',
        ]);

        // Ambil path logo lama
        $oldLogoPath = Setting::where('key', 'site_logo')->value('value');

        // Simpan file baru
        $newLogoPath = $request->file('logo')->store('logos', 'public');

        // Hapus file logo lama jika ada
        if ($oldLogoPath) {
            Storage::disk('public')->delete($oldLogoPath);
        }

        // Update path logo di database
        Setting::updateOrCreate(
            ['key' => 'site_logo'],
            ['value' => $newLogoPath]
        );

        Cache::forget('settings');

        return redirect()->back()->with('success', 'Logo berhasil diperbarui.');
    }
}
