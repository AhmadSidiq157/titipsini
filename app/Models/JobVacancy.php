<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class JobVacancy extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'job_vacancies';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'department',
        'location',
        'salary_range',
        'type',
        'status',
        'description',
        'requirements',
    ];

    protected $appends = ['is_urgent'];

    /**
     * Interact with the job's requirements.
     *
     * @return \Illuminate\Database\Eloquent\Casts\Attribute
     */
    protected function requirements(): Attribute
    {
        return Attribute::make(
            get: fn($value) => is_string($value) ? array_map('trim', explode(',', $value)) : $value,
            set: fn($value) => is_array($value) ? implode(', ', $value) : $value,
        );
    }


    // --- TAMBAHKAN METHOD ACCESSOR DI BAWAH INI ---

    /**
     * Get the is_urgent flag for the vacancy.
     *
     * @return bool
     */
    public function getIsUrgentAttribute(): bool
    {
        return $this->status === 'Urgent Hiring';
    }
}
