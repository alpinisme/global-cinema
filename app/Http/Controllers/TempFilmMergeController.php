<?php

namespace App\Http\Controllers;

use App\Film;
use App\Screening;
use Illuminate\Http\Request;

class TempFilmMergeController extends Controller
{
    public function __invoke()
    {
        $unverified = Film::needsReview(500);
        $duplicates = [];

        foreach ($unverified as $film) {
            $matches = Film::where('title', $film->title)->where('year', $film->year)->whereNotNull('imdb')->get(['title', 'id', 'imdb', 'year']);

            if ($matches->count() == 1) {
                $match = $matches->first();

                $updates = Screening::query()->where('film_id', $film->id)->update(['film_id' => $match->id]);
                Film::query()->where('id', $film->id)->delete();
            } elseif ($matches->count() > 0) {
                foreach ($matches as $match) {
                    $duplicates[] = $match;
                }
            }
        }

        return $duplicates;
    }
}
