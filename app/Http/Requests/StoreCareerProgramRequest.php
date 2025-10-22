<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCareerProgramRequest extends FormRequest
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
            'description' => 'required|string',
            'duration' => 'required|string|max:255',
            'benefits' => 'required|array',
            'benefits.*' => 'required|string',
            'is_popular' => 'boolean',
            'tags' => 'required|array',
            'tags.*' => 'required|string',
            'cta_text' => 'required|string|max:255',
            'cta_color' => 'required|string|max:255',
        ];
    }
}
