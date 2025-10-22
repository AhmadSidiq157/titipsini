<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Tentukan apakah Ziggy harus di-cache
    |--------------------------------------------------------------------------
    |
    | Menentukan apakah file route JavaScript Ziggy harus di-cache. Disarankan
    | untuk diatur ke `false` saat development dan `true` di production.
    |
    */
    'cache' => false,

    /*
    |--------------------------------------------------------------------------
    | Whitelist/Blacklist Route
    |--------------------------------------------------------------------------
    |
    | Atur filter untuk route mana yang akan dimasukkan dalam file JavaScript
    | yang dihasilkan. Anda bisa menggunakan 'only' (hanya masukkan ini) atau
    | 'except' (masukkan semua kecuali ini). Jangan gunakan keduanya bersamaan.
    |
    */
    'only' => [
        // 'home',
        // 'posts.index',
        // 'posts.show',
    ],

    'except' => [
        // 'admin.*', // <-- INI DIA MASALAHNYA
        '_ignition.*',
        'sanctum.*',
    ],

    /*
    |--------------------------------------------------------------------------
    | Grup Route
    |--------------------------------------------------------------------------
    |
    | Definisikan grup route yang bisa Anda panggil dengan nama tertentu.
    | Ini berguna jika Anda ingin memuat set route yang berbeda di halaman yang berbeda.
    |
    */
    'groups' => [
        // 'admin' => ['admin.*'],
        // 'public' => ['home', 'posts.*'],
    ],
];
