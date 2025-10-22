<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMovingPackageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'features' => 'required|array',
            'features.*' => 'required|string',
            'popular' => 'boolean', // Pastikan 'popular' adalah boolean (true/false)
        ];
    }
}
