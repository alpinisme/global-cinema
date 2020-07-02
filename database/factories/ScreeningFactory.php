<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use App\Screening;
use Faker\Generator as Faker;

$factory->define(Screening::class, function (Faker $faker) {
    return [
        'date' => $faker->date,
        'theater_id' => factory('App\Theater')->create()->id,
        'film_id' => factory('App\Film')->create()->id,
        'createdBy' => factory('App\User')->create()->id,
    ];
});
