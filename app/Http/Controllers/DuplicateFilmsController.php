<?php

namespace App\Http\Controllers;

use App\Film;
use Illuminate\Http\Request;

class DuplicateFilmsController extends Controller
{
    public function index()
    {
        return Film::duplicates();
    }

    public function update(Request $request)
    {
        foreach ($request['delete'] as $dupeID) {
            Film::where('id', $dupeID)->delete();
        }

        return response('');
    }
}
