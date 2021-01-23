<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CitiesRequest extends FormRequest
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
            'name' => 'required|max:50',
            'country' => 'required|max:50',
            'lat' => 'nullable|regex:/^[0-9]{1,2}.[0-9]{4,6}$/',
            'lng' => 'nullable|regex:/^[0-9]{1,2}.[0-9]{4,6}$/',
            'zoom' => 'nullable|integer|between:1,30',
        ];
    }
}