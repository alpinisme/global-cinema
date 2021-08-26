<?php

namespace Database\Seeders;

use App\Film;
use Illuminate\Database\Seeder;

class FilmSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $titles = ['Some Title', 'Another Title', 'Example'];
        foreach ($titles as $title) {
            Film::factory()->create(['title' => $title, 'verified' => true]);
        }
    }
}
