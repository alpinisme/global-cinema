<?php

namespace Tests\Feature;

use App\Film;
use App\Theater;
use App\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class FilmTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    protected function asUser()
    {
        return $this->actingAs(User::factory()->make());
    }

    /** @test */
    public function an_admin_can_see_films_list()
    {
        $film = Film::factory()->create();
        $this->actingAs(User::factory()->admin()->make())
             ->get('/films')
             ->assertSuccessful()
             ->assertSee($film->title);
    }

    /** @test */
    public function an_admin_can_add_a_film()
    {
        $user = User::factory()->admin()->create();
        $film = Film::factory()->raw(['created_by' => $user->id]);
        $this->actingAs($user)
             ->post('/films', $film)
             ->assertStatus(201)
             ->assertJson(['title' => $film['title']]);
        $this->assertDatabaseHas('films', $film);
    }

    /** @test */
    public function an_admin_can_edit_a_film()
    {
        $film = Film::factory()->create();
        $attributes = [
            'title' => 'Some Other Title',
            'year' => 1987,
        ];
        $this->asAdmin()
             ->patch('/films/' . $film->id, $attributes)
             ->assertOk()
             ->assertJson(['id' => $film->id]);
        $film = Film::find($film->id);
        $this->assertEquals($film->title, $attributes['title']);
        $this->assertEquals($film->year, $attributes['year']);
    }

    /** @test */
    public function an_admin_can_delete_a_film()
    {
        $film = Film::factory()->create();
        $this->asAdmin()
             ->delete('/films/' . $film->id)
             ->assertStatus(204);
        $this->assertDatabaseMissing('films', ['id' => $film->id]);
    }

    /** @test */
    public function a_film_submission_must_be_valid()
    {
        $attributes = [
            'title' => '',
            'year' => 'a non-year',
        ];
        $this->asAdmin()
             ->post('/films', $attributes)
             ->assertSessionHasErrors(['title', 'year']);
    }

    /** @test */
    public function a_json_request_to_films_returns_json()
    {
        Theater::factory()->count(10)->create();
        $this->asAdmin()
             ->json('GET', 'films')->assertOk()
             ->assertJsonFragment(Film::all()->toArray());
    }

    /** @test */
    public function a_request_to_index_is_ok()
    {
        $this->asUser()->get('/films')->assertStatus(200);
    }

    /** @test */
    public function an_admin_can_search_films_by_title_fragment()
    {
        Film::factory()->create(['title' => 'My Favorite Movie']);
        $this->asUser()->get('/films?search_term=my%20F')->assertJsonFragment(['title' => 'My Favorite Movie']);
    }

    /** @test */
    public function title_search_results_do_not_include_nonmatches()
    {
        Film::factory()->create(['title' => 'My Favorite Movie']);
        $this->asUser()->get('/films?search_term=som')->assertJsonMissing(['title' => 'My Favorite Movie']);
    }

    /** @test */
    public function title_search_results_will_supply_missing_articles()
    {
        Film::factory()->create(['title' => 'The Favorite Movie']);
        Film::factory()->create(['title' => 'A Favorite Movie']);
        $this->asUser()->get('/films?search_term=fav')
                        ->assertJsonFragment(['title' => 'The Favorite Movie'])
                        ->assertJsonFragment(['title' => 'A Favorite Movie']);
    }

    /** @test */
    public function a_guest_cannot_search_films()
    {
        $this->getJson('/films')->assertStatus(401);
    }

    /** @test */
    public function passing_a_year_as_query_param_will_limit_films_search_to_films_prior_to_that_year()
    {
        Film::factory()->create(['title' => 'The Favorite Movie', 'year' => 1988]);
        Film::factory()->create(['title' => 'A Favorite Movie', 'year' => 1990]);
        $this->asUser()->get('/films?search_term=fav&up_to_year=1989')
                        ->assertJsonFragment(['title' => 'The Favorite Movie'])
                        ->assertJsonMissing(['title' => 'A Favorite Movie']);
    }

    /** @test */
    public function search_term_must_be_at_least_three_characters_long()
    {
        $this->asUser()->get('/films?search_term=fa&up_to_year=1989')->assertSessionHasErrors('search_term');
    }
}
