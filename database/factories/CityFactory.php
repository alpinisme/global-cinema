<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\City;
use Faker\Generator as Faker;

$factory->define(City::class, function (Faker $faker) {
    return [
        'name' => $faker->name(),
        'country' => $faker->name(),
        'lat' => $faker->latitude,
        'lng' => $faker->longitude
    ];
});
