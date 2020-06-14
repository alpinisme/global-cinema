<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    public function theaters()
    {
        $this->hasMany(Theater::class);
    }
}
