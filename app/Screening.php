<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;

class Screening extends Model
{
    const QUICKFIELDS = [
        'date' => 'date',
        'theater' => 'theater',
        'film' => 'film',
    ];

    const ALLFIELDS = Screening::QUICKFIELDS;

    const DISPLAYNAME = 'Screenings';

    protected $guarded = [
        'id', 'created_at', 'updated_at', 'createdBy',
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
