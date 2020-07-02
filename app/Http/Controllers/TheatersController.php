<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Theater;

class TheatersController extends StandardResourceController
{
    protected $model = Theater::class;

    protected $fields = [
        'name' => 'required',
        'neighborhood' => 'nullable|max:80',
        'capacity' => 'nullable|integer',
        'open_year' => 'nullable|integer|between:1900,2030',
        'close_year' => 'nullable|integer|between:1900,2030',
        'city_id' => 'integer',
        'lat' => 'nullable|regex:/^[0-9]{1,2}.[0-9]{4,6}$/',
        'lng' => 'nullable|regex:/^[0-9]{1,2}.[0-9]{4,6}$/',
    ];

    protected $objectName = 'theater';

    protected $tableName = 'theaters';

    protected $orderBy = 'name';

    // public function index(Request $request)
    // {
    //     return Theater::orderBy('name')->get();
    // }

    public function show(Theater $theater)
    {
        $resource = $theater;

        return view('/stdResources/show', compact('resource'));
    }

    public function edit(Theater $theater)
    {
        $resource = $theater;

        return view('/stdResources/edit', compact('resource'));
    }
}
