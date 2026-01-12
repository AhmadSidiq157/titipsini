<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Setting;
use App\Models\Branch;
use Illuminate\Support\Facades\Cache;

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
        // Ambil user yang sedang login
        $user = $request->user();

        // Load relasi user yang sering dibutuhkan
        if ($user) {
            $user->load('courierVerification', 'roles');
        }

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user,

                // [LANGKAH 2: DATA NOTIFIKASI]
                // Ini yang membuat lonceng di Header hidup (Badge Merah & List)
                'notifications' => $user ? [
                    'unread_count' => $user->unreadNotifications()->count(),
                    'latest' => $user->notifications()->latest()->limit(5)->get(),
                ] : null,
            ],

            // [CACHE] Settings Global
            'settings' => function () {
                return Cache::remember('app_settings', 60 * 60, function () {
                    return Setting::all()->pluck('value', 'key')->toArray();
                });
            },

            // [CACHE] Data Cabang
            'branches' => function () {
                return Cache::rememberForever('branches_list', function () {
                    return Branch::select('id', 'name')->get();
                });
            },

            // Flash Messages (Notifikasi Pop-up)
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
            ],

            // Ziggy Routes (Untuk Frontend)
            'ziggy' => function () use ($request) {
                return array_merge((new \Tighten\Ziggy\Ziggy)->toArray(), [
                    'location' => $request->url(),
                ]);
            },
        ]);
    }
}