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
        Screening::where('film_id', $request->from)->update(['film_id' => $request->to]);
        Film::find($request->from)->delete();

        return response('', 204);
    }
}
