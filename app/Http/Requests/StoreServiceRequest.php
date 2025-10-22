<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Izinkan semua admin untuk membuat request ini
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'illustration' => 'required|string', // Nanti bisa kita ubah jadi 'image' jika ingin upload file
            'features' => 'required|array',
            'features.*' => 'required|string', // Validasi setiap item di dalam array features
        ];
    }
}
