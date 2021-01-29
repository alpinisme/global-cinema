<?php

namespace Tests\Feature;

use App\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class TheatersTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function guests_and_unconfirmed_users_cannot_access_theaters_endpoint()
    {
        $this->getJson('/theaters')->assertStatus(401);

        // TODO: implement this
        // $roles = ['unconfirmed_contributor', 'unconfirmed_instructor'];

        // foreach ($roles as $role) {
        //     $user = factory('App\User')->make(['role' => $role]);
        //     $this->actingAs($user)->get('/theaters')->assertStatus(403);
        // }
    }

    /** @test */
    public function an_admin_can_see_a_theater()
    {
        $theater = factory('App\Theater')->raw();
        $this->actingAs(factory('App\User')->state('admin')->make())
           ->post('/theaters', $theater)
           ->assertStatus(201)
           ->assertJson(['name' => $theater['name']]);
        $this->assertDatabaseHas('theaters', $theater);
    }

    /** @test */
    public function an_admin_can_update_a_theater()
    {
        $theater = factory('App\Theater')->create();
        $this->actingAs(factory('App\User')->state('admin')->make())
             ->patch('/theaters/' . $theater->id, ['neighborhood' => 'Mister Rogers'])
             ->assertOk()
             ->assertJson(['name' => $theater->name]);
        $this->assertDatabaseHas('theaters', ['id' => $theater->id, 'neighborhood' => 'Mister Rogers']);
    }

    /** @test */
    public function an_admin_can_delete_a_theater()
    {
        $theater = factory('App\Theater')->create();
        $this->actingAs(factory('App\User')->state('admin')->make())
                 ->delete('/theaters/' . $theater->id)
                 ->assertStatus(204);
        $this->assertDatabaseMissing('theaters', ['id' => $theater->id]);
    }

    /** @test */
    public function attempting_to_update_a_nonexistent_theater_receives_405_status()
    {
        $theater = factory('App\Theater')->make();
        $this->actingAs(factory('App\User')->state('admin')->make())
                     ->patch('/theaters/' . $theater->id, ['neighborhood' => 'Mister Rogers'])
                     ->assertStatus(405);
        $this->assertDatabaseMissing('theaters', ['id' => $theater->id, 'neighborhood' => 'Mister Rogers']);
    }
}
