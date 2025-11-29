<?php

// Framework & App
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// App Controllers
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ContactPageController;
use App\Http\Controllers\LayananPageController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\UserVerificationController;
use App\Http\Controllers\MitraController;
use App\Http\Controllers\HistoryController;

// Admin Controllers
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserManagementController; // [PENTING] Gunakan Controller yang ada
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\WelcomeController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\Admin\MovingPackageController;
use App\Http\Controllers\Admin\OrderManagementController;
use App\Http\Controllers\Admin\PindahanManagementController;
use App\Http\Controllers\Admin\CourierVerificationController;
use App\Http\Controllers\Admin\BranchController;

// --- Controller Kurir ---
use App\Http\Controllers\Courier\DashboardController as CourierDashboardController;
use App\Http\Controllers\Courier\TaskController as CourierTaskController;
use App\Http\Controllers\Courier\AuthController as CourierAuthController;


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// --- RUTE LOGIN & REGISTER KURIR (Tamu) ---
Route::middleware('guest')->prefix('courier')->name('courier.')->group(function () {
    Route::get('login', [CourierAuthController::class, 'showLoginForm'])->name('login');
    Route::post('login', [CourierAuthController::class, 'login'])->name('login.store');
    Route::get('register', [CourierAuthController::class, 'showRegisterForm'])->name('register');
    Route::post('register', [CourierAuthController::class, 'register'])->name('register.store');
});

// Rute Logout Kurir
Route::middleware('auth')->prefix('courier')->name('courier.')->group(function () {
    Route::post('logout', [CourierAuthController::class, 'logout'])->name('logout');
});


// --- RUTE HALAMAN PUBLIK ---
Route::get('/', [WelcomeController::class, 'index'])->name('home');
Route::get('/tentang-kami', fn() => Inertia::render('About'))->name('about');
Route::get('/contact', [ContactPageController::class, 'show'])->name('contact.show');
Route::post('/contact', [ContactPageController::class, 'store'])->name('contact.store');

// [ROUTE] Layanan Pindahan & Penitipan
Route::get('/pindahan', [LayananPageController::class, 'pindahan'])->name('pindahan.index');
Route::get('/penitipan', [LayananPageController::class, 'penitipan'])->name('penitipan.index');

// [ROUTE] Mitra
Route::get('/mitra', [MitraController::class, 'index'])->name('mitra.index');


// --- RUTE UNTUK PENGGUNA TERAUTENTIKASI (CLIENT) ---
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Profile Routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Riwayat Pesanan & Status
    Route::get('/history', [HistoryController::class, 'index'])->name('history.index');
    Route::get('/history/{order}', [HistoryController::class, 'show'])->name('history.show');
    Route::get('/order/{order}/status', [OrderController::class, 'getStatus'])->name('order.status');

    // Order & Pembayaran
    Route::prefix('order')->name('order.')->group(function () {
        Route::get('/create', [OrderController::class, 'create'])->name('create');
        Route::post('/', [OrderController::class, 'store'])->name('store')->middleware('isVerified');
        Route::get('/{order}/payment', [OrderController::class, 'payment'])->name('payment');
        Route::post('/{order}/payment', [OrderController::class, 'submitPayment'])->name('submitPayment')->middleware('isVerified');
        Route::get('/{order}/success', [OrderController::class, 'success'])->name('success');
    });

    // Verifikasi KTP Klien
    Route::prefix('verification')->name('verification.')->group(function () {
        Route::get('/create', [UserVerificationController::class, 'create'])->name('create');
        Route::post('/', [UserVerificationController::class, 'store'])->name('store');
        Route::get('/pending', [UserVerificationController::class, 'pending'])->name('pending');
        Route::get('/check-status', [UserVerificationController::class, 'checkStatus'])->name('check_status');
    });
});


// --- RUTE KHUSUS ADMIN ---
Route::middleware(['auth', 'verified', 'isAdmin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        // [PERBAIKAN] Manajemen User sekarang diarahkan ke UserManagementController
        Route::get('users', [UserManagementController::class, 'index'])->name('users.index');
        Route::get('users/{user}/make-admin', [UserManagementController::class, 'makeAdmin'])->name('users.makeAdmin');
        Route::get('users/{user}/remove-admin', [UserManagementController::class, 'removeAdmin'])->name('users.removeAdmin');

        // Verifikasi KTP User (Tetap di controller yang sama)
        Route::get('verifications', [UserManagementController::class, 'verificationIndex'])->name('verification.index');
        Route::get('verifications/{userVerification}', [UserManagementController::class, 'verificationShow'])->name('verification.show');
        Route::post('verifications/{userVerification}/approve', [UserManagementController::class, 'verificationApprove'])->name('verification.approve');
        Route::post('verifications/{userVerification}/reject', [UserManagementController::class, 'verificationReject'])->name('verification.reject');

        // Resources (CRUD)
        Route::resource('services', ServiceController::class);
        Route::resource('moving-packages', MovingPackageController::class);
        Route::resource('branches', BranchController::class);

        // Manajemen Pesanan
        Route::prefix('orders')->name('orders.')->group(function () {
            Route::get('/', [OrderManagementController::class, 'index'])->name('index');
            Route::get('/{order}', [OrderManagementController::class, 'show'])->name('show');
            Route::post('/{order}/approve', [OrderManagementController::class, 'approvePayment'])->name('approve');
            Route::post('/{order}/reject', [OrderManagementController::class, 'rejectPayment'])->name('reject');
            Route::post('/{order}/complete', [OrderManagementController::class, 'completeOrder'])->name('complete');
            Route::post('/{order}/assign-courier', [OrderManagementController::class, 'assignCourier'])->name('assignCourier');
        });

        // Manajemen Pindahan
        Route::prefix('pindahan')->name('pindahan.')->group(function () {
            Route::get('/', [PindahanManagementController::class, 'index'])->name('index');
            Route::get('/{order}', [PindahanManagementController::class, 'show'])->name('show');
            Route::post('/{order}/approve', [PindahanManagementController::class, 'approvePayment'])->name('approve');
            Route::post('/{order}/reject', [PindahanManagementController::class, 'rejectPayment'])->name('reject');
            Route::post('/{order}/assign-courier', [PindahanManagementController::class, 'assignCourier'])->name('assignCourier');
            Route::post('/{order}/complete', [PindahanManagementController::class, 'completeOrder'])->name('complete');
            Route::get('/courier/{courier}/location', [PindahanManagementController::class, 'getCourierLocation'])->name('courier-location');
        });

        // Verifikasi Kurir
        Route::prefix('courier-verifications')
            ->name('courier_verifications.')
            ->controller(CourierVerificationController::class)
            ->group(function () {
                Route::get('/', 'index')->name('index');
                Route::get('/{verification}', 'show')->name('show');
                Route::post('/{verification}/approve', 'approve')->name('approve');
                Route::post('/{verification}/reject', 'reject')->name('reject');
            });

        // Pengaturan
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
Route::middleware(['auth', 'verified', 'courier'])
    ->prefix('courier')
    ->name('courier.')
    ->group(function () {
        Route::get('/verification/pending', [CourierAuthController::class, 'pending'])->name('verification.pending');
        Route::get('/dashboard', [CourierDashboardController::class, 'index'])->name('dashboard');
        Route::post('/toggle-status', [CourierDashboardController::class, 'toggleStatus'])->name('toggle-status');
        Route::get('/tasks/{id}', [CourierTaskController::class, 'show'])->name('tasks.show');
        Route::post('/tasks/{id}/update-status', [CourierTaskController::class, 'updateStatus'])->name('tasks.updateStatus');
        Route::post('/tasks/{id}/tracking', [CourierTaskController::class, 'addTrackingNote'])->name('tasks.addTracking');
        Route::post('/location/update', [CourierTaskController::class, 'updateLocation'])->name('updateLocation');
    });


require __DIR__ . '/auth.php';
