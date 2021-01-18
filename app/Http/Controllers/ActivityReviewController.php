<?php

namespace App\Http\Controllers;

use App\Film;
use App\Theater;
use App\User;
use DB;
use Illuminate\Http\Request;
use App\Helpers\FuzzySearch;

class ActivityReviewController extends Controller
{
    /**
     * Returns all unverified items in specified category
     * as well as possible matches to already verified items
     * @param string $category
     */
    public function index($category)
    {
        switch ($category) {
            case 'films':
                return $this->unverifiedFilms();
            case 'theaters':
                return $this->unverifiedTheaters();
            case 'users':
                return $this->unverifiedUsers();
            default:
                abort(404);
        }
    }

    /*  I've separated the methods so that I can also return suggestions for possible duplicates.
    The models return just the raw items themselves, then the controller here figures out if there are any possible matchs */

    protected function unverifiedUsers()
    {
        return User::needsReview();
    }

    protected function unverifiedFilms()
    {
        $result = [];
        $unverified = Film::needsReview();

        $result = $unverified->map(function ($film) {
            $item['current'] = $film;
            $search = new FuzzySearch($film, Film::similar($film));
            $item['alternates'] = $search->byKey('title')->sorted()->threshold(0.1)->take(5);

            return $item;
        });

        return $result;
    }

    protected function unverifiedTheaters()
    {
        $result = [];
        $theaters = Theater::needsReview();
        foreach ($theaters as $theater) {
            $city = $theater->city_id;
            $approvedTheaters = Theater::query()->where('city_id', $city)->where('verified', true)->get();
            $searcher = new FuzzySearch($theater, $approvedTheaters);
            $matches = $searcher->byKey('name')->sorted()->threshold(0.5)->take(5);
            $item['current'] = $theater;
            $item['alternates'] = $matches;
            $result[] = $item;
        }

        return $result;
    }
}
