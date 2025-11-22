<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany; // [TAMBAHAN] Untuk trackings

class Order extends Model
{
    use HasFactory;

    /**
     * Kolom yang boleh diisi secara massal.
     * Menggunakan fillable lebih aman daripada guarded.
     */
    protected $fillable = [
        'user_id',
        'orderable_id',
        'orderable_type',
        'final_amount',
        'status',
        'user_form_details', // Kolom JSON penting
        'courier_id',
        // 'branch_id', // Uncomment jika kolom ini ada di tabel orders Anda
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'user_form_details' => 'array', // Otomatis ubah JSON <-> Array
        'final_amount' => 'decimal:2',
    ];

    /**
     * Dapatkan user (Client) yang memiliki order ini.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Dapatkan user (Kurir) yang ditugaskan untuk order ini.
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
    public function trackings(): HasMany
    {
        return $this->hasMany(OrderTracking::class)->latest();
    }
    
    /**
     * (Opsional) Relasi ke Cabang jika Anda memiliki kolom branch_id
     */
    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }
}