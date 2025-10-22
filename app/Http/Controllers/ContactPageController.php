<?php

// PASTIKAN NAMESPACE INI BENAR
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

// PASTIKAN NAMA CLASS INI BENAR (SAMA DENGAN NAMA FILE)
class ContactPageController extends Controller
{
    // ... (kode method show() dan store() ada di sini) ...
    public function show()
    {
        $branches = [
            ['name' => 'Cabang Jakarta Selatan', 'address' => 'Jl. Raya Storage No. 123, Jakarta Selatan', 'phone' => '+62 21 1234 5678', 'status' => 'Buka'],
            ['name' => 'Cabang Jakarta Pusat', 'address' => 'Jl. Sudirman No. 456, Jakarta Pusat', 'phone' => '+62 21 8765 4321', 'status' => 'Buka'],
            ['name' => 'Cabang Tangerang', 'address' => 'Jl. BSD Raya No. 789, Tangerang Selatan', 'phone' => '+62 21 5555 6666', 'status' => 'Segera Hadir'],
        ];

        return Inertia::render('Contact', [
            'branches' => $branches,
        ]);
    }

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

        return Redirect::back();
    }
}