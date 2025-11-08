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
use App\Http\Controllers\OrderController;
use App\Http\Controllers\UserVerificationController;

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
use App\Http\Controllers\Admin\OrderManagementController;

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

// Route::get('/mitra', [MitraController::class, 'index'])->name('mitra.index');

// Halaman Statis Lainnya
Route::get('/tentang-kami', fn() => Inertia::render('About'))->name('about');
// --- [MODIFIKASI] Route dimatikan sesuai permintaan ---
// Route::get('/program-kami', [ProgramPageController::class, 'show'])->name('program');

// Halaman dengan Controller
Route::get('/contact', [ContactPageController::class, 'show'])->name('contact.show');
Route::post('/contact', [ContactPageController::class, 'store'])->name('contact.store');

// --- [MODIFIKASI] Route dimatikan sesuai permintaan ---
// Route::get('/internship', [InternshipPageController::class, 'show'])->name('internship.show');

Route::get('/layanan', [LayananPageController::class, 'show'])->name('layanan.show');

// --- [MODIFIKASI] Route dimatikan sesuai permintaan ---
// Route::get('/lowongan-kerja', [JobVacancyController::class, 'publicIndex'])->name('careers.index');

Route::get('/Mitra/index', [MitraController::class, 'index'])->name('mitra.index');

// --- RUTE UNTUK PENGGUNA TERAUTENTIKASI ---
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Profile Routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // --- RUTE ORDER (MODIFIKASI) ---
    // Middleware 'isVerified' dihapus dari grup agar modal bisa me-load data (GET)
    Route::prefix('order')->name('order.')->group(function () {
        // Rute GET ini dibiarkan terbuka untuk di-fetch oleh modal.
        Route::get('/create', [OrderController::class, 'create'])->name('create');
        Route::get('/{order}/payment', [OrderController::class, 'payment'])->name('payment');
        Route::get('/{order}/success', [OrderController::class, 'success'])->name('success');

        // Rute POST ini WAJIB dilindungi middleware 'isVerified'
        // Ini adalah lapisan keamanan backend.
        Route::post('/', [OrderController::class, 'store'])->name('store')->middleware('isVerified');
        Route::post('/{order}/payment', [OrderController::class, 'submitPayment'])->name('submitPayment')->middleware('isVerified');
    });

    // --- RUTE VERIFIKASI KTP (TETAP SAMA) ---
    // Rute ini harus bisa diakses oleh user yg 'belum terverifikasi', jadi JANGAN tambahkan 'isVerified'
    Route::prefix('verification')->name('verification.')->group(function () {
        Route::get('/create', [UserVerificationController::class, 'create'])->name('create');
        Route::post('/', [UserVerificationController::class, 'store'])->name('store');
        Route::get('/pending', [UserVerificationController::class, 'pending'])->name('pending');
    });
});


// --- RUTE KHUSUS ADMIN ---
Route::middleware(['auth', 'verified', 'isAdmin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        // --- [MODIFIKASI] Route dimatikan sesuai permintaan ---
        // CRUD untuk Job Vacancies
        // Route::resource('job-vacancies', JobVacancyController::class)
        //     ->except(['show'])
        //     ->names('job_vacancies');

        // Manajemen User
        Route::get('users', [UserManagementController::class, 'index'])->name('users.index');
        Route::get('users/{user}/make-admin', [UserManagementController::class, 'makeAdmin'])->name('users.makeAdmin');
        Route::get('users/{user}/remove-admin', [UserManagementController::class, 'removeAdmin'])->name('users.removeAdmin');

        // ===================================================================
        // Rute Verifikasi
        Route::get('verifications', [UserManagementController::class, 'verificationIndex'])->name('verification.index');
        Route::get('verifications/{userVerification}', [UserManagementController::class, 'verificationShow'])->name('verification.show');
        
        // --- INI DUA BARIS YANG DITAMBAHKAN UNTUK MEMPERBAIKI ERROR ---
        Route::post('verifications/{userVerification}/approve', [UserManagementController::class, 'verificationApprove'])->name('verification.approve');
        Route::post('verifications/{userVerification}/reject', [UserManagementController::class, 'verificationReject'])->name('verification.reject');
        // ===================================================================

        // Resources untuk Layanan & Paket
        Route::resource('services', ServiceController::class);
        Route::resource('moving-packages', MovingPackageController::class);
        
        // --- [MODIFIKASI] Route dimatikan sesuai permintaan ---
        // Route::resource('internship-positions', InternshipPositionController::class);
        // Route::resource('internship-projects', InternshipProjectController::class);
        // Route::resource('career-programs', CareerProgramController::class);
        // Route::resource('curricula', CurriculumController::class);

        // Manajemen Pesanan Admin
        Route::prefix('orders')->name('orders.')->group(function () {
            Route::get('/', [OrderManagementController::class, 'index'])->name('index');
            Route::get('/{order}', [OrderManagementController::class, 'show'])->name('show');
            Route::post('/{order}/approve', [OrderManagementController::class, 'approvePayment'])->name('approve');
            Route::post('/{order}/reject', [OrderManagementController::class, 'rejectPayment'])->name('reject');
        });

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