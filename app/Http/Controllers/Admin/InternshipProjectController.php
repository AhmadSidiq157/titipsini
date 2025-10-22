<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\InternshipProject;
use App\Http\Requests\StoreInternshipProjectRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class InternshipProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Admin/Internship/Projects/Index', [
            'projects' => InternshipProject::all(),
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
    public function store(StoreInternshipProjectRequest $request)
    {
        InternshipProject::create($request->validated());
        return Redirect::route('admin.internship-projects.index')->with('success', 'Proyek magang berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(InternshipProject $internshipProject)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(InternshipProject $internshipProject)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreInternshipProjectRequest $request, InternshipProject $internshipProject)
    {
        $internshipProject->update($request->validated());
        return Redirect::route('admin.internship-projects.index')->with('success', 'Proyek magang berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(InternshipProject $internshipProject)
    {
        //
    }
}
