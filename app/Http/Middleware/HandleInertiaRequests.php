<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Setting;
use Illuminate\Support\Facades\Cache;
// use Tightenco\Ziggy\Ziggy; // <-- 1. KITA HAPUS IMPORT INI

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'settings' => Cache::rememberForever('settings', function () {
                return Setting::all()->pluck('value', 'key');
            }),
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
            ],

            'ziggy' => function () use ($request) {
                $ziggy = app('ziggy'); // <-- PASTIKAN KODE ANDA SEPERTI INI

                if ($request->is('admin/*') || $request->is('admin')) {
                    return $ziggy->group('admin');
                }
                return $ziggy->group('public');
            },
            // --- AKHIR BLOK ---
        ];
    }
}
