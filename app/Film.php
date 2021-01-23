<?php

namespace App;

use DB;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;

class Film extends Model
{
    const QUICKFIELDS = [
        'title' => 'title',
        'year' => 'year',
    ];

    const ALLFIELDS = [
        'title' => 'title',
        'year' => 'year',
    ];

    const DISPLAYNAME = 'Films';

    protected $guarded = [
        'id', 'created_at', 'updated_at', 'createdBy',
    ];

    public function screenings()
    {
        return $this->hasMany('App\Screening');
    }

    /**
     * Finds first specified number of unverified films that have been added to database
     * @param int $count
     */
    public static function needsReview($count = 10)
    {
        return static::query()->where('verified', false)->limit($count)->get(['title', 'year', 'id']);
    }

    public static function duplicates()
    {
        return DB::select('select group_concat(id) ids, title, year, count(*) count from films group by title, year having count(*) > 1');
    }

    /**
     * Finds all verified films with titles that contain one of the given strings
     *
     * Takes an array of strings and returns every verified film with one or more
     * of those strings in its title.
     *
     * @param array $substrings
     */
    public static function verifiedLike($substrings)
    {
        return static::select('title', 'year', 'id', 'imdb')->verified()->titleLike($substrings)->get();
    }

    /**
     * Scope a query to include only titles containing one or more of the specified substrings.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string[] $substrings
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeTitleLike($query, $substrings)
    {
        return $query->where(
            function ($query) use ($substrings) {
                foreach ($substrings as $substring) {
                    $query = $query->orWhere('title', 'like', '%' . $substring . '%');
                }
            }
        );
    }

    /**
     * Scope a query to include only verified films.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeVerified($query)
    {
        return $query->where(
            function ($query) {
                $query
                        ->where('verified', true)
                        ->orWhereNotNull('imdb');
            }
        );
    }
}
