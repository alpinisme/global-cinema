<?php

namespace Database\Factories;

use App\Assignment;
use App\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AssignmentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Assignment::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'date' => $this->faker->date,
            'student_id' => User::factory(),
            'instructor_id' => User::factory(),
        ];
    }
}
