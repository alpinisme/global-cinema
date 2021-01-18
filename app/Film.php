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
     * Lists all unverified films that have been added to database
     */
    public static function needsReview()
    {
        return static::query()->where('verified', false)->get();
    }

    public static function duplicates()
    {
        return DB::select('select group_concat(id) ids, title, year, count(*) count from films group by title, year having count(*) > 1');
    }

    public static function similar(Film $film)
    {
        $title = $film->title;
        $substrings = str_split($title, 3);
        $query = static::select('title', 'year', 'id');
        foreach ($substrings as $substring) {
            $query = $query->where('title', 'like', '%' . $substring . '%');
        }

        return $query->get();
    }
}
