<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FilmSearchRequest extends FormRequest
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
            'up_to_year' => 'sometimes|integer|between:1901,2030',
            'search_term' => 'sometimes|string|min:3',
        ];
    }
}
