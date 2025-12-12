<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Cache;
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
        // Gunakan get() pada collection untuk menghindari error jika key tidak ada
        $socialLinksString = $settings->get('social_links', '[]');
        $socialLinks = json_decode($socialLinksString, true);

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

    /**
     * Menghapus logo situs.
     */
    public function destroyLogo()
    {
        // 1. Ambil path logo saat ini dari database
        $logoPath = Setting::where('key', 'site_logo')->value('value');

        // 2. Jika ada path-nya, hapus file dari storage
        if ($logoPath && Storage::disk('public')->exists($logoPath)) {
            Storage::disk('public')->delete($logoPath);
        }

        // 3. Update database, set nilai logo menjadi null
        Setting::updateOrCreate(
            ['key' => 'site_logo'],
            ['value' => null]
        );

        // 4. Bersihkan cache agar perubahan tampil di frontend
        Cache::forget('settings');
        Cache::forget('app_settings');

        return redirect()->back()->with('success', 'Logo berhasil dihapus.');
    }

    /**
     * Memperbarui pengaturan berbasis teks (Kontak & Sosmed).
     */
    public function update(Request $request)
    {
        // Validasi digabung: validasi untuk data kontak DAN data social_links
        $validated = $request->validate([
            'contact_phone'    => 'sometimes|nullable|string|max:255',
            'contact_email'    => 'sometimes|nullable|email|max:255',
            'contact_address'  => 'sometimes|nullable|string|max:255',
            'whatsapp_message' => 'sometimes|nullable|string|max:1000',

            // Validasi untuk social_links yang dinamis
            'social_links'       => 'sometimes|nullable|array',
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
        Cache::forget('app_settings');

        return redirect()->back()->with('success', 'Pengaturan berhasil diperbarui.');
    }

    /**
     * Memperbarui logo situs.
     */
    public function updateLogo(Request $request)
    {
        $request->validate([
            'site_logo' => 'required|image|mimes:png,jpg,jpeg,svg,webp|max:2048', // Ubah input name jadi 'site_logo' sesuai konvensi atau sesuaikan dengan form frontend
        ]);

        // Ambil path logo lama
        $oldLogoPath = Setting::where('key', 'site_logo')->value('value');

        // Simpan file baru (gunakan key input yang benar, misal 'site_logo')
        // Jika di form frontend input namenya 'logo', ganti $request->file('site_logo') jadi $request->file('logo')
        // Asumsi form frontend mengirim dengan nama 'site_logo' agar konsisten dengan key db, atau 'logo'
        $file = $request->file('site_logo') ?? $request->file('logo'); 
        
        if (!$file) {
             return redirect()->back()->with('error', 'File logo tidak ditemukan.');
        }

        $newLogoPath = $file->store('settings', 'public'); // Folder settings lebih rapi

        // Hapus file logo lama jika ada
        if ($oldLogoPath && Storage::disk('public')->exists($oldLogoPath)) {
            Storage::disk('public')->delete($oldLogoPath);
        }

        // Update path logo di database
        Setting::updateOrCreate(
            ['key' => 'site_logo'],
            ['value' => $newLogoPath]
        );

        Cache::forget('settings');
        Cache::forget('app_settings');

        return redirect()->back()->with('success', 'Logo berhasil diperbarui.');
    }

    /**
     * [BARU] Menampilkan halaman pengaturan pembayaran.
     */
    public function payment()
    {
        // Ambil settingan pembayaran
        $settings = Setting::whereIn('key', [
            'payment_bank_name',
            'payment_account_number',
            'payment_account_holder',
            'payment_instruction',
            'payment_qris_image' // [BARU] Ambil juga path QRIS
        ])->pluck('value', 'key');

        return Inertia::render('Admin/PaymentSettings/Index', [
            'settings' => $settings
        ]);
    }

    /**
     * [MODIFIKASI] Menyimpan perubahan data pembayaran + Upload QRIS.
     */
    public function updatePayment(Request $request)
    {
        $request->validate([
            'payment_bank_name'      => 'required|string|max:100',
            'payment_account_number' => 'required|string|max:50',
            'payment_account_holder' => 'required|string|max:100',
            'payment_instruction'    => 'nullable|string|max:500',
            'payment_qris_image'     => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048', // [BARU] Validasi gambar
        ]);

        // 1. Simpan Data Teks Biasa
        $dataText = $request->only([
            'payment_bank_name',
            'payment_account_number',
            'payment_account_holder',
            'payment_instruction'
        ]);

        foreach ($dataText as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value ?? '']
            );
        }

        // 2. Logic Upload QRIS (BARU)
        if ($request->hasFile('payment_qris_image')) {
            // Hapus gambar lama jika ada
            $oldImage = Setting::where('key', 'payment_qris_image')->value('value');
            if ($oldImage && Storage::disk('public')->exists($oldImage)) {
                Storage::disk('public')->delete($oldImage);
            }

            // Simpan gambar baru
            $path = $request->file('payment_qris_image')->store('settings/payment', 'public');

            // Simpan path ke database
            Setting::updateOrCreate(
                ['key' => 'payment_qris_image'],
                ['value' => $path]
            );
        }

        // Hapus cache agar data di Frontend User langsung berubah
        Cache::forget('app_settings');
        Cache::forget('settings');

        return redirect()->back()->with('success', 'Data pembayaran berhasil diperbarui.');
    }
}