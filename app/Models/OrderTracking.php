<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderTracking extends Model
{
    use HasFactory;
    protected $guarded = [];

    // Casting tanggal agar otomatis jadi Carbon object (mudah diformat)
    protected $casts = [
        'created_at' => 'datetime',
    ];
}
