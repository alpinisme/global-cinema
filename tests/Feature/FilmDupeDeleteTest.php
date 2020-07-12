<?php

namespace Tests\Feature;

use App\Film;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

// For the purposes of this application, "duplicate" films are defined as films that share both title and year

class FilmDupeDeleteTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    protected function asAdmin()
    {
        return $this->actingAs(factory('App\User')->state('admin')->make());
    }

    /** @test */
    public function an_admin_can_access_film_duplicate_page()
    {
        $this->asAdmin()->get('/dupes')->assertStatus(200);
    }

    /** @test */
    public function dupes_index_returns_duplicates_when_they_exist()
    {
        factory(Film::class, 2)->create(['title' => 'Some Title', 'year' => 1980]);

        $this->asAdmin()->get('/dupes')->assertJsonFragment(['title' => 'Some Title', 'year' => '1980']);
    }

    /** @test */
    public function dupes_index_does_not_return_unique_entries()
    {
        factory(Film::class, 2)->create(['title' => 'Some Title', 'year' => 1980]);
        factory(Film::class)->create(['title' => 'A Special Title', 'year' => 1980]);
        factory(Film::class)->create(['title' => 'A Special Title', 'year' => 1981]);

        $this->asAdmin()->get('/dupes')->assertJsonMissing(['title' => 'A Special Title']);
    }

    /** @test */
    public function an_admin_can_delete_a_batch_of_duplicates_with_a_patch_request()
    {
        $dupes = factory(Film::class, 2)->create(['title' => 'Some Title', 'year' => 1980]);
        $otherDupes = factory(Film::class, 2)->create(['title' => 'A Special Title', 'year' => 1980]);
        factory(Film::class)->create(['title' => 'A Special Title', 'year' => 1981]);

        $first = strval($dupes[0]->id);
        $second = strval($otherDupes[0]->id);

        $this->assertDatabaseHas('films', ['id' => $first]);
        $this->assertDatabaseHas('films', ['id' => $second]);
        $this->asAdmin()->patch('/dupes', ['delete' => [$dupes[0]->id, $otherDupes[0]->id]])->assertStatus(200);
        $this->assertDatabaseMissing('films', ['id' => $first]);
        $this->assertDatabaseMissing('films', ['id' => $second]);
    }

    /** @test */
    public function a_patch_request_does_not_delete_films_not_identified_in_the_request_body()
    {
        $dupes = factory(Film::class, 2)->create(['title' => 'Some Title', 'year' => 1980]);
        $otherDupes = factory(Film::class, 2)->create(['title' => 'A Special Title', 'year' => 1980]);
        factory(Film::class)->create(['title' => 'A Special Title', 'year' => 1981]);

        $this->asAdmin()->patch('/dupes', ['delete' => [$dupes[0]->id]])->assertStatus(200);
        $this->assertDatabaseHas('films', ['id' => strval($otherDupes[0]->id)]);
    }
}
