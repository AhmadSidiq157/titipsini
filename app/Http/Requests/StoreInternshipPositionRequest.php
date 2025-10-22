<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInternshipPositionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'duration' => 'required|string|max:255',
            'slots' => 'required|integer|min:1',
            'deadline' => 'required|date',
            'requirements' => 'required|array',
            'requirements.*' => 'required|string',
        ];
    }
}
