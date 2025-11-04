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
    | Kita tidak akan menggunakan 'only' atau 'except' global lagi.
    | Kita akan membaginya ke dalam 'groups'.
    |
    */
    'only' => null,
    'except' => [
        // Tetap kecualikan ini secara global
        '_ignition.*',
        'sanctum.*',
    ],

    /*
    |--------------------------------------------------------------------------
    | Grup Route
    |--------------------------------------------------------------------------
    |
    | Definisikan grup route yang akan kita panggil secara terpisah.
    |
    */
    'groups' => [
        // Grup 'admin' akan berisi SEMUA rute yang
        // berawalan 'admin.'
        'admin' => ['admin.*'],

        // Grup 'public' akan berisi SEMUA rute
        // KECUALI (tanda !) yang berawalan 'admin.'
        'public' => ['!admin.*'],
    ],
];
