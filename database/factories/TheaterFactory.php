<?php

namespace Database\Factories;

use App\City;
use App\Screening;
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
            'city_id' => City::factory(),
            'lat' => $this->faker->latitude(),
            'lng' => $this->faker->longitude(),
            'verified' => $this->faker->boolean(),
            'address' => $this->faker->address(),
        ];
    }

    public function inCity(City $city)
    {
        return $this->state([
            'city_id' => $city->id,
            'lat' => $this->faker->latitude($city->lat - 0.05, $city->lat + 0.05),
            'lng' => $this->faker->longitude($city->lng - 0.05, $city->lng + 0.05),
        ]);
    }
    
    public function withScreenings()
    {
        return $this->afterCreating(function (Theater $theater) {
            Screening::factory()->create(['theater_id' => $theater->id]);
        });
    }
}
