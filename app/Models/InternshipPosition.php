<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class InternshipPosition extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $casts = [
        'requirements' => 'array', // <-- Otomatis konversi ke array
    ];
}
