<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use App\Assignment;
use Faker\Generator as Faker;

$factory->define(Assignment::class, function (Faker $faker) {
    return [
        'Assignment' => $faker->sentence(),
        'student_id' => factory('App\User')->create(),
        'instructor_id' => factory('App\User')->create()
    ];
});
