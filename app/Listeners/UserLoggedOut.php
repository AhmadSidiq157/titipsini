<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Logout;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
// [CATATAN] Kita tidak perlu import User di sini karena $event->user sudah ada

class UserLoggedOut
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
    public function handle(Logout $event): void
    {
        /** @var \App\Models\User $user */
        $user = $event->user;

        // Cek apakah user-nya ada (bisa jadi 'null' jika sesi-nya aneh)
        // dan cek apakah dia seorang Kurir
        if ($user && $user->isCourier()) {
            // Set status mereka ke 'offline'
            $user->update([
                'courier_status' => 'offline'
            ]);
        }
    }
}
