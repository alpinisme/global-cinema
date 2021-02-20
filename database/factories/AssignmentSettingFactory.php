<?php

namespace Database\Factories;

use App\AssignmentSetting;
use App\City;
use App\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AssignmentSettingFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = AssignmentSetting::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'city_id' => City::factory()->create(),
            'date' => $this->faker->date,
            'created_by' => User::factory()->create(),
        ];
    }
}
