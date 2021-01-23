<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ScreeningsTest extends TestCase
{
    use WithFaker;
    use RefreshDatabase;

    /** @test */
    public function an_admin_can_delete_a_screening()
    {
        $this->withoutExceptionHandling();
        $screening = factory('App\Screening')->create();
        $this->actingAs(factory('App\User')->state('admin')->make())
            ->delete('/screenings/' . $screening->id)
            ->assertStatus(204);
        $this->assertDatabaseMissing('screenings', ['id' => $screening->id]);
    }

    /** @test */
    public function only_authenticated_users_can_add_a_screening()
    {
        $screening = factory('App\Screening')->raw();
        $this->post('/screenings', $screening)->assertRedirect('login');
    }

    /** @test */
    public function a_student_can_add_a_screening()
    {
        $student = factory('App\User')->state('student')->create();
        $screening = factory('App\Screening')->raw(['createdBy' => $student->id]);
        $this->actingAs($student)->post('/screenings', $screening)->assertStatus(201);
        $this->assertDatabaseHas('screenings', $screening);
    }

    // TODO: the following tests are a bit sloppy and they test the wrong endpoint anyway
    // They should hit screenings/{date} not screenings/

    /** @test */
    public function a_student_can_only_access_their_own_screenings()
    {
        $notOwnScreening = factory('App\Screening')->create();
        $student = factory('App\User')->state('student')->create();
        $ownScreening = factory('App\Screening')->create(['createdBy' => $student->id]);

        $this->actingAs($student)->get('/screenings')
            ->assertJsonMissing([['film_id' => $notOwnScreening->film->id]])
            ->assertJson([['film_id' => $ownScreening->film->id]]);
    }

    /** @test */
    public function an_admin_can_access_all_screenings()
    {
        $notOwnScreening = factory('App\Screening')->create();
        $student = factory('App\User')->state('admin')->create();
        $ownScreening = factory('App\Screening')->create(['createdBy' => $student->id]);
        $this->actingAs($student)->get('/screenings')
            ->assertSee($notOwnScreening->film->id)
            ->assertSee($ownScreening->film->id);
    }
}
