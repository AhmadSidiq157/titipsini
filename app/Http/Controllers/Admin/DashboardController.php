<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

// Import Model
use App\Models\Order;

class DashboardController extends Controller
{
    /**
     * Menampilkan Dashboard Admin dengan statistik lengkap.
     */
    public function index(Request $request): Response|RedirectResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // 1. LOGIC ADMIN
        if ($user->isAdmin()) {
            $stats = [
                'total_orders' => Order::count(),
                'revenue' => Order::where('status', 'completed')->sum('final_amount'),
                'active_orders' => Order::whereIn('status', [
                    'processing', 'ready_for_pickup', 'courier_assigned', 
                    'courier_otw_pickup', 'picked_up', 'on_delivery'
                ])->count(),
                'pending_orders' => Order::whereIn('status', [
                    'pending_verification', 'awaiting_verification'
                ])->count(),
            ];

            // Ambil data aktivitas terbaru (dummy atau real)
            $recent_activities = Order::with('user')
                ->latest()
                ->take(5)
                ->get()
                ->map(function ($order) {
                    return [
                        'type' => 'order_placed',
                        'description' => "Order #{$order->id} dibuat oleh {$order->user->name}",
                        'time' => $order->created_at->diffForHumans(),
                    ];
                });

            return Inertia::render('Admin/Dashboard', [
                'stats' => $stats,
                'recentActivities' => $recent_activities,
            ]);
        }
        
        // 2. LOGIC KURIR
        else if ($user->isCourier()) {
            // Redirect ke dashboard khusus kurir
            return redirect()->route('courier.dashboard');
        }
        
        // 3. LOGIC USER BIASA (CLIENT)
        else {
            // [FIXED] Redirect ke Halaman Utama (Home)
            // Pastikan route 'home' sudah ada di web.php (biasanya '/')
            return redirect()->route('home'); 
        }
    }
}