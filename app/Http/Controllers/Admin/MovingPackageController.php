<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MovingPackage;
use App\Http\Requests\StoreMovingPackageRequest; // <-- Import
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect; // <-- Import

class MovingPackageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Ambil semua data paket dari database
        $packages = MovingPackage::all();

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
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMovingPackageRequest $request)
    {
        MovingPackage::create($request->validated());
        return Redirect::route('admin.moving-packages.index')->with('success', 'Paket berhasil ditambahkan.');
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
        $movingPackage->update($request->validated());
        return Redirect::route('admin.moving-packages.index')->with('success', 'Paket berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MovingPackage $movingPackage)
    {
        //
    }
}
