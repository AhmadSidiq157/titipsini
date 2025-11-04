<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ManualPayment extends Model
{
    use HasFactory;

    protected $guarded = [];

    /**
     * Dapatkan order yang memiliki pembayaran ini.
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Dapatkan user yang mengunggah pembayaran ini.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
