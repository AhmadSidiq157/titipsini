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
        /** @var \App\Models\User $user */ // <--- TAMBAHKAN BARIS INI
        $user = Auth::user();

        // Validasi input
        $request->validate([
            'status' => 'required|string|in:picked_up,on_delivery,delivered,completed,cancelled',
        ]);

        // Cari order milik kurir ini
        $task = $user->courierTasks()->findOrFail($id);

        // Update status
        $task->update([
            'status' => $request->status,
        ]);

        return redirect()->route('courier.tasks.show', $task->id)
            ->with('success', 'Status tugas berhasil diperbarui.');
    }
}
