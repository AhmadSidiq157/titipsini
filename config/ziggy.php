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
    | [PERBAIKAN] Kita kosongkan 'only'.
    | Mengosongkan 'only' berarti Ziggy akan menyertakan SEMUA rute
    | secara default, yang jauh lebih aman untuk proyek Anda.
    |
    */
    'only' => [
        // DIBIARKAN KOSONG
    ],

    /*
    |--------------------------------------------------------------------------
    | Pengecualian Global
    |--------------------------------------------------------------------------
    |
    | [PERBAIKAN] Ini adalah cara yang benar.
    | Kita hanya mengecualikan rute-rute debug/sensitif.
    |
    */
    'except' => [
        '_ignition.*',
        'sanctum.*',
        // 'debugbar.*', // Tambahkan ini jika Anda menggunakan Debugbar
    ],

    /*
    |--------------------------------------------------------------------------
    | Grup Route
    |--------------------------------------------------------------------------
    */
    'groups' => [],
];
