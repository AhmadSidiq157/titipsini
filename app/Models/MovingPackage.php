<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MovingPackage extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $casts = [
        'features' => 'array', // <-- TAMBAHKAN INI
    ];
}
