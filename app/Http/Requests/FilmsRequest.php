<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FilmsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'title' => 'required|max:80',
            'year' => 'required|integer|between:1900,2030',
            'verified' => 'boolean',
        ];
    }
}
