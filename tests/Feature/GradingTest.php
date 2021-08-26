<?php

namespace Tests\Feature;

use App\Assignment;
use App\Screening;
use App\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GradingTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function instructors_can_view_a_list_of_all_their_students_and_assignments()
    {
        $instructor = User::factory()->instructor()->create();
        $students = User::factory()->student()->count(2)->create();
        Assignment::factory()->create(['student_id' => $students[0]->id, 'instructor_id' => $instructor->id]);
        $expectedInfo = ['id' => $students[0]->id, 'name' => $students[0]->name, 'email' => $students[0]->email];
        $this->actingAs($instructor)->get('grading')
            ->assertOk()
            ->assertJsonPath('0', ['info' => $expectedInfo, 'datesCompleted' => []]);
    }

    /** @test */
    public function instructors_can_view_all_screenings_input_by_their_students()
    {
        $instructor = User::factory()->instructor()->create();
        $student = User::factory()->student()->create();
        Assignment::factory()->create(['student_id' => $student->id, 'instructor_id' => $instructor->id]);
        $screenings = Screening::factory()->count(2)->create(['created_by' => $student->id]);
        $this->actingAs($instructor)->get('grading')
            ->assertOk()
            ->assertJsonPath('0.datesCompleted', [$screenings[0]->date, $screenings[1]->date]);
    }

    /** @test */
    public function instructors_only_see_their_own_students()
    {
        $instructors = User::factory()->instructor()->count(2)->create();
        $student = User::factory()->student()->create();
        Assignment::factory()->create(['student_id' => $student->id, 'instructor_id' => $instructors[0]->id]);
        Screening::factory()->count(2)->create(['created_by' => $student->id]);
        $this->actingAs($instructors[1])->get('grading')
                ->assertOk()
                ->assertJson([]);
    }

    /** @test */
    public function students_cannot_view_grading_resources()
    {
        $this->actingAs(User::factory()->student()->make())->get('/grading')->assertForbidden();
    }
}
