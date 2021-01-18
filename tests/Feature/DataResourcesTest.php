<?php

namespace Tests\Feature;

use App\Film;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class DataResourcesTest extends TestCase
{
    use WithFaker;
    use RefreshDatabase;

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
            ->assertRedirect('/films');
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
            ->assertRedirect('/films/' . $film->id);
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
            ->assertRedirect('/films');
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
    public function an_admin_can_see_a_theater()
    {
        $theater = factory('App\Theater')->raw();
        $this->actingAs(factory('App\User')->state('admin')->make())
            ->post('/theaters', $theater)
            ->assertRedirect('/theaters');
        $this->assertDatabaseHas('theaters', $theater);
    }

    /** @test */
    // public function a_user_can_view_screenings_list()
    // {
    //     $screening = factory('App\Screening')->create();
    //     $attributes = $screening->toArray();
    //     $this->actingAs(factory('App\User')->state('admin')->make())
    //         ->get('/screenings')
    //         ->assertSee($attributes['date'], $attributes['theater_id']);
    // }

    /** @test */
    public function a_json_request_to_films_returns_json()
    {
        factory('App\Theater', 10);
        $this->actingAs(factory('App\User')->state('admin')->make())
            ->json('GET', 'films')->assertOk()
            ->assertJsonFragment(Film::all()->toArray());
    }
}
