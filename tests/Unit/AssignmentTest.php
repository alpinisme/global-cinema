<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Assignment;
use App\User;
use App\AssignmentSetting;
use App\City;

class AssignmentTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function gives_correct_next_date_for_new_assignment()
    {
        $city = City::factory()->create();
        AssignmentSetting::factory()->create(['date' => '1952-01-01', 'city_id' => $city->id]);

        $this->assertEquals(Assignment::nextDate(), '1952-01-01');
        Assignment::factory()->count(5)->create(['city_id' => $city->id]);
        $this->assertEquals(Assignment::nextDate(), '1952-03-01');
        Assignment::factory()->create(['city_id' => $city->id]);
        $this->assertEquals(Assignment::nextDate(), '1952-04-01');
        Assignment::factory()->create(['city_id' => $city->id]);
        $this->assertEquals(Assignment::nextDate(), '1952-04-01');
    }
}
