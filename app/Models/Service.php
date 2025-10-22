<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $guarded = []; // Asumsikan Anda menggunakan ini atau $fillable

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    // TAMBAHKAN BLOK KODE INI
    protected $casts = [
        'features' => 'array',
    ];
}
