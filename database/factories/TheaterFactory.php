<?php

namespace Database\Factories;

use App\City;
use App\Theater;
use Illuminate\Database\Eloquent\Factories\Factory;

class TheaterFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Theater::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name(),
            'neighborhood' => $this->faker->word(),
            'capacity' => $this->faker->numberBetween(1, 1000),
            'open_year' => $this->faker->year(),
            'close_year' => $this->faker->year(),
            'city_id' => City::factory()->create()->id,
            'lat' => 90.000123,
            'lng' => 93.759213,
            'verified' => $this->faker->boolean(),
            'address' => $this->faker->address(),
        ];
    }
}
