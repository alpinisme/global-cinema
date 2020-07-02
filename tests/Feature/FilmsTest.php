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
    public function a_request_to_index_is_ok()
    {
        $response = $this->asUser()->get('/films');

        $response->assertStatus(200);
    }

    /** @test */
    public function an_admin_can_search_films_by_title_fragment()
    {
        factory(Film::class)->create(['title' => 'My Favorite Movie']);
        $response = $this->asUser()->get('/films/search/my%20');

        $response->assertJsonFragment(['title' => 'My Favorite Movie']);
    }

    /** @test */
    public function title_search_results_do_not_include_nonmatches()
    {
        factory(Film::class)->create(['title' => 'My Favorite Movie']);
        $response = $this->asUser()->get('/films/search/som');

        $response->assertJsonMissing(['title' => 'My Favorite Movie']);
    }

    /** @test */
    public function title_search_results_will_supply_missing_articles()
    {
        factory(Film::class)->create(['title' => 'The Favorite Movie']);
        factory(Film::class)->create(['title' => 'A Favorite Movie']);
        $response = $this->asUser()->get('/films/search/fav');

        $response->assertJsonFragment(['title' => 'The Favorite Movie']);
        $response->assertJsonFragment(['title' => 'A Favorite Movie']);
    }

    /** @test */
    public function a_guest_cannot_search_films()
    {
        $response = $this->get('/films');

        $response->assertRedirect('login');
    }
}
