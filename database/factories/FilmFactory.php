<?php

namespace Database\Factories;

use App\Film;
use App\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class FilmFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Film::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'title' => $this->faker->name,
            'year' => $this->faker->year,
            'created_by' => User::factory(),
            'verified' => $this->faker->boolean,
        ];
    }
}
