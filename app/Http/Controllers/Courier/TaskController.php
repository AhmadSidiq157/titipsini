<?php

namespace App\Http\Controllers\Courier;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderTracking; // <-- [BARU] Import Model Tracking
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TaskController extends Controller
{
    /**
     * Menampilkan detail tugas (order).
     */
    public function show(string $id)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Cari order, tapi pastikan order itu milik kurir yang sedang login
        $task = $user->courierTasks()
            // [PERBAIKAN] Load relasi 'trackings' agar bisa ditampilkan di frontend
            ->with(['user', 'payment', 'orderable', 'trackings'])
            ->findOrFail($id);

        return Inertia::render('Courier/TaskShow', [
            'task' => $task,
        ]);
    }

    /**
     * Update status tugas (order) oleh kurir.
     */
    public function updateStatus(Request $request, string $id)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // 1. Validasi input (Tambahkan validasi foto bukti)
        $validated = $request->validate([
            'status' => 'required|string|in:ready_for_pickup,picked_up,on_delivery,delivered,completed,cancelled',
            'evidence_photo' => 'nullable|image|max:5120', // [BARU] Validasi Foto
            'note' => 'nullable|string|max:255',
        ]);

        $newStatusTugas = $validated['status'];
        $task = $user->courierTasks()->findOrFail($id);
        $oldStatus = $task->status;

        // [BARU] Handle Upload Foto Bukti (Disimpan di OrderTracking)
        $evidencePath = null;
        if ($request->hasFile('evidence_photo')) {
            $evidencePath = $request->file('evidence_photo')->store('courier_evidence', 'public');
        }

        // 2. Update status TUGAS
        $task->update([
            'status' => $newStatusTugas,
        ]);

        // 3. Update status KURIR (Otomatisasi)
        $newCourierStatus = 'available';
        if (in_array($newStatusTugas, ['picked_up', 'on_delivery'])) {
            $newCourierStatus = 'on_delivery';
        }
        $user->update(['courier_status' => $newCourierStatus]);

        // 4. CATAT KE TRACKING SYSTEM (Dengan Foto)
        if ($oldStatus !== $newStatusTugas) {
            OrderTracking::create([
                'order_id' => $task->id,
                'status' => str_replace('_', ' ', strtoupper($newStatusTugas)),
                'description' => $request->note ?? 'Status diperbarui oleh kurir',
                'evidence_photo_path' => $evidencePath, // [BARU] Simpan path foto
            ]);
        }

        return redirect()->back()->with('success', 'Status diperbarui.');
    }

    /**
     * [BARU] Method untuk kurir menambah catatan manual (misal: Macet, Isi Bensin, dll)
     */
    public function addTrackingNote(Request $request, string $id)
    {
        $request->validate([
            'note' => 'required|string|max:255'
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Cari order milik kurir ini (keamanan)
        $task = $user->courierTasks()->findOrFail($id);

        // Simpan catatan ke database tracking
        OrderTracking::create([
            'order_id' => $task->id,
            'status' => 'Info Kurir', // Label khusus catatan manual
            'description' => $request->note,
        ]);

        return redirect()->back()->with('success', 'Catatan perjalanan ditambahkan.');
    }

    /**
     * [BARU] Update lokasi Real-time Kurir
     */
    public function updateLocation(Request $request)
    {
        // [DEBUG] Cek apakah data masuk
        \Illuminate\Support\Facades\Log::info('Data Lokasi Masuk:', $request->all());

        $request->validate([
            'lat' => 'required|numeric',
            'lng' => 'required|numeric',
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();

        $user->update([
            'latitude' => $request->lat,
            'longitude' => $request->lng,
        ]);

        return response()->json(['message' => 'Lokasi diperbarui']);
    }
}
