<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BranchController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Branches/Index', [
            'branches' => Branch::all()
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Branches/Create');
    }

    public function store(Request $request)
    {
        // [FIX] Validasi harus lengkap agar data masuk ke database
        $validated = $request->validate([
            'name'      => 'required|string|max:255',
            'address'   => 'required|string|max:500',
            'phone'     => 'required|string|max:20',
            // Tambahkan 'Segera Hadir' agar tidak error saat dipilih
            'status'    => 'required|in:Buka,Tutup,Segera Hadir', 
            
            // [WAJIB] Koordinat
            'latitude'  => 'required|numeric',
            'longitude' => 'required|numeric',
            
            // [BARU] Link Embed (Nullable artinya boleh kosong)
            'google_maps_embed_url' => 'nullable|string',
        ]);

        Branch::create($validated);

        return redirect()->route('admin.branches.index')->with('success', 'Cabang berhasil ditambahkan.');
    }

    public function edit(Branch $branch)
    {
        return Inertia::render('Admin/Branches/Edit', [
            'branch' => $branch
        ]);
    }

    public function update(Request $request, Branch $branch)
    {
        // [FIX] Validasi Update juga harus sama lengkapnya
        $validated = $request->validate([
            'name'      => 'required|string|max:255',
            'address'   => 'required|string|max:500',
            'phone'     => 'required|string|max:20',
            'status'    => 'required|in:Buka,Tutup,Segera Hadir',
            'latitude'  => 'required|numeric',
            'longitude' => 'required|numeric',
            'google_maps_embed_url' => 'nullable|string',
        ]);

        $branch->update($validated);

        return redirect()->route('admin.branches.index')->with('success', 'Cabang berhasil diperbarui.');
    }

    public function destroy(Branch $branch)
    {
        $branch->delete();
        return redirect()->back()->with('success', 'Cabang berhasil dihapus.');
    }
}