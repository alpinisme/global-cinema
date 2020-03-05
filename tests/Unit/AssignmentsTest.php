<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Assignment;

class AssignmentsTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function gives_correct_next_date_for_new_assignment()
    {
      $this->assertEquals(Assignment::nextDate(), "1952-01-01");
      factory('App\Assignment', 5)->create();
      $this->assertEquals(Assignment::nextDate(), "1952-03-01");
      factory('App\Assignment')->create();
      $this->assertEquals(Assignment::nextDate(), "1952-04-01");
      factory('App\Assignment')->create();
      $this->assertEquals(Assignment::nextDate(), "1952-04-01");
    }
}