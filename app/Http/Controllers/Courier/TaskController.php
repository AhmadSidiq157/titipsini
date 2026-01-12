<?php

namespace App\Http\Controllers\Courier;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderTracking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class TaskController extends Controller
{
    /**
     * Menampilkan detail tugas (order) untuk kurir.
     */
    public function show(string $id)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Cari order dan load relasi yang dibutuhkan frontend
        // Pastikan order milik kurir yang sedang login
        $task = Order::with(['user', 'payment', 'orderable', 'trackings'])
            ->where('courier_id', $user->id)
            ->findOrFail($id);

        return Inertia::render('Courier/TaskShow', [
            'task' => $task,
        ]);
    }

    /**
     * Update status tugas (order) & Upload Bukti Foto
     */
    public function updateStatus(Request $request, string $id)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // 1. Validasi input
        // 'picked_up' dan 'delivered' adalah value yang dikirim dari TaskShow.jsx
        $validated = $request->validate([
            'status' => 'required|string|in:picked_up,delivered,cancelled', 
            'evidence_photo' => 'nullable|image|max:10240', // Max 10MB
            'note' => 'nullable|string|max:500',
        ]);

        $task = Order::where('courier_id', $user->id)->findOrFail($id);
        $oldStatus = $task->status;

        // 2. Mapping Status Frontend -> Database
        // Logic:
        // - picked_up (Kurir ambil barang) -> DB: on_delivery (Sedang diantar)
        // - delivered (Kurir sampai) -> DB: completed (Selesai)
        $dbStatus = match ($validated['status']) {
            'picked_up' => 'on_delivery',
            'delivered' => 'completed',
            'cancelled' => 'cancelled',
            default => $task->status
        };

        // 3. Handle Upload Foto Bukti
        $evidencePath = null;
        if ($request->hasFile('evidence_photo')) {
            // Simpan di folder storage/app/public/evidence
            $evidencePath = $request->file('evidence_photo')->store('evidence', 'public');
        }

        // 4. Update Status Order
        $task->update([
            'status' => $dbStatus,
        ]);

        // 5. Update Status Ketersediaan Kurir
        // Jika sedang mengantar, set status kurir jadi sibuk/on_delivery
        // Jika selesai, set status kurir jadi available lagi
        if ($dbStatus === 'on_delivery') {
            $user->update(['courier_status' => 'on_delivery']);
        } elseif ($dbStatus === 'completed' || $dbStatus === 'cancelled') {
            $user->update(['courier_status' => 'available']);
        }

        // 6. Buat Riwayat Tracking (OrderTracking)
        $desc = match($validated['status']) {
            'picked_up' => 'Barang berhasil dijemput kurir dan sedang menuju lokasi tujuan.',
            'delivered' => 'Paket telah sampai di tujuan. Pesanan selesai.',
            'cancelled' => 'Pengiriman dibatalkan oleh kurir.',
            default => 'Status diperbarui.'
        };

        if (!empty($validated['note'])) {
            $desc .= " (Catatan: " . $validated['note'] . ")";
        }

        OrderTracking::create([
            'order_id' => $task->id,
            'status' => strtoupper(str_replace('_', ' ', $dbStatus)),
            'description' => $desc,
            'evidence_photo_path' => $evidencePath, // Path foto disimpan di sini
            'created_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Status berhasil diperbarui & bukti terupload!');
    }

    /**
     * Update lokasi Real-time Kurir
     */
    public function updateLocation(Request $request)
    {
        $request->validate([
            'lat' => 'required', // Bisa numeric atau string koordinat
            'lng' => 'required',
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();

        $user->update([
            'latitude' => $request->lat,
            'longitude' => $request->lng,
        ]);
        
        return response()->json(['status' => 'ok']);
    }
    
    /**
     * Tambah Catatan Manual (Tracking Note)
     */
    public function addTrackingNote(Request $request, string $id)
    {
        $request->validate([
            'note' => 'required|string|max:255'
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();
        $task = Order::where('courier_id', $user->id)->findOrFail($id);

        OrderTracking::create([
            'order_id' => $task->id,
            'status' => 'INFO KURIR',
            'description' => $request->note,
            'created_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Catatan perjalanan ditambahkan.');
    }
}