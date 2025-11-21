<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage; // [PENTING] Jangan lupa import ini

class ServiceController extends Controller
{
    /**
     * Menampilkan halaman daftar layanan.
     */
    public function index()
    {
        return Inertia::render('Admin/Services/Index', [
            // Mengurutkan dari yang terbaru
            'services' => Service::latest()->get(),
            'flash' => session()->only(['success', 'error'])
        ]);
    }

    /**
     * Menyimpan layanan baru ke database.
     */
    public function store(Request $request)
    {
        // 1. Validasi Input
        $data = $request->validate([
            'title'        => 'required|string|max:255',
            'description'  => 'required|string',
            'price'        => 'required|numeric|min:0',
            'illustration' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Max 2MB
            'features'     => 'nullable|array', // Wajib array karena di frontend bentuknya list
        ]);

        // 2. Handle Upload Gambar
        // Default gambar jika user tidak upload
        $imagePath = '/images/placeholder.jpg'; 

        if ($request->hasFile('illustration')) {
            // Simpan file fisik ke: storage/app/public/services
            $path = $request->file('illustration')->store('services', 'public');
            
            // Simpan path URL publik ke database: /storage/services/namagambar.jpg
            $imagePath = '/storage/' . $path;
        }

        // 3. Simpan ke Database
        Service::create([
            'title'        => $data['title'],
            'description'  => $data['description'],
            'price'        => $data['price'],
            'illustration' => $imagePath,
            // Pastikan features tidak null (minimal array kosong)
            'features'     => $data['features'] ?? [], 
        ]);

        return Redirect::route('admin.services.index')
            ->with('success', 'Layanan berhasil ditambahkan.');
    }

    /**
     * Memperbarui layanan yang sudah ada.
     */
    public function update(Request $request, Service $service)
    {
        // 1. Validasi
        $data = $request->validate([
            'title'        => 'required|string|max:255',
            'description'  => 'required|string',
            'price'        => 'required|numeric|min:0',
            'illustration' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'features'     => 'nullable|array',
        ]);

        // 2. Cek apakah ada upload gambar BARU
        if ($request->hasFile('illustration')) {
            
            // Hapus gambar LAMA dari penyimpanan (jika ada dan bukan placeholder default)
            if ($service->illustration && str_contains($service->illustration, '/storage/')) {
                // Ubah '/storage/services/abc.jpg' menjadi 'services/abc.jpg' untuk dihapus
                $oldPath = str_replace('/storage/', '', $service->illustration);
                Storage::disk('public')->delete($oldPath);
            }

            // Upload gambar BARU
            $path = $request->file('illustration')->store('services', 'public');
            
            // Update path di array data
            $data['illustration'] = '/storage/' . $path;
        } else {
            // Jika tidak ada gambar baru, HAPUS key 'illustration' dari array $data
            // Agar data gambar lama di database TIDAK tertimpa menjadi null
            unset($data['illustration']);
        }

        // 3. Update Database
        $service->update($data);

        return Redirect::route('admin.services.index')
            ->with('success', 'Layanan berhasil diperbarui.');
    }

    /**
     * Menghapus layanan.
     */
    public function destroy(Service $service)
    {
        // 1. Hapus file fisik gambar jika ada di storage
        if ($service->illustration && str_contains($service->illustration, '/storage/')) {
             $relativePath = str_replace('/storage/', '', $service->illustration);
             Storage::disk('public')->delete($relativePath);
        }

        // 2. Hapus data dari database
        $service->delete();

        return Redirect::route('admin.services.index')
            ->with('success', 'Layanan berhasil dihapus.');
    }
}