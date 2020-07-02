<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use App\Theater;
use Faker\Generator as Faker;

$factory->define(Theater::class, function (Faker $faker) {
    return [
        'name' => $faker->name(),
        'neighborhood' => $faker->word(),
        'capacity' => $faker->numberBetween(1, 1000),
        'open_year' => $faker->year(),
        'close_year' => $faker->year(),
        'city_id' => factory('App\City')->create()->id,
        'lat' => 90.000123,
        'lng' => 93.759213,
    ];
});
