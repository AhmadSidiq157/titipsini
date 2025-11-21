<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Order;

class Service extends Model
{
    use HasFactory;

    // Gunakan fillable agar lebih eksplisit dan aman
    protected $fillable = [
        'title',
        'description',
        'price',        // Wajib ada untuk controller baru
        'illustration', // Wajib ada untuk upload gambar
        'features',     // Wajib ada untuk array fitur
    ];

    protected $casts = [
        'features' => 'array',   // Konversi otomatis JSON <-> Array
        'price'    => 'integer', // Memastikan harga selalu angka
    ];

    /**
     * Dapatkan semua order untuk service ini.
     * Relasi Polymorphic ke model Order.
     */
    public function orders()
    {
        return $this->morphMany(Order::class, 'orderable');
    }
}