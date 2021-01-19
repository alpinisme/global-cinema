<?php

namespace App\Http\Controllers;

use App\Film;
use App\Screening;
use Illuminate\Http\Request;

class FilmMergeController extends Controller
{
    // TODO Validate request input
    public function update(Request $request)
    {
        $from = $request->input('from');
        $to = $request->input('to');

        Screening::query()->where('film_id', $from)->update(['film_id' => $to]);
        Film::query()->where('id', $from)->delete();

        return response('', 204);
    }
}
