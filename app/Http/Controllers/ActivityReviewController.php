<?php

namespace App\Http\Controllers;

use App\Film;
use App\Theater;
use App\User;
use DB;
use Illuminate\Http\Request;
use App\Helpers\FuzzySearch;
use App\Helpers\StringHelper;

class ActivityReviewController extends Controller
{
    public function __construct(StringHelper $stringHelper)
    {
        $this->stringHelper = $stringHelper;
    }

    /**
     * Returns all unverified items in specified category and possible duplicates among already verified
     *
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

    // unlike with theaters, which are relatively few in number, this query can be quite slow
    // so it should not be relied on for frequent or public-facing queries, but since it is only
    // used by admins at the moment, and rarely at that, it is acceptable for the needs
    protected function unverifiedFilms()
    {
        $unverified = Film::needsReview();

        return $unverified->map(function ($film) {
            $substrings = $this->stringHelper->substrings($film->title);
            $fuzzy = new FuzzySearch($film, Film::verifiedLike($substrings));

            $item['current'] = $film;
            $item['alternates'] = $fuzzy->sort('title')->threshold(0.3)->take(5);

            return $item;
        });
    }

    protected function unverifiedTheaters()
    {
        $unverified = Theater::needsReview();

        return $unverified->map(function ($theater) {
            $verified = Theater::verified($theater->city_id);
            $fuzzy = new FuzzySearch($theater, $verified);

            $item['current'] = $theater;
            $item['alternates'] = $fuzzy->sort('name')->threshold(0.5)->take(5);

            return $item;
        });
    }
}
