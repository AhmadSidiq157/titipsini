<?php

namespace App\Http\Controllers;

use App\Models\JobVacancy;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JobVacancyController extends Controller
{
    /**
     * Display a listing of the resource for Admin.
     */
    public function index()
    {
        return Inertia::render('Admin/JobVacancies/Index', [
            'job_vacancies' => JobVacancy::latest()->get(),
        ]);
    }

    /**
     * Display the public careers page.
     */
    public function publicIndex()
    {
        $publicVacancies = JobVacancy::where('status', 'Open')
            ->orWhere('status', 'Urgent Hiring')
            ->latest()
            ->get();

        // BLOK PENYEBAB ERROR SUDAH DIHAPUS DARI SINI.
        // KITA PERCAYAKAN PADA MODEL UNTUK MENGUBAH DATA.

        return Inertia::render('Careers', [
            'jobVacancies' => $publicVacancies,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/JobVacancies/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'salary_range' => 'nullable|string|max:255',
            'type' => 'required|string|in:Full-time,Part-time,Internship,Contract',
            'status' => 'required|string|in:Open,Urgent Hiring,Closed',
            'description' => 'required|string',
            'requirements' => 'required|string',
        ]);

        JobVacancy::create($validated);

        return redirect()->route('admin.job_vacancies.index')->with('success', 'Job vacancy created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(JobVacancy $jobVacancy)
    {
        return Inertia::render('Admin/JobVacancies/Edit', [
            'job_vacancy' => $jobVacancy
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, JobVacancy $jobVacancy)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'salary_range' => 'nullable|string|max:255',
            'type' => 'required|string|in:Full-time,Part-time,Internship,Contract',
            'status' => 'required|string|in:Open,Urgent Hiring,Closed',
            'description' => 'required|string',
            'requirements' => 'required|string',
        ]);

        $jobVacancy->update($validated);

        return redirect()->route('admin.job_vacancies.index')->with('success', 'Job vacancy updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(JobVacancy $jobVacancy)
    {
        $jobVacancy->delete();

        return redirect()->route('admin.job_vacancies.index')->with('success', 'Job vacancy deleted successfully.');
    }
}
