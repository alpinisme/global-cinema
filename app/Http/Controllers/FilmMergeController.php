<?php

namespace App\Http\Controllers;

use App\Film;
use App\Http\Requests\FilmMergeRequest;
use App\Screening;

class FilmMergeController extends Controller
{
    public function update(FilmMergeRequest $request)
    {
        $input = $request->validated();
        $from = $input['from'];
        $to = $input['to'];

        Screening::query()->where('film_id', $from)->update(['film_id' => $to]);
        Film::query()->where('id', $from)->delete();

        return response('', 204);
    }
}
