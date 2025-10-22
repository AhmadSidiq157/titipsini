<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Curriculum;
use App\Http\Requests\StoreCurriculumRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class CurriculumController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Program/Curriculums/Index', [
            'curricula' => Curriculum::all(),
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
    public function store(StoreCurriculumRequest $request)
    {
        Curriculum::create($request->validated());
        return Redirect::route('admin.curricula.index')->with('success', 'Kurikulum berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Curriculum $curriculum)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Curriculum $curriculum)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreCurriculumRequest $request, Curriculum $curriculum)
    {
        $curriculum->update($request->validated());
        return Redirect::route('admin.curricula.index')->with('success', 'Kurikulum berhasil diperbarui.');
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Curriculum $curriculum)
    {
        //
    }
}
