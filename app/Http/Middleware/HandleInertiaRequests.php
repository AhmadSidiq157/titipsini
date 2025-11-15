<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Setting;
use Illuminate\Support\Facades\Cache;
// use Tightenco\Ziggy\Ziggy; 

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
        $user = $request->user();

        // [MODIFIKASI]
        if ($user) {
            // Muat relasi verifikasi kurir DAN relasi roles
            // Ini membuat 'auth.user.roles' selalu tersedia di React
            $user->load('courierVerification', 'roles');
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user, // Kirim user object yang sudah di-load
            ],
            'settings' => Cache::rememberForever('settings', function () {
                return Setting::all()->pluck('value', 'key');
            }),
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
            ],

            'ziggy' => function () use ($request) {
                return array_merge((new \Tighten\Ziggy\Ziggy)->toArray(), [
                    'location' => $request->url(),
                ]);
            },
        ];
    }
}
