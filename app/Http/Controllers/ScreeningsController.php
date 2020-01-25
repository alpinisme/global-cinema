<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Screening;

class ScreeningsController extends StandardResourceController
{
    protected $model = Screening::class;
    protected $fields = [
        'date' => 'required',
        'theater_id' => 'required',
        'film_id' => 'required'
    ];
    protected $objectName = 'screening';
    protected $tableName = 'screenings';

    public function index(Request $request)
    {
        if ($request->wantsJson()) {
            return Screening::all();
        } 
        $screening = Screening::class;
        return view('screenings/index', compact('screening'));
    }

    public function create()
    {
        $screening = Screening::class;
        return view('screenings/create', compact('screening'));
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
