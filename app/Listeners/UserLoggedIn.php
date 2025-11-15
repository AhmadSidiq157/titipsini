<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Models\User; // <-- Pastikan ini di-import

class UserLoggedIn
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(Login $event): void
    {
        // Cek dulu apakah $event->user ada
        if ($event->user) {
            /** @var \App\Models\User $user */
            $user = $event->user;

            // Cek apakah user yang login adalah seorang Kurir
            if ($user->isCourier()) {
                // Set status mereka ke 'available' (Tersedia)
                $user->update([
                    'courier_status' => 'available'
                ]);
            }
        }
    }
}
