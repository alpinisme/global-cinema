<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Theater extends Model
{
    const DISPLAYNAME = 'Theaters';

    const QUICKFIELDS = [
        'name' => 'name',
        'neighborhood' => 'neighborhood',
    ];

    const ALLFIELDS = [
        'name' => 'name',
        'neighborhood' => 'neighborhood',
        'lat' => 'latitude',
        'lng' => 'longitude',
        'capacity' => 'capacity',
        'open_year' => 'year opened',
        'close_year' => 'year closed',
    ];

    protected $guarded = [
        'id', 'created_at', 'updated_at',
    ];

    public function screenings()
    {
        return $this->hasMany('App\Screening');
    }

    public function city()
    {
        return $this->belongsTo('App\City');
    }

    /**
     * Lists all unverified theaters that have been added to database
     */
    public static function needsReview()
    {
        return static::query()->where('verified', false)->get();
    }

    /**
     * Lists all verified theaters that have been added to database
     * @param number $city
     */
    public static function verified($city)
    {
        return static::query()->where('verified', true)->where('city_id', $city)->get();
    }
}
