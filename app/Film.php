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

    public static function duplicates()
    {
        return DB::select('select group_concat(id) ids, title, year, count(*) count from films group by title, year having count(*) > 1');
    }
}
