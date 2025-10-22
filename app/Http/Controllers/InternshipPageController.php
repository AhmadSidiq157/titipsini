<?php

namespace App\Http\Controllers;

use App\Models\InternshipPosition; // <-- Import
use App\Models\InternshipProject;  // <-- Import
use Illuminate\Http\Request;
use Inertia\Inertia;

class InternshipPageController extends Controller
{
    public function show()
    {
        return Inertia::render('Internship', [
            'positions' => InternshipPosition::all(), // Kirim data posisi
            'projects' => InternshipProject::all(),   // Kirim data proyek
        ]);
    }
}
