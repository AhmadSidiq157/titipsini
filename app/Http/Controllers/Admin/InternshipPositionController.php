<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\InternshipPosition;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\StoreInternshipPositionRequest;
use Illuminate\Support\Facades\Redirect;

class InternshipPositionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Admin/Internship/Positions/Index', [
            'positions' => InternshipPosition::all(),
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
    public function store(StoreInternshipPositionRequest $request)
    {
        InternshipPosition::create($request->validated());
        return Redirect::route('admin.internship-positions.index')->with('success', 'Posisi magang berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(InternshipPosition $internshipPosition)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(InternshipPosition $internshipPosition)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreInternshipPositionRequest $request, InternshipPosition $internshipPosition)
    {
        $internshipPosition->update($request->validated());
        return Redirect::route('admin.internship-positions.index')->with('success', 'Posisi magang berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(InternshipPosition $internshipPosition)
    {
        //
    }
}
