<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TheatersRequest extends FormRequest
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
        // make field optional when method is PATCH
        $maybe = $this->method() === 'PATCH' ? 'sometimes|' : '';

        return [
            'name' => $maybe . 'required',
            'neighborhood' => 'nullable|max:80',
            'capacity' => 'nullable|integer',
            'open_year' => 'nullable|integer|between:1900,2030',
            'close_year' => 'nullable|integer|between:1900,2030',
            'city_id' => $maybe . 'required|exists:cities,id',
            'lat' => 'nullable|regex:/^[0-9]{1,2}.[0-9]{4,6}$/',
            'lng' => 'nullable|regex:/^[0-9]{1,2}.[0-9]{4,6}$/',
            'verified' => 'nullable|boolean',
        ];
    }
}
