<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Branch;

class BranchController extends Controller
{
    // Tampilkan semua cabang
    public function index()
    {
        $branches = Branch::all();
        return Inertia::render('Admin/Branches/Index', [
            'branches' => $branches,
        ]);
    }

    // Form tambah cabang
    public function create()
    {
        return Inertia::render('Admin/Branches/Create');
    }

    // Simpan cabang baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'phone' => 'nullable|string|max:20',
            'status' => 'required|string',
            'google_maps_embed_url' => 'nullable|string',
        ]);

        Branch::create($validated);

        return redirect()->route('admin.branches.index')->with('success', 'Cabang berhasil ditambahkan.');
    }

    // Form edit cabang
    public function edit($id)
    {
        $branch = Branch::findOrFail($id);
        return Inertia::render('Admin/Branches/Edit', [
            'branch' => $branch,
        ]);
    }

    // Update cabang
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'phone' => 'nullable|string|max:20',
            'status' => 'required|string',
            'google_maps_embed_url' => 'nullable|string',
        ]);

        $branch = Branch::findOrFail($id);
        $branch->update($validated);

        return redirect()->route('admin.branches.index')->with('success', 'Cabang berhasil diperbarui.');
    }

    // Hapus cabang
    public function destroy($id)
    {
        $branch = Branch::findOrFail($id);
        $branch->delete();

        return redirect()->route('admin.branches.index')->with('success', 'Cabang berhasil dihapus.');
    }
}
