<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourierVerification extends Model
{
    use HasFactory;

    /**
     * Izinkan mass assignment untuk semua field,
     * kita akan melindunginya di controller.
     */
    protected $guarded = [];

    /**
     * Dapatkan data user (kurir) yang memiliki verifikasi ini.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
