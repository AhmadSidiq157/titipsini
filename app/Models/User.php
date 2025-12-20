<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\UserVerification; 
use App\Models\CourierVerification; 
use App\Models\Role;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'courier_status',
        'latitude',
        'longitude',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // ===================================================================
    // RELASI & FUNGSI ROLE
    // ===================================================================

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class);
    }

    public function hasRole(string $roleName): bool
    {
        if ($this->relationLoaded('roles')) {
            return $this->roles->contains('name', $roleName);
        }
        return $this->roles()->where('name', $roleName)->exists();
    }

    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    public function isClient(): bool
    {
        return $this->hasRole('client');
    }

    public function isCourier(): bool
    {
        return $this->hasRole('kurir');
    }

    // ===================================================================
    // RELASI ORDER
    // ===================================================================

    public function clientOrders(): HasMany
    {
        return $this->hasMany(Order::class, 'user_id');
    }

    public function courierTasks(): HasMany
    {
        return $this->hasMany(Order::class, 'courier_id');
    }

    // ===================================================================
    // RELASI VERIFIKASI
    // ===================================================================

    /**
     * Relasi ke verifikasi KTP (untuk Klien).
     */
    public function verification(): HasOne
    {
        return $this->hasOne(UserVerification::class);
    }

    /**
     * [BARU] Relasi ke verifikasi Kurir (SIM, KTP, Kendaraan).
     */
    public function courierVerification(): HasOne
    {
        return $this->hasOne(CourierVerification::class);
    }

    /**
     * [BARU] Helper untuk mendapatkan status verifikasi kurir.
     */
    public function courierVerificationStatus(): ?string
    {
        return $this->courierVerification?->status;
    }

    /**
     * [BARU] Helper untuk cek apakah kurir sudah disetujui.
     */
    public function isCourierVerified(): bool
    {
        return $this->courierVerificationStatus() === 'approved';
    }
}
