<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MovingPackage;
use App\Http\Requests\StoreMovingPackageRequest; 
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class MovingPackageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // [UPDATE] Gunakan orderBy agar paket terbaru muncul di atas
        $packages = MovingPackage::orderBy('created_at', 'desc')->get();

        // Render komponen React untuk halaman admin paket
        return Inertia::render('Admin/MovingPackages/Index', [
            'packages' => $packages
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // (Tidak dipakai, modal menangani ini)
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMovingPackageRequest $request)
    {
        // Validasi ditangani oleh StoreMovingPackageRequest
        // Data yang masuk sini sudah bersih (termasuk price_per_km & max_distance)
        MovingPackage::create($request->validated());
        
        return Redirect::route('admin.moving-packages.index')
            ->with('success', 'Paket berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(MovingPackage $movingPackage)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MovingPackage $movingPackage)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreMovingPackageRequest $request, MovingPackage $movingPackage)
    {
        // Update data dengan input yang sudah divalidasi
        $movingPackage->update($request->validated());
        
        return Redirect::route('admin.moving-packages.index')
            ->with('success', 'Paket berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MovingPackage $movingPackage)
    {
        $movingPackage->delete();
        
        return Redirect::route('admin.moving-packages.index')
            ->with('success', 'Paket berhasil dihapus.');
    }
}