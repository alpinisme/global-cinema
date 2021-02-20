<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;

class Screening extends Model
{
    protected $guarded = [
        'id', 'created_at', 'updated_at',
    ];

    public function film()
    {
        return $this->belongsTo('App\Film');
    }

    public function theater()
    {
        return $this->belongsTo('App\Theater');
    }

    public function createdBy()
    {
        return $this->belongsTo('App\User');
    }

    public function scopeCreatedBy($query)
    {
        return $query->where('screenings.created_by', auth()->id());
    }

    public function scopeJoined($query)
    {
        return $query->with(['film', 'theater']);
    }

    public function scopeDate($query, $date)
    {
        return $query->where('date', $date);
    }

    public function scopeId($query, $id)
    {
        return $query->where('id', $id);
    }

    public static function byCityAndDate($city, $date)
    {
        return static::leftJoin('theaters', 'theaters.id', 'screenings.theater_id')
                    ->leftJoin('films', 'films.id', 'screenings.film_id')
                    ->select('date', 'name', 'lat', 'lng', 'title', 'language', 'country')
                    ->where('screenings.date', $date)
                    ->where('theaters.city_id', $city)
                    ->get();
    }

    /**
     * Prepare a date for array / JSON serialization.
     *
     * @param  \DateTimeInterface  $date
     * @return string
     */
    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }
}
