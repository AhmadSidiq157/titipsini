<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        // Daftarkan alias middleware di sini
        $middleware->alias([
            'isAdmin' => \App\Http\Middleware\IsAdmin::class,
            'isVerified' => \App\Http\Middleware\EnsureUserIsVerified::class,
            'courier' => \App\Http\Middleware\IsCourier::class, // <--- TAMBAHKAN BARIS INI
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
