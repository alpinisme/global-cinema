<?php

namespace Database\Seeders;

use App\City;
use App\Theater;
use Illuminate\Database\Seeder;
use Faker\Generator;
use Illuminate\Container\Container;

class CitiesSeeder extends Seeder
{
    /**
     * The current Faker instance.
     *
     * @var \Faker\Generator
     */
    protected $faker;

    /**
     * Create a new seeder instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->faker = $this->withFaker();
    }

    /**
     * Get a new Faker instance.
     *
     * @return \Faker\Generator
     */
    protected function withFaker()
    {
        return Container::getInstance()->make(Generator::class);
    }

    
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = $this->faker;

        City::factory()
            ->count(10)
            ->has(
                Theater::factory()
                    ->count(10)
                    ->withScreenings()
                    ->state(function (array $attributes, City $city) use ($faker) {
                        return [
                            'city_id' => $city->id,
                            'lat' => $faker->latitude($city->lat - 0.05, $city->lat + 0.05),
                            'lng' => $faker->longitude($city->lng - 0.05, $city->lng + 0.05),
                        ];
                    })
            )
            ->create();
    }
}
