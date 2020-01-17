<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class RelationshipsTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function instructors_and_students_are_connected_via_assignments()
    {
        $instructor = factory('App\User')->create();
        $student = factory('App\User')->create();
        $assignment = factory('App\Assignment')->create([
            'instructor_id' => $instructor->id,
            'student_id' => $student->id
        ]);

        $this->assertTrue($assignment->assignedTo->is($student));
        $this->assertTrue($assignment->assignedBy->is($instructor));
        $this->assertTrue($instructor->students[0]->is($student));
        $this->assertTrue($instructor->assignments[0]->is($assignment));
        $this->assertTrue($student->assignment->is($assignment));
        $this->assertTrue($student->instructor->is($instructor));
    }

    /** @test */
    public function a_screening_belongs_to_a_theater_and_a_film()
    {
        $theater = factory('App\Theater')->create();
        $film = factory('App\Film')->create();
        $attributes = [
            'date' => '1999-10-10',
            'theater_id' => $theater->id,
            'film_id' => $film->id,
        ];
        $screening = factory('App\Screening')->create($attributes);
        $this->assertEquals($screening->theater->id, $theater->id);
        $this->assertEquals($screening->film->id, $film->id);
    }

    /** @test */
    public function a_theater_has_many_screenings()
    {
        $theater = factory('App\Theater')->create();
        $film = factory('App\Film')->create();
        $attributes = [
            'date' => '1999-10-10',
            'theater_id' => $theater->id,
            'film_id' => $film->id,
        ];
        $screening = factory('App\Screening')->create($attributes);
        $this->assertEquals($screening->id, $theater->screenings[0]->id);
    }

    /** @test */
    public function a_film_has_many_screenings()
    {
        $theater = factory('App\Theater')->create();
        $film = factory('App\Film')->create();
        $attributes = [
            'date' => '1999-10-10',
            'theater_id' => $theater->id,
            'film_id' => $film->id,
        ];
        $screening = factory('App\Screening')->create($attributes);
        $this->assertEquals($screening->id, $film->screenings[0]->id);
    }
}
