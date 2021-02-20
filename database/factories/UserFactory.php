<?php

namespace Database\Factories;

use App\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = User::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'email_verified_at' => now(),
            'role' => $this->faker->randomElement(User::ROLES),
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the user is suspended.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function admin()
    {
        return $this->state(function (array $attributes) {
            return [
                'role' => User::ADMIN_ROLE,
            ];
        });
    }

    /**
     * Indicate that the user is suspended.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function student()
    {
        return $this->state(function (array $attributes) {
            return [
                'role' => 'student',
            ];
        });
    }

    /**
     * Indicate that the user is suspended.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function instructor()
    {
        return $this->state(function (array $attributes) {
            return [
                'role' => 'instructor',
            ];
        });
    }

    /**
     * Indicate that the user is suspended.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function justRegistered()
    {
        return $this->state(function (array $attributes) {
            return [
                'role' => $this->faker->randomElement(User::REGISTERABLE_ROLES),
            ];
        });
    }

    /**
     * Indicate that the user is suspended.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function needsVerification()
    {
        return $this->state(function (array $attributes) {
            return [
                'role' => $this->faker->randomElement(['unconfirmed_instructor', 'unconfirmed_contributor']),
            ];
        });
    }

    /**
     * Indicate that the user is suspended.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function editor()
    {
        return $this->state(function (array $attributes) {
            return [
                'role' => $this->faker->randomElement(User::DATA_EDITING_ROLES),
            ];
        });
    }

    /**
     * Indicate that the user is suspended.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function dataEnterer()
    {
        return $this->state(function (array $attributes) {
            return [
                'role' => $this->faker->randomElement(User::DATA_ENTRY_ROLES),
            ];
        });
    }
}
