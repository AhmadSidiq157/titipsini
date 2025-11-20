<?php

namespace App\Http\Controllers;

use App\Models\UserVerification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class UserVerificationController extends Controller
{
    /**
     * Menampilkan form verifikasi (Halaman Full).
     * (Ini hanya fallback jika user mengakses URL langsung, jarang dipakai dengan Modal)
     */
    public function create()
    {
        $user = Auth::user();
        $verification = $user->verification;

        if ($verification) {
            if ($verification->status === 'approved') {
                return redirect()->route('dashboard');
            }
            if ($verification->status === 'pending') {
                return redirect()->route('verification.pending');
            }
        }

        return Inertia::render('Verification/Create', [
            'verification' => $verification
        ]);
    }

    /**
     * Menyimpan data verifikasi dari Modal.
     */
    public function store(Request $request)
    {
        $request->validate([
            'legal_name' => 'required|string|max:255',
            'id_card_type' => 'required|string|in:KTP,SIM,Passport',
            'id_card_number' => 'required|string|max:50',
            'address_on_id' => 'required|string',
            'gender' => 'required|string|in:laki-laki,perempuan',
            'id_card_path' => 'required|image|max:2048',
        ]);

        $user = Auth::user();
        $path = $request->file('id_card_path')->store('verification_ids', 'public');

        $user->verification()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'legal_name' => $request->legal_name,
                'id_card_type' => $request->id_card_type,
                'id_card_number' => $request->id_card_number,
                'address_on_id' => $request->address_on_id,
                'gender' => $request->gender,
                'id_card_path' => $path,
                'status' => 'pending', // Set status ke pending
                'rejection_notes' => null,
            ]
        );

        // [MODIFIKASI PENTING UNTUK MODAL]
        // Jangan redirect ke route('verification.pending').
        // Redirect back() agar tetap di halaman Layanan/Welcome
        // dan Modal akan otomatis berubah tampilan karena status user berubah.
        return redirect()->back()->with('success', 'Data verifikasi berhasil dikirim.');
    }
    /**
     * Menampilkan halaman pending (Fallback).
     */
    public function pending()
    {
        return Inertia::render('Verification/Pending');
    }

    public function checkStatus()
    {
        $user = \Illuminate\Support\Facades\Auth::user();

        if (!$user || !$user->verification) {
            return response()->json(['status' => 'null']);
        }

        return response()->json(['status' => $user->verification->status]);
    }
}
