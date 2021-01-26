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
    /** @var StringHelper */
    protected $stringHelper;

    public function __construct(StringHelper $stringHelper)
    {
        $this->stringHelper = $stringHelper;
    }

    /**
     * Returns all unverified items in specified category and possible duplicates among already verified
     *
     * @param string $category
     */
    public function __invoke($category)
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

    /**
     * Returns collection of all users that are unverified
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    protected function unverifiedUsers()
    {
        return User::needsReview();
    }

    /**
     * Returns collection of unverified films, each bundled with possible duplicates among verified films
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    protected function unverifiedFilms()
    {
        $unverified = Film::needsReview();

        // unlike with theaters, which are relatively few in number, this query can be quite slow
        // so it should not be relied on for frequent or public-facing queries, but since it is only
        // used by admins at the moment, and rarely at that, it is acceptable for the needs

        return $unverified->map(function ($film) {
            $substrings = $this->stringHelper->substrings($film->title);
            $fuzzy = new FuzzySearch($film, Film::verifiedLike($substrings));

            return [
                'current' => $film,
                'alternates' => $fuzzy->sort('title')->threshold(0.3)->take(5),
            ];
        });
    }

    /**
     * Returns collection of unverified theaters, each bundled with possible duplicates among verified theaters
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
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
