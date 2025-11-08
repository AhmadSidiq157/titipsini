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
use App\Http\Controllers\Admin\DashboardController as ClientDashboardController; // Alias dari Admin/Dashboard

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
// --- [BARU] Import Verifikasi Kurir ---
use App\Http\Controllers\Admin\CourierVerificationController;


// --- [BARU] Import Controller Kurir ---
use App\Http\Controllers\Courier\DashboardController as CourierDashboardController;
use App\Http\Controllers\Courier\TaskController as CourierTaskController;
// --- [BARU] Import Verifikasi Kurir (Sisi Kurir) ---
use App\Http\Controllers\Courier\VerificationController as CourierVerificationSideController;


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

Route::get('/', [WelcomeController::class, 'index'])->name('home');
Route::get('/tentang-kami', fn() => Inertia::render('About'))->name('about');
Route::get('/contact', [ContactPageController::class, 'show'])->name('contact.show');
Route::post('/contact', [ContactPageController::class, 'store'])->name('contact.store');
Route::get('/layanan', [LayananPageController::class, 'show'])->name('layanan.show');
Route::get('/Mitra/index', [MitraController::class, 'index'])->name('mitra.index');

// --- RUTE UNTUK PENGGUNA TERAUTENTIKASI ---
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard (ClientDashboardController menunjuk ke Admin\DashboardController)
    Route::get('/dashboard', [ClientDashboardController::class, 'index'])->name('dashboard');

    // Profile Routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // --- RUTE ORDER KLIEN ---
    Route::prefix('order')->name('order.')->group(function () {
        Route::get('/create', [OrderController::class, 'create'])->name('create');
        Route::get('/{order}/payment', [OrderController::class, 'payment'])->name('payment');
        Route::get('/{order}/success', [OrderController::class, 'success'])->name('success');
        Route::post('/', [OrderController::class, 'store'])->name('store')->middleware('isVerified');
        Route::post('/{order}/payment', [OrderController::class, 'submitPayment'])->name('submitPayment')->middleware('isVerified');
    });

    // --- RUTE VERIFIKASI KTP KLIEN ---
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

        // Manajemen User
        Route::get('users', [UserManagementController::class, 'index'])->name('users.index');
        Route::get('users/{user}/make-admin', [UserManagementController::class, 'makeAdmin'])->name('users.makeAdmin');
        Route::get('users/{user}/remove-admin', [UserManagementController::class, 'removeAdmin'])->name('users.removeAdmin');

        // Rute Verifikasi KLIEN
        Route::get('verifications', [UserManagementController::class, 'verificationIndex'])->name('verification.index');
        Route::get('verifications/{userVerification}', [UserManagementController::class, 'verificationShow'])->name('verification.show');
        Route::post('verifications/{userVerification}/approve', [UserManagementController::class, 'verificationApprove'])->name('verification.approve');
        Route::post('verifications/{userVerification}/reject', [UserManagementController::class, 'verificationReject'])->name('verification.reject');

        // Resources untuk Layanan & Paket
        Route::resource('services', ServiceController::class);
        Route::resource('moving-packages', MovingPackageController::class);

        // Manajemen Pesanan Admin
        Route::prefix('orders')->name('orders.')->group(function () {
            Route::get('/', [OrderManagementController::class, 'index'])->name('index');
            Route::get('/{order}', [OrderManagementController::class, 'show'])->name('show');
            Route::post('/{order}/approve', [OrderManagementController::class, 'approvePayment'])->name('approve');
            Route::post('/{order}/reject', [OrderManagementController::class, 'rejectPayment'])->name('reject');
            Route::post('/{order}/assign-courier', [OrderManagementController::class, 'assignCourier'])->name('assignCourier');
        });

        // --- [BARU] Manajemen Verifikasi Kurir ---
        Route::prefix('courier-verifications')
            ->name('courier_verifications.')
            ->controller(CourierVerificationController::class) // Gunakan controller group
            ->group(function () {

                Route::get('/', 'index')->name('index');
                Route::get('/{verification}', 'show')->name('show');
                Route::post('/{verification}/approve', 'approve')->name('approve');
                Route::post('/{verification}/reject', 'reject')->name('reject');
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

// --- RUTE KHUSUS KURIR ---
Route::middleware(['auth', 'verified', 'courier']) // <-- Dilindungi middleware 'courier'
    ->prefix('courier')
    ->name('courier.')
    ->group(function () {

        // Verifikasi Sisi Kurir
        Route::get('/verification/create', [CourierVerificationSideController::class, 'create'])->name('verification.create');
        Route::post('/verification/store', [CourierVerificationSideController::class, 'store'])->name('verification.store');
        Route::get('/verification/pending', [CourierVerificationSideController::class, 'pending'])->name('verification.pending');

        // Dashboard & Tugas Kurir
        Route::get('/dashboard', [CourierDashboardController::class, 'index'])->name('dashboard');
        Route::get('/tasks/{id}', [CourierTaskController::class, 'show'])->name('tasks.show');
        Route::patch('/tasks/{id}/update-status', [CourierTaskController::class, 'updateStatus'])->name('tasks.updateStatus');
    });


require __DIR__ . '/auth.php';
