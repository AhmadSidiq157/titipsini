<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderTracking extends Model
{
    use HasFactory;

    // Izinkan semua kolom diisi secara massal (Mass Assignment)
    // Ini penting agar 'evidence_photo_path', 'status', 'description' bisa disimpan via create()
    protected $guarded = [];

    // Casting tanggal agar otomatis jadi Carbon object (mudah diformat di Frontend/Backend)
    protected $casts = [
        'created_at' => 'datetime',
    ];

    /**
     * Relasi ke model Order (Inverse One-to-Many)
     * Memudahkan jika nanti butuh akses: $tracking->order->id
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
