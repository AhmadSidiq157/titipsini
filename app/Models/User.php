<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\UserVerification;
use App\Models\Role; 

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
        'password',
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

    /**
     * The roles that belong to the user.
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    public function verification()
    {
        return $this->hasOne(UserVerification::class);
    }

    // --- INI FUNGSI YANG HILANG (PENYEBAB ERROR) ---
    /**
     * Helper function untuk mengecek apakah user punya role 'admin'.
     */
    public function isAdmin(): bool
    {
        // Ini akan mengecek ke database apakah user ini
        // punya role dengan nama 'admin'.
        return $this->roles()->where('name', 'admin')->exists();
    }
}