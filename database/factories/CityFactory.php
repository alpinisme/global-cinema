<?php

namespace Database\Factories;

use App\City;
use Illuminate\Database\Eloquent\Factories\Factory;

class CityFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = City::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name(),
            'country' => $this->faker->name(),
            'lat' => $this->faker->latitude,
            'lng' => $this->faker->longitude,
            'zoom' => 6,
        ];
    }
}
