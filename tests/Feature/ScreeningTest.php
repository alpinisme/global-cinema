<?php

namespace Tests\Feature;

use App\Screening;
use Tests\TestCase;
use App\User;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ScreeningTest extends TestCase
{
    use WithFaker;
    use RefreshDatabase;

    /** @test */
    public function an_admin_can_delete_a_screening()
    {
        $screening = Screening::factory()->create();
        $this->actingAs(User::factory()->admin()->make())
            ->delete('/screenings/' . $screening->id)
            ->assertStatus(204);
        $this->assertDatabaseMissing('screenings', ['id' => $screening->id]);
    }

    /** @test */
    public function only_authenticated_users_can_add_a_screening()
    {
        $screening = Screening::factory()->raw();
        $this->post('/screenings', $screening)->assertRedirect('login');
    }

    /** @test */
    public function a_student_can_add_a_screening()
    {
        $student = User::factory()->student()->create();
        $screening = Screening::factory()->raw(['created_by' => $student->id]);
        $this->actingAs($student)->post('/screenings', $screening)->assertStatus(201);
        $this->assertDatabaseHas('screenings', $screening);
    }

    // TODO: the following tests are a bit sloppy and they test the wrong endpoint anyway
    // They should hit screenings/{date} not screenings/

    /** @test */
    public function a_student_can_only_access_their_own_screenings()
    {
        $notOwnScreening = Screening::factory()->create();
        $student = User::factory()->student()->create();
        $ownScreening = Screening::factory()->create(['created_by' => $student->id]);

        $this->actingAs($student)->get('/screenings')
            ->assertJsonMissing([['film_id' => $notOwnScreening->film->id]])
            ->assertJson([['film_id' => $ownScreening->film->id]]);
    }

    /** @test */
    public function an_admin_can_access_all_screenings()
    {
        $notOwnScreening = Screening::factory()->create();
        $student = User::factory()->admin()->create();
        $ownScreening = Screening::factory()->create(['created_by' => $student->id]);
        $this->actingAs($student)->get('/screenings')
            ->assertSee($notOwnScreening->film->id)
            ->assertSee($ownScreening->film->id);
    }
}
