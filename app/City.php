<?php

namespace App;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    use HasFactory;

    public function theaters()
    {
        $this->hasMany(Theater::class);
    }

    public static function allWithLatestAndOldestScreenings()
    {
        $cities = City::orderBy('name')->get();

        return $cities->map(function ($city) {
            $city['latest'] = Screening::select('date')->inCity($city->id)->latest('date')->first()->date ?? null;
            $city['oldest'] = Screening::select('date')->inCity($city->id)->oldest('date')->first()->date ?? null;

            return $city;
        });
    }
}
