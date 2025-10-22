<?php

// Framework & App
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// App Controllers
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ContactPageController;
use App\Http\Controllers\InternshipPageController;
use App\Http\Controllers\JobVacancyController;
use App\Http\Controllers\LayananPageController;
use App\Http\Controllers\ProgramPageController;

use App\Http\Controllers\MitraController;

// Admin Controllers
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\WelcomeController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\Admin\MovingPackageController;
use App\Http\Controllers\Admin\InternshipPositionController;
use App\Http\Controllers\Admin\InternshipProjectController;
use App\Http\Controllers\Admin\CareerProgramController;
use App\Http\Controllers\Admin\CurriculumController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Di sini Anda bisa mendaftarkan web routes untuk aplikasi Anda.
| Routes ini dimuat oleh RouteServiceProvider dalam sebuah grup
| yang mengandung middleware group "web".
|
*/

// --- RUTE HALAMAN PUBLIK ---

// Halaman Utama (Homepage)
Route::get('/', [WelcomeController::class, 'index'])->name('home');

Route::get('/mitra', [MitraController::class, 'index'])->name('mitra.index');

// Halaman Statis Lainnya
Route::get('/tentang-kami', fn() => Inertia::render('About'))->name('about');
Route::get('/program-kami', [ProgramPageController::class, 'show'])->name('program');

// Halaman dengan Controller
Route::get('/contact', [ContactPageController::class, 'show'])->name('contact.show');
Route::post('/contact', [ContactPageController::class, 'store'])->name('contact.store');
Route::get('/internship', [InternshipPageController::class, 'show'])->name('internship.show');
Route::get('/layanan', [LayananPageController::class, 'show'])->name('layanan.show');
Route::get('/lowongan-kerja', [JobVacancyController::class, 'publicIndex'])->name('careers.index');

Route::get('/Mitra/index', [MitraController::class, 'index'])->name('mitra.index');

// --- RUTE UNTUK PENGGUNA TERAUTENTIKASI ---
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Profile Routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


// --- RUTE KHUSUS ADMIN ---
Route::middleware(['auth', 'verified', 'isAdmin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        // CRUD untuk Job Vacancies
        Route::resource('job-vacancies', JobVacancyController::class)
            ->except(['show'])
            ->names('job_vacancies');

        // Manajemen User
        Route::get('users', [UserManagementController::class, 'index'])->name('users.index');
        Route::get('users/{user}/make-admin', [UserManagementController::class, 'makeAdmin'])->name('users.makeAdmin');
        Route::get('users/{user}/remove-admin', [UserManagementController::class, 'removeAdmin'])->name('users.removeAdmin');

        // Resources untuk Layanan & Paket
        Route::resource('services', ServiceController::class);
        Route::resource('moving-packages', MovingPackageController::class);
        Route::resource('internship-positions', InternshipPositionController::class);
        Route::resource('internship-projects', InternshipProjectController::class);
        Route::resource('career-programs', CareerProgramController::class);
        Route::resource('curricula', CurriculumController::class);

        // Pengaturan Situs
        Route::prefix('settings')->name('settings.')->group(function () {
            Route::get('contact', [SettingController::class, 'contact'])->name('contact');
            Route::get('social', [SettingController::class, 'social'])->name('social');
            Route::get('logo', [SettingController::class, 'logo'])->name('logo');

            Route::post('update', [SettingController::class, 'update'])->name('update');
            Route::post('logo/update', [SettingController::class, 'updateLogo'])->name('logo.update');
            Route::delete('logo/delete', [SettingController::class, 'destroyLogo'])->name('logo.destroy');
        });
    });


require __DIR__ . '/auth.php';
