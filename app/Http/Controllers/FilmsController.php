<?php

namespace App\Http\Controllers;

use App\Film;
use Illuminate\Http\Request;

class FilmsController extends StandardResourceController
{

    protected $model = Film::class;
    protected $fields = [
        'title' => 'required|max:80',
        'year' => 'required|integer|between:1900,2030'
    ];
    protected $objectName = 'film';
    protected $tableName = 'films';

    public function show(Film $film)
    {
        $resource = $film;
        return view('/stdResources/show', compact('resource'));
    }

    public function edit(Film $film)
    {
        $resource = $film;
        return view('/stdResources/edit', compact('resource'));
    }

    public function json()
    {
        return Film::all();
    }

    /**
     * overwrites parent function to add createdBy field
     * via the currently authenticated user 
     * (field is not submitted in request)
     */
    protected function setObjectData()
    {
        $this->object->createdBy = auth()->id();
        parent::setObjectData();
    }
}
