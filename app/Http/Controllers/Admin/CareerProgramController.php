<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CareerProgram;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\StoreCareerProgramRequest;
use Illuminate\Support\Facades\Redirect;

class CareerProgramController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Program/Careers/Index', [
            'programs' => CareerProgram::all(),
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
    public function store(StoreCareerProgramRequest $request)
    {
        CareerProgram::create($request->validated());
        return Redirect::route('admin.career-programs.index')->with('success', 'Program berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(CareerProgram $careerProgram)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CareerProgram $careerProgram)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreCareerProgramRequest $request, CareerProgram $careerProgram)
    {
        $careerProgram->update($request->validated());
        return Redirect::route('admin.career-programs.index')->with('success', 'Program berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CareerProgram $careerProgram)
    {
        //
    }
}
