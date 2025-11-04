<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
     * Dapatkan user yang memiliki order ini.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Dapatkan model (Service atau MovingPackage) yang dipesan.
     */
    public function orderable()
    {
        return $this->morphTo();
    }

    /**
     * Dapatkan data pembayaran manual untuk order ini.
     */
    public function payment()
    {
        return $this->hasOne(ManualPayment::class);
    }
}
