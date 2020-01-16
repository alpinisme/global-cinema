<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Screening extends Model
{
    const QUICKFIELDS = [
        'date' => 'date',
        'theater' => 'theater',
        'film' => 'film'
    ];

    const ALLFIELDS = Screening::QUICKFIELDS;

    const DISPLAYNAME = 'Screenings';

    public function film()
    {
        return $this->belongsTo('App\Film');
    }

    public function theater()
    {
        return $this->belongsTo('App\Theater');
    }
}
