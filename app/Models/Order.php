<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo; // <-- Pastikan ini ada
use Illuminate\Database\Eloquent\Relations\MorphTo; // <-- Pastikan ini ada
use Illuminate\Database\Eloquent\Relations\HasOne; // <-- Pastikan ini ada

class Order extends Model
{
    use HasFactory;

    protected $guarded = [];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'user_form_details' => 'array',
    ];

    /**
     * Dapatkan user (Client) yang memiliki order ini.
     * [PERUBAHAN]: Nama relasi dikembalikan ke user() agar konsisten
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Dapatkan user (Kurir) yang ditugaskan untuk order ini. (BARU)
     */
    public function courier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'courier_id');
    }

    /**
     * Dapatkan model (Service atau MovingPackage) yang dipesan.
     */
    public function orderable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Dapatkan data pembayaran manual untuk order ini.
     */
    public function payment(): HasOne
    {
        return $this->hasOne(ManualPayment::class);
    }

    /**
     * Relasi ke riwayat tracking.
     */
    public function trackings()
    {
        return $this->hasMany(OrderTracking::class)->latest();
    }
}
