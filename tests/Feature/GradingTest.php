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
        $instructor = factory(User::class)->states('instructor')->create();
        $students = factory(User::class, 2)->states('student')->create();
        factory(Assignment::class)->create(['student_id' => $students[0]->id, 'instructor_id' => $instructor->id]);
        $expectedInfo = ['id' => $students[0]->id, 'name' => $students[0]->name, 'email' => $students[0]->email];
        $this->actingAs($instructor)->get('grading')
            ->assertOk()
            ->assertJsonPath('data.0', ['info' => $expectedInfo, 'datesCompleted' => []]);
    }

    /** @test */
    public function instructors_can_view_all_screenings_input_by_their_students()
    {
        $instructor = factory(User::class)->states('instructor')->create();
        $student = factory(User::class)->states('student')->create();
        factory(Assignment::class)->create(['student_id' => $student->id, 'instructor_id' => $instructor->id]);
        $screenings = factory(Screening::class, 2)->create(['createdBy' => $student->id]);
        $this->actingAs($instructor)->get('grading')
            ->assertOk()
            ->assertJsonPath('data.0.datesCompleted', [$screenings[0]->date, $screenings[1]->date]);
    }

    /** @test */
    public function instructors_only_see_their_own_students()
    {
        $instructors = factory(User::class, 2)->states('instructor')->create();
        $student = factory(User::class)->states('student')->create();
        factory(Assignment::class)->create(['student_id' => $student->id, 'instructor_id' => $instructors[0]->id]);
        $screenings = factory(Screening::class, 2)->create(['createdBy' => $student->id]);
        $this->actingAs($instructors[1])->get('grading')
                ->assertOk()
                ->assertJsonPath('data', []);
    }

    /** @test */
    public function students_cannot_view_grading_resources()
    {
        $this->actingAs(factory(User::class)->states('student')->make())->get('/grading')->assertForbidden();
    }
}
