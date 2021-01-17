<?php

namespace App\Http\Controllers;

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
        return []; // TODO: implement
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
