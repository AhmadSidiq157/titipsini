<?php

// PASTIKAN NAMESPACE INI BENAR
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use App\Models\Branch; // <-- 1. IMPORT MODEL BRANCH

// PASTIKAN NAMA CLASS INI BENAR (SAMA DENGAN NAMA FILE)
class ContactPageController extends Controller
{
    /**
     * Menampilkan halaman kontak publik.
     */
    public function show()
    {
        // 2. HAPUS ARRAY STATIS
        // $branches = [ ... ];

        // 3. AMBIL DATA DARI DATABASE
        $branches = Branch::all(); // ->get() juga bisa

        return Inertia::render('Contact', [
            'branches' => $branches, // Kirim data dinamis
        ]);
    }

    /**
     * Menyimpan pesan dari form kontak.
     */
    public function store(Request $request)
    {
        $request->validate([
            'fullName' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        Log::info('Pesan Kontak Baru Diterima:', $request->all());

        // Redirect kembali dengan pesan sukses
        return Redirect::back()->with('success', 'Pesan Anda telah terkirim!');
    }
}