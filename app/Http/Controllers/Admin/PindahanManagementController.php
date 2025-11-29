<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Models\MovingPackage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Redirect;

class PindahanManagementController extends Controller
{
    /**
     * Menampilkan daftar semua pesanan PINDAHAN dengan Search & Filter.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $status = $request->input('status');

        // [MODIFIKASI PENTING] Tambahkan 'trackings' agar Admin bisa lihat riwayat & foto bukti di Modal
        $orders = Order::with(['user', 'orderable', 'payment', 'courier', 'trackings'])
            ->whereHasMorph('orderable', [MovingPackage::class])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('id', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($q) use ($search) {
                            $q->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        });
                });
            })
            ->when($status && $status !== 'all', function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        // Ambil data kurir untuk dropdown di modal
        $couriers = User::whereHas('roles', function ($query) {
            $query->where('name', 'kurir');
        })->select('id', 'name', 'courier_status')->get();

        return Inertia::render('Admin/Pindahan/Index', [
            'orders' => $orders,
            'couriers' => $couriers,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function show(Order $order)
    {
        // Validasi tipe order
        if (!$order->orderable_type || !str_contains($order->orderable_type, 'MovingPackage')) {
            abort(404);
        }

        // Load relasi lengkap
        $order->load(['user', 'orderable', 'payment', 'courier', 'trackings']);

        // Ambil data kurir untuk dropdown
        $couriers = User::whereHas('roles', function ($query) {
            $query->where('name', 'kurir');
        })->select('id', 'name', 'courier_status')->get();

        return Inertia::render('Admin/Pindahan/Show', [
            'order' => $order,
            'couriers' => $couriers,
        ]);
    }

    /**
     * Menyetujui pembayaran.
     */
    public function approvePayment(Order $order)
    {
        if (!$order->payment || $order->payment->status !== 'pending_verification') {
            return Redirect::back()->with('error', 'Pembayaran tidak ditemukan atau sudah diproses.');
        }

        $order->payment->update(['status' => 'verified']);
        $order->update(['status' => 'processing']); // Siap ditugaskan

        return Redirect::back()->with('success', 'Pembayaran berhasil diverifikasi. Order siap ditugaskan.');
    }

    /**
     * Menolak pembayaran.
     */
    public function rejectPayment(Request $request, Order $order)
    {
        if (!$order->payment) {
            return Redirect::back()->with('error', 'Pembayaran tidak ditemukan.');
        }

        $payment = $order->payment;
        // Hapus file fisik (opsional)
        // Storage::disk('public')->delete($payment->payment_proof_path);

        $payment->delete();
        $order->update(['status' => 'awaiting_payment']);

        return Redirect::back()->with('success', 'Pembayaran ditolak. User harus meng-upload ulang.');
    }

    /**
     * Menugaskan kurir ke pesanan.
     */
    public function assignCourier(Request $request, Order $order)
    {
        // Izinkan ganti kurir selama belum selesai
        if (!in_array($order->status, ['processing', 'ready_for_pickup', 'picked_up', 'on_delivery'])) {
            return Redirect::back()->with('error', 'Status pesanan tidak valid untuk penugasan kurir.');
        }

        $courierIds = User::whereHas('roles', function ($query) {
            $query->where('name', 'kurir');
        })->pluck('id')->toArray();

        $validated = $request->validate([
            'courier_id' => ['required', 'integer', Rule::in($courierIds)],
        ]);

        $order->update([
            'courier_id' => $validated['courier_id'],
            'status' => $order->status === 'processing' ? 'ready_for_pickup' : $order->status,
        ]);

        return Redirect::back()->with('success', 'Kurir berhasil ditugaskan!');
    }

    /**
     * [BARU] Method untuk Admin memfinalisasi pesanan (Selesai)
     * Digunakan setelah kurir mengantar barang (status 'delivered').
     */
    public function completeOrder(Order $order)
    {
        if ($order->status !== 'delivered') {
            return Redirect::back()->with('error', 'Pesanan belum sampai di tujuan (status belum delivered).');
        }

        $order->update(['status' => 'completed']);

        // Opsional: Set kurir jadi available lagi
        if ($order->courier) {
            $order->courier->update(['courier_status' => 'available']);
        }

        return Redirect::back()->with('success', 'Pesanan pindahan berhasil diselesaikan!');
    }

    /**
     * API untuk Admin memantau lokasi kurir secara live
     */
    public function getCourierLocation(User $courier)
    {
        if (!$courier->hasRole('kurir')) {
            return response()->json(['message' => 'Not a courier'], 404);
        }

        return response()->json([
            'lat' => $courier->latitude,
            'lng' => $courier->longitude,
            'updated_at' => $courier->updated_at ? $courier->updated_at->diffForHumans() : 'Belum ada data',
            'status' => $courier->courier_status
        ]);
    }
}
