<?php

namespace App\Http\Controllers\Courier;

use App\Http\Controllers\Controller;
use App\Models\Order; // <-- Import Order
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // <-- Import Auth
use Inertia\Inertia; // <-- Import Inertia

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
            // [PERBAIKAN] Ubah 'client' menjadi 'user'
            ->with(['user', 'payment', 'orderable']) // Ambil semua relasi yg relevan
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

        // 1. Validasi input
        $validated = $request->validate([
            // Pastikan semua status yang bisa dipilih kurir ada di sini
            'status' => 'required|string|in:ready_for_pickup,picked_up,on_delivery,delivered,completed,cancelled',
        ]);

        $newStatusTugas = $validated['status'];

        // 2. Cari order milik kurir ini
        $task = $user->courierTasks()->findOrFail($id);

        // 3. Update status TUGAS
        $task->update([
            'status' => $newStatusTugas,
        ]);

        // --- [LOGIKA OTOMATISASI STATUS KURIR] ---

        // Tentukan status kurir baru berdasarkan status tugas
        $newCourierStatus = 'available'; // Default: Tersedia

        if (in_array($newStatusTugas, ['picked_up', 'on_delivery'])) {
            // Jika kurir sedang mengambil atau mengantar
            $newCourierStatus = 'on_delivery';
        }
        // Jika statusnya 'completed', 'delivered', 'cancelled', atau 'ready_for_pickup',
        // status kurir akan di-set ke 'available' (default).

        // 4. Update status KURIR
        $user->update([
            'courier_status' => $newCourierStatus
        ]);
        // --- Akhir Modifikasi ---

        return redirect()->route('courier.tasks.show', $task->id)
            ->with('success', 'Status tugas berhasil diperbarui.');
    }
}
