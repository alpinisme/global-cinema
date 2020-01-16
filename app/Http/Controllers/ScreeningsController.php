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

    public function index()
    {
        $screening = Screening::class;
        return view('screenings/index', compact('screening'));
    }

    public function create()
    {
        $screening = Screening::class;
        return view('screenings/create', compact('screening'));
    }
}
