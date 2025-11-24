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

        // [UPDATE PENTING] Tambahkan 'trackings' di dalam with()
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

        $couriers = User::whereHas('roles', function ($query) {
            $query->where('name', 'kurir');
        })->select('id', 'name', 'courier_status')->get();

        return Inertia::render('Admin/Pindahan/Index', [
            'orders' => $orders,
            'couriers' => $couriers,
            'filters' => $request->only(['search', 'status']),
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
        // Hapus file fisik (opsional, aktifkan jika ingin hemat storage)
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
        // 1. Pastikan order sudah dibayar/processing atau sedang dalam proses penjemputan
        // (Kita izinkan ganti kurir meski status sudah ready_for_pickup)
        if (!in_array($order->status, ['processing', 'ready_for_pickup', 'picked_up', 'on_delivery'])) {
            return Redirect::back()->with('error', 'Status pesanan tidak valid untuk penugasan kurir.');
        }

        // 2. Ambil daftar ID kurir yang valid
        $courierIds = User::whereHas('roles', function ($query) {
            $query->where('name', 'kurir');
        })->pluck('id')->toArray();

        // 3. Validasi input
        $validated = $request->validate([
            'courier_id' => [
                'required',
                'integer',
                Rule::in($courierIds),
            ],
        ], [
            'courier_id.in' => 'User yang dipilih bukan seorang kurir atau tidak valid.'
        ]);

        // 4. Update order
        $order->update([
            'courier_id' => $validated['courier_id'],
            // Jika status masih processing, ubah jadi ready_for_pickup. 
            // Jika sudah on_delivery, biarkan saja (hanya ganti orangnya).
            'status' => $order->status === 'processing' ? 'ready_for_pickup' : $order->status,
        ]);

        return Redirect::back()->with('success', 'Kurir berhasil ditugaskan!');
    }

    /**
     * [BARU] API untuk Admin memantau lokasi kurir secara live
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
