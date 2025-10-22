<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User; // <-- Import model User
use Inertia\Inertia; // <-- Import Inertia

class UserManagementController extends Controller
{
    public function index()
    {
        // Ambil semua user beserta relasi roles-nya untuk efisiensi
        $users = User::with('roles')->get();

        // Kirim data users ke komponen Inertia
        return Inertia::render('Admin/Users/Index', [
            'users' => $users
        ]);
    }
}
