<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Setting;
use App\Models\Branch; // [BARU DITAMBAHKAN] Import Model Branch
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
            $user->load('courierVerification', 'roles');
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
            // Data Settings (Sudah ada sebelumnya)
            'settings' => Cache::rememberForever('settings', function () {
                return Setting::all()->pluck('value', 'key');
            }),

            // [BARU DITAMBAHKAN] Data Branches untuk Dropdown Global
            // Kita cache juga agar tidak query database setiap pindah halaman
            'branches' => Cache::rememberForever('branches_list', function () {
                // Ambil ID dan Nama saja untuk menghemat bandwidth
                return Branch::select('id', 'name')->get();
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
