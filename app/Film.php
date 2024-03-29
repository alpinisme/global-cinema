<?php

namespace App;

use App\Http\Traits\Blameable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Film extends Model
{
    use HasFactory, Blameable;

    protected $guarded = [
        'id', 'created_at', 'updated_at',
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
        return static::where('verified', false)->limit($count)->get(['title', 'year', 'id']);
    }

    /**
     * Finds all duplicate films, returns both of each pair of duplicaated ids concatenated
     *
     */
    public static function duplicates()
    {
        return static::selectRaw('group_concat(id) ids, title, year, count(*) count')->groupBy('title', 'year')->having('count', '>', 1)->get();
    }

    /**
     * Finds all verified films with titles that contain one of the given strings
     *
     * Takes an array of strings and returns every verified film with one or more
     * of those strings in its title.
     */
    public static function verifiedLike($substrings, $maxYear = 2000) // make scoped instead of static query
    {
        return static::select('title', 'year', 'id', 'imdb')->where('year', '<=', $maxYear)->verified()->titleLike($substrings)->get();
    }

    /**
     * Scope a query to include only titles released between the given years (inclusive).
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  int $minYear
     * @param  int $miaxYear
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeBetween($query, $minYear, $maxYear)
    {
        return $query->where('year', '>=', $minYear)->where('year', '<=', $maxYear);
    }

    /**
     * Scope a query to include only titles released between the given years (inclusive).
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  int $minYear
     * @param  int $miaxYear
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeBefore($query, $maxYear)
    {
        return $query->where('year', '<=', $maxYear);
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
