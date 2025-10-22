<?php

namespace App\Http\Controllers;

use App\Models\CareerProgram;
use App\Models\Curriculum;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProgramPageController extends Controller
{
    public function show()
    {
        return Inertia::render('Program', [
            'programs' => CareerProgram::all(),
            'curriculums' => Curriculum::all(),
        ]);
    }
}
