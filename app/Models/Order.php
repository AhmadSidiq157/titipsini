<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany; 
use Illuminate\Database\Eloquent\Builder;

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

    // ==========================================
    // RELASI DATABASE
    // ==========================================

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

    // ==========================================
    // SCOPES (FILTER QUERY) - KHUSUS TA AGAR RAPI
    // ==========================================

    /**
     * Scope untuk mengambil order yang "Aktif" (Tidak dibatalkan/ditolak).
     * Penggunaan: Order::active()->get();
     */
    public function scopeActive(Builder $query): void
    {
        $query->whereNotIn('status', ['cancelled', 'rejected']);
    }

    /**
     * Scope khusus Layanan Pindahan.
     * Penggunaan: Order::moving()->active()->get();
     */
    public function scopeMoving(Builder $query): void
    {
        $query->where('orderable_type', MovingPackage::class);
    }

    /**
     * Scope khusus Layanan Penitipan.
     * Penggunaan: Order::service()->get();
     */
    public function scopeService(Builder $query): void
    {
        $query->where('orderable_type', Service::class);
    }

    // ==========================================
    // ACCESSORS (SHORTCUT DATA JSON)
    // ==========================================

    /**
     * Shortcut ambil Tanggal Pindahan dari JSON.
     * Cara Pakai: $order->moving_date
     */
    public function getMovingDateAttribute()
    {
        return $this->user_form_details['tanggal_pindahan'] ?? null;
    }

    /**
     * Shortcut ambil Jarak (KM) dari JSON.
     * Cara Pakai: $order->distance_km
     */
    public function getDistanceKmAttribute()
    {
        return $this->user_form_details['distance_km'] ?? 0;
    }

    /**
     * Shortcut ambil Alamat Jemput dari JSON.
     * Cara Pakai: $order->pickup_address
     */
    public function getPickupAddressAttribute()
    {
        return $this->user_form_details['alamat_penjemputan'] ?? '-';
    }

    /**
     * Shortcut ambil Alamat Tujuan dari JSON.
     * Cara Pakai: $order->destination_address
     */
    public function getDestinationAddressAttribute()
    {
        return $this->user_form_details['alamat_tujuan'] ?? '-';
    }
}