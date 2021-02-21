<?php

namespace App;

use App\Http\Traits\Blameable;
use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Screening extends Model
{
    use HasFactory, Blameable;

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

    public function scopeInCity($query, $city)
    {
        return $query->whereIn(
            'theater_id',
            function ($query) use ($city) {
                $query->select('id')->from('theaters')->where('city_id', $city);
            }
        );
    }

    /**
     * Scope query to include only screenings from the month to which the specified date belongs
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $date date in Y-m-d format
     */
    public function scopeInMonth($query, $date)
    {
        $year = substr($date, 0, 4);
        $month = substr($date, 5, 2);
        $daysInMonth = cal_days_in_month(\CAL_GREGORIAN, $month, $year);

        return $query->whereBetween('date', ["$year-$month-01", "$year-$month->$daysInMonth"]);
    }

    /**
     * Find all screenings for a given city on a given date
     *
     * @param int $city id of city
     * @param string $date date in Y-m-d format
     */
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
