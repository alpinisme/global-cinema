<?php

namespace Tests\Feature;

use App\Film;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class FilmsTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    protected function asUser()
    {
        return $this->actingAs(factory('App\User')->make());
    }

    /** @test */
    public function an_admin_can_see_films_list()
    {
        $film = factory('App\Film')->create();
        $this->actingAs(factory('App\User')->state('admin')->make())
             ->get('/films')
             ->assertSuccessful()
             ->assertSee($film->title);
    }

    /** @test */
    public function an_admin_can_add_a_film()
    {
        $user = factory('App\User')->state('admin')->create();
        $film = factory('App\Film')->raw(['createdBy' => $user->id]);
        $this->actingAs($user)
             ->post('/films', $film)
             ->assertStatus(201)
             ->assertJson(['title' => $film['title']]);
        $this->assertDatabaseHas('films', $film);
    }

    /** @test */
    public function an_admin_can_edit_a_film()
    {
        $film = factory('App\Film')->create();
        $attributes = [
            'title' => 'Some Other Title',
            'year' => 1987,
        ];
        $this->actingAs(factory('App\User')->state('admin')->create())
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
        $film = factory('App\Film')->create();
        $this->actingAs(factory('App\User')->state('admin')->make())
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
        $this->actingAs(factory('App\User')->state('admin')->make())
             ->post('/films', $attributes)
             ->assertSessionHasErrors(['title', 'year']);
    }

    /** @test */
    public function a_json_request_to_films_returns_json()
    {
        factory('App\Theater', 10);
        $this->actingAs(factory('App\User')->state('admin')->make())
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
        factory(Film::class)->create(['title' => 'My Favorite Movie']);
        $this->asUser()->get('/films/search/my%20')->assertJsonFragment(['title' => 'My Favorite Movie']);
    }

    /** @test */
    public function title_search_results_do_not_include_nonmatches()
    {
        factory(Film::class)->create(['title' => 'My Favorite Movie']);
        $this->asUser()->get('/films/search/som')->assertJsonMissing(['title' => 'My Favorite Movie']);
    }

    /** @test */
    public function title_search_results_will_supply_missing_articles()
    {
        factory(Film::class)->create(['title' => 'The Favorite Movie']);
        factory(Film::class)->create(['title' => 'A Favorite Movie']);
        $this->asUser()->get('/films/search/fav')
                        ->assertJsonFragment(['title' => 'The Favorite Movie'])
                        ->assertJsonFragment(['title' => 'A Favorite Movie']);
    }

    /** @test */
    public function a_guest_cannot_search_films()
    {
        $this->get('/films')->assertRedirect('login');
    }

    /** @test */
    public function passing_a_year_as_query_param_will_limit_films_search_to_films_prior_to_that_year()
    {
        factory(Film::class)->create(['title' => 'The Favorite Movie', 'year' => 1988]);
        factory(Film::class)->create(['title' => 'A Favorite Movie', 'year' => 1990]);
        $this->asUser()->get('/films/search/fav?year=1989')
                        ->assertJsonFragment(['title' => 'The Favorite Movie'])
                        ->assertJsonMissing(['title' => 'A Favorite Movie']);
    }

    /** @test */
    public function search_term_must_be_at_least_three_characters_long()
    {
        $this->asUser()->get('/films/search/fa?year=1989')->assertStatus(400);
    }
}
