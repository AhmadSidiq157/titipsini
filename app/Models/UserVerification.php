<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserVerification extends Model
{
    use HasFactory;

    protected $guarded = [];

    /**
     * Dapatkan user yang memiliki data verifikasi ini.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
