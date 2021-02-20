<?php

namespace App;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Theater extends Model
{
    use HasFactory;

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
        return static::where('verified', false)->get();
    }

    /**
     * Lists all verified theaters that have been added to database
     * @param int $city
     */
    public static function verified($city)
    {
        return static::where('verified', true)->where('city_id', $city)->get();
    }
}
