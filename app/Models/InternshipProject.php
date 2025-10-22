<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class InternshipProject extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $casts = [
        'learnings' => 'array', // <-- Otomatis konversi ke array
    ];
}
