<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use App\Film;
use Faker\Generator as Faker;

$factory->define(Film::class, function (Faker $faker) {
    return [
        'title' => $faker->name(),
        'year' => $faker->year(),
        'createdBy' => factory('App\User')->create()->id,
    ];
});
