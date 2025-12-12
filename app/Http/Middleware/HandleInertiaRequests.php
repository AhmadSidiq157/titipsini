<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Setting;
use App\Models\Branch; // Import Model Branch
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
        $user = $request->user();

        if ($user) {
            // Load relasi yang sering dibutuhkan
            $user->load('courierVerification', 'roles');
        }

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user,
            ],

            // [MODIFIKASI] Settings Global (Termasuk Data Pembayaran)
            // Menggunakan toArray() agar formatnya konsisten di JS
            // Cache 1 jam (60*60) agar perubahan di database tidak 'stuck' selamanya
            'settings' => function () {
                return Cache::remember('app_settings', 60 * 60, function () {
                    return Setting::all()->pluck('value', 'key')->toArray();
                });
            },

            // [BARU DITAMBAHKAN] Data Branches untuk Dropdown Global
            'branches' => function () {
                return Cache::rememberForever('branches_list', function () {
                    return Branch::select('id', 'name')->get();
                });
            },

            // [MODIFIKASI] Flash Messages (Success & Error)
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
            ],

            'ziggy' => function () use ($request) {
                return array_merge((new \Tighten\Ziggy\Ziggy)->toArray(), [
                    'location' => $request->url(),
                ]);
            },
        ]);
    }
}