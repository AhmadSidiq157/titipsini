<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Tentukan apakah Ziggy harus di-cache
    |--------------------------------------------------------------------------
    */
    'cache' => false,

    /*
    |--------------------------------------------------------------------------
    | Whitelist/Blacklist Route
    |--------------------------------------------------------------------------
    |
    | Kita gunakan 'only' di level atas.
    | Ini adalah cara standar untuk Inertia.
    |
    */
    'only' => [
        // TAMBAHKAN SEMUA POLA ROUTE YANG KAMU BUTUHKAN DI FRONTEND
        'admin.*', // Ini akan menyelesaikan error 'admin.verification.index'
        // 'login', // Mungkin kamu butuh ini
        // 'register', // Mungkin kamu butuh ini
        // 'dashboard', // Jika ada route 'dashboard'
    ],

    /*
    |--------------------------------------------------------------------------
    | Pengecualian Global
    |--------------------------------------------------------------------------
    */
    'except' => [
        '_ignition.*',
        'sanctum.*',
        // 'debugbar.*', // Tambahkan ini jika pakai Debugbar
    ],

    /*
    |--------------------------------------------------------------------------
    | Grup Route
    |--------------------------------------------------------------------------
    |
    | Kita biarkan kosong saja karena kita sudah pakai 'only' di atas.
    |
    */
    'groups' => [],
];
