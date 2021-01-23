<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */
use App\User;
use Faker\Generator as Faker;
use Illuminate\Support\Str;

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| This directory should contain each of the model factory definitions for
| your application. Factories provide a convenient way to generate new
| model instances for testing / seeding your application's database.
|
*/

$factory->define(User::class, function (Faker $faker) {
    return [
        'name' => $faker->name,
        'email' => $faker->unique()->safeEmail,
        'email_verified_at' => now(),
        'role' => $faker->randomElement(User::ROLES),
        'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        'remember_token' => Str::random(10),
    ];
});

$factory->state(User::class, 'admin', [
    'role' => User::ADMIN_ROLE,
]);

$factory->state(User::class, 'student', [
    'role' => 'student',
]);

$factory->state(User::class, 'instructor', [
    'role' => 'instructor',
]);

$factory->state(User::class, 'just registered', function (Faker $faker) {
    return [
        'role' => $faker->randomElement(User::REGISTERABLE_ROLES),
    ];
});

$factory->state(User::class, 'needs verification', function (Faker $faker) {
    return [
        'role' => $faker->randomElement(['unconfirmed_instructor', 'unconfirmed_contributor']),
    ];
});

$factory->state(User::class, 'editor', function (Faker $faker) {
    return [
        'role' => $faker->randomElement(User::DATA_EDITING_ROLES),
    ];
});

$factory->state(User::class, 'data entry', function (Faker $faker) {
    return [
        'role' => $faker->randomElement(User::DATA_ENTRY_ROLES),
    ];
});
