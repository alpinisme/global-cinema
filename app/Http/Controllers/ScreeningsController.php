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
            return $this->authorizedScreenings();
        } 
        $screenings = $this->authorizedScreenings();
        return view('screenings/index', compact('screenings'));
    }

    public function create()
    {
        $screenings = $this->authorizedScreenings();
        return view('screenings/create', compact('screenings'));
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

    protected function authorizedScreenings() {
        $user = auth()->user();
        if ($user->isStudent()) {
            return $user->screenings;
        }
        if ($user->isAdmin()) {
            return Screening::all();
        }
        return 'user type not recognized';
    }
}
