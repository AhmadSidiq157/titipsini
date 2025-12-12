<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany; // Import tipe return

class MovingPackage extends Model
{
    use HasFactory;

    /**
     * Kolom yang tidak boleh diisi secara massal.
     * Kosong [] berarti semua kolom (name, price, max_distance, dll) BOLEH diisi.
     */
    protected $guarded = [];

    /**
     * Konversi tipe data otomatis saat diambil dari database.
     */
    protected $casts = [
        'features' => 'array',       // JSON ke Array
        'price' => 'integer',        // Harga Dasar
        'price_per_km' => 'integer', // [PENTING] Harga per KM
        'max_distance' => 'integer', // [PENTING] Batas Jarak
        'popular' => 'boolean',      // True/False
    ];

    /**
     * Relasi: Dapatkan semua order yang terkait dengan paket ini.
     * Menggunakan Polymorphic Relation.
     */
    public function orders(): MorphMany
    {
        return $this->morphMany(Order::class, 'orderable');
    }
}