<?php

namespace App\Http\Controllers;

use App\Film;
use App\Helpers\FuzzySearch;
use App\Helpers\StringHelper;
use App\Screening;

class TempFilmMergeController extends Controller
{
    public function __invoke(StringHelper $stringHelper)
    {
        $duplicates = collect();
        $nonmatches = collect();
        $count = 0;

        foreach (Film::select('id', 'title', 'year')->where('verified', false)->cursor() as $film) {
            if (Screening::where('film_id', $film->id)->count() == 0) {
                $film->delete();
                $count++;

                continue;
            }

            $matches = Film::where('title', $film->title)->where('year', $film->year)->whereNotNull('imdb')->get(['title', 'id', 'imdb', 'year']);

            switch ($matches->count()) {
                case 0:
                    $substrings = $stringHelper->substrings($film->title);
                    $likeMatches = Film::verified()->titleLike($substrings)->between($film->year - 1, $film->year + 1)->get(['title', 'id']);
                    $match = (new FuzzySearch($film, $likeMatches))->sort('title')->threshold(8.5)->take(1)->first();

                    if ($match) {
                        Screening::where('film_id', $film->id)->update(['film_id' => $match->id]);
                        $film->delete();
                        $count++;

                        break;
                    }

                    $nonmatches[] = $film;

                    break;

                case 1:
                    $match = $matches->first();
                    Screening::where('film_id', $film->id)->update(['film_id' => $match->id]);
                    $film->delete();
                    $count++;

                    break;

                default:
                    $duplicates[] = $matches;
            }
        }

        return  ['count' => $count, 'nonmatches' => $nonmatches];
    }
}
