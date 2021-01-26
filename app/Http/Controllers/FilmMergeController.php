<?php

namespace App\Http\Controllers;

use App\Film;
use App\Http\Requests\FilmMergeRequest;
use App\Screening;

class FilmMergeController extends Controller
{
    /**
     * Merges two films together in database, cascading the merger to `screenings` table
     *
     * @return \Illuminate\Http\Request
     */
    public function update(FilmMergeRequest $request)
    {
        $from = $request->input('from');
        $to = $request->input('to');

        Screening::query()->where('film_id', $from)->update(['film_id' => $to]);
        Film::query()->where('id', $from)->delete();

        return response('', 204);
    }
}
