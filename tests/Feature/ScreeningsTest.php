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
        $screening = factory('App\Screening')->create();
        $this->actingAs(factory('App\User')->state('admin')->make())
            ->delete('/screenings/' . $screening->id)
            ->assertRedirect('/screenings');
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
        $screening = factory('App\Screening')->create();
        $attributes = $screening->toArray();
        $this->actingAs(factory('App\User')->state('student')->create())
            ->post('/screenings', $attributes)
            ->assertRedirect('/screenings');
        $this->assertDatabaseHas('screenings', $attributes);
    }

    /** @test */
    public function a_student_can_only_access_their_own_screenings()
    {
        $notOwnScreening = factory('App\Screening')->create();
        $student = factory('App\User')->state('student')->create();
        $ownScreening = factory('App\Screening')->create(['createdBy' => $student->id]);

        // $this->actingAs($student)->json('GET', '/screenings')
        //     //->assertJsonMissing($notOwnScreening->toArray())
        //     ->assertJson($ownScreening->toArray());
        $this->actingAs($student)->get('/screenings')
            ->assertDontSee($notOwnScreening->film->title)
            ->assertSee($ownScreening->film->title);
    }

    /** @test */
    public function an_admin_can_access_all_screenings()
    {
        $notOwnScreening = factory('App\Screening')->create();
        $student = factory('App\User')->state('admin')->create();
        $ownScreening = factory('App\Screening')->create(['createdBy' => $student->id]);
        $this->actingAs($student)->get('/screenings')
            ->assertSee($notOwnScreening->film->title)
            ->assertSee($ownScreening->film->title);
    }
}