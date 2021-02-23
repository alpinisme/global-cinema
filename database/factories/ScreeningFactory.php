<?php

namespace Database\Factories;

use App\Film;
use App\Screening;
use App\Theater;
use App\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ScreeningFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Screening::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'date' => $this->faker->date,
            'theater_id' => Theater::factory(),
            'film_id' => Film::factory(),
            'created_by' => User::factory(),
        ];
    }
}
