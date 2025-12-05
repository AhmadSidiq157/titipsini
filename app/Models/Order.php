<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany; 

class Order extends Model
{
    use HasFactory;

    /**
     * Kolom yang boleh diisi secara massal (Mass Assignment).
     */
    protected $fillable = [
        'user_id',
        'orderable_id',
        'orderable_type',
        'final_amount',
        'status',
        'user_form_details', // Kolom JSON penting (menyimpan Alamat, Lat, Lng, Foto, dll)
        'courier_id',        // ID Kurir yang ditugaskan
        'branch_id',         // Opsional: Jika ada sistem cabang
    ];

    /**
     * Casting tipe data otomatis.
     */
    protected $casts = [
        // [PENTING] Mengubah JSON di database menjadi Array PHP/JS
        'user_form_details' => 'array', 
        'final_amount' => 'decimal:2',
    ];

    /**
     * Relasi: Dapatkan user (Client) pembuat order.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relasi: Dapatkan user (Kurir) yang ditugaskan.
     */
    public function courier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'courier_id');
    }

    /**
     * Relasi: Produk yang dipesan (Service / MovingPackage).
     */
    public function orderable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Relasi: Bukti pembayaran manual.
     */
    public function payment(): HasOne
    {
        return $this->hasOne(ManualPayment::class);
    }

    /**
     * Relasi: Riwayat tracking/status order.
     */
    public function trackings(): HasMany
    {
        return $this->hasMany(OrderTracking::class)->latest();
    }
    
    /**
     * (Opsional) Relasi ke Cabang.
     */
    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }
}