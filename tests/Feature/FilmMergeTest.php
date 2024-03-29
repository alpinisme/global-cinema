<?php

namespace Tests\Feature;

use App\Film;
use App\Screening;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FilmMergeTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function merging_two_films_leaves_only_the_specified_behind()
    {
        $from = Film::factory()->create();
        $to = Film::factory()->create();
        $this->asAdmin()->patch('/merge/films/?from=' . $from->id . '&to=' . $to->id)->assertStatus(204);
        $this->assertDatabaseHas('films', ['id' => $to->id]);
        $this->assertDatabaseMissing('films', ['id' => $from->id]);
    }

    /** @test */
    public function merging_two_films_also_updates_screenings_of_old_film_to_new_film()
    {
        $from = Film::factory()->create();
        $to = Film::factory()->create();
        Screening::factory()->create(['film_id' => $from->id]);
        $this->asAdmin()->patch('/merge/films/', ['from' => $from->id, 'to' => $to->id]);
        $this->assertDatabaseHas('screenings', ['film_id' => $to->id]);
        $this->assertDatabaseMissing('screenings', ['film_id' => $from->id]);
    }

    /** @test */
    public function merging_two_films_only_updates_screenings_of_old_film()
    {
        $from = Film::factory()->create();
        $to = Film::factory()->create();
        $untouched = Film::factory()->create();
        Screening::factory()->create(['film_id' => $from->id]);
        Screening::factory()->create(['film_id' => $untouched->id]);
        $this->asAdmin()->patch('/merge/films/', ['from' => $from->id, 'to' => $to->id]);
        $this->assertDatabaseHas('screenings', ['film_id' => $untouched->id]);
    }
}
