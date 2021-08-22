<?php

namespace Tests\Unit;

use App\Assignment;
use App\City;
use App\Film;
use App\Screening;
use App\Theater;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\User;

class RelationshipsTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function instructors_and_students_are_connected_via_assignments()
    {
        $instructor = User::factory()->create();
        $student = User::factory()->create();
        $assignment = Assignment::factory()->create([
            'instructor_id' => $instructor->id,
            'student_id' => $student->id,
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
        $theater = Theater::factory()->create();
        $film = Film::factory()->create();
        $attributes = [
            'date' => '1999-10-10',
            'theater_id' => $theater->id,
            'film_id' => $film->id,
        ];
        $screening = Screening::factory()->create($attributes);
        $this->assertEquals($screening->theater->id, $theater->id);
        $this->assertEquals($screening->film->id, $film->id);
    }

    /** @test */
    public function a_theater_has_many_screenings()
    {
        $theater = Theater::factory()->create();
        $film = Film::factory()->create();
        $attributes = [
            'date' => '1999-10-10',
            'theater_id' => $theater->id,
            'film_id' => $film->id,
        ];
        $screening = Screening::factory()->create($attributes);
        $this->assertEquals($screening->id, $theater->screenings[0]->id);
    }

    /** @test */
    public function a_film_has_many_screenings()
    {
        $theater = Theater::factory()->create();
        $film = Film::factory()->create();
        $attributes = [
            'date' => '1999-10-10',
            'theater_id' => $theater->id,
            'film_id' => $film->id,
        ];
        $screening = Screening::factory()->create($attributes);
        $this->assertEquals($screening->id, $film->screenings[0]->id);
    }

    /** @test */
    public function a_city_has_many_theaters()
    {
        $city = City::factory()->create();
        $theater = Theater::factory()->create(['city_id' => $city->id]);

        $this->assertEquals($theater->id, $city->theaters[0]->id);
    }
}
