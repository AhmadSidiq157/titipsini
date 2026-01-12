<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Builder; // Import Builder untuk Scope

// Import Model Relasi
use App\Models\UserVerification;
use App\Models\CourierVerification;
use App\Models\Role;
use App\Models\Order;

// Import Class Relasi Eloquent
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class User extends Authenticatable
{
    // [PENTING] 'Notifiable' wajib ada untuk fitur notifikasi lonceng/email
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'courier_status', // Status: available, on_delivery, offline
        'latitude',       // Posisi Real-time
        'longitude',
    ];

    /**
     * The attributes that should be hidden for serialization.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
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

    /**
     * Cek apakah user punya role tertentu (contoh: $user->hasRole('admin'))
     */
    public function hasRole(string $roleName): bool
    {
        // Cek jika relasi sudah diload sebelumnya (Eager Loading)
        if ($this->relationLoaded('roles')) {
            return $this->roles->contains('name', $roleName);
        }
        // Cek langsung ke database
        return $this->roles()->where('name', $roleName)->exists();
    }

    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    public function isClient(): bool
    {
        return $this->hasRole('client'); // Sesuaikan dengan nama di DB ('client' atau 'user')
    }

    public function isCourier(): bool
    {
        return $this->hasRole('kurir'); // Sesuaikan dengan nama di DB ('kurir')
    }

    // ===================================================================
    // RELASI ORDER
    // ===================================================================

    /**
     * Order yang dibuat oleh User ini (sebagai Client).
     */
    public function clientOrders(): HasMany
    {
        return $this->hasMany(Order::class, 'user_id');
    }

    /**
     * Order yang dikerjakan oleh User ini (sebagai Kurir).
     */
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
     * Relasi ke verifikasi Kurir (SIM, KTP, Kendaraan).
     */
    public function courierVerification(): HasOne
    {
        return $this->hasOne(CourierVerification::class);
    }

    /**
     * Helper untuk mendapatkan status verifikasi kurir.
     */
    public function courierVerificationStatus(): ?string
    {
        return $this->courierVerification?->status;
    }

    /**
     * Helper untuk cek apakah kurir sudah disetujui.
     */
    public function isCourierVerified(): bool
    {
        return $this->courierVerificationStatus() === 'approved';
    }

    // ===================================================================
    // SCOPES (Shortcut Query) [BARU & PENTING]
    // ===================================================================

    /**
     * Scope untuk mengambil semua Admin.
     * Cara Pakai: User::admins()->get();
     */
    public function scopeAdmins(Builder $query): void
    {
        $query->whereHas('roles', function ($q) {
            $q->where('name', 'admin');
        });
    }

    /**
     * Scope untuk mengambil semua Kurir.
     * Cara Pakai: User::couriers()->get();
     */
    public function scopeCouriers(Builder $query): void
    {
        $query->whereHas('roles', function ($q) {
            $q->where('name', 'kurir');
        });
    }
}