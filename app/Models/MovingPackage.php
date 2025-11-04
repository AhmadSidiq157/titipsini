<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Order; // <-- TAMBAHKAN INI

class MovingPackage extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $casts = [
        'features' => 'array',
    ];

    /**
     * Dapatkan semua order untuk paket ini.
     * * TAMBAHKAN FUNGSI INI
     */
    public function orders()
    {
        return $this->morphMany(Order::class, 'orderable');
    }
}
