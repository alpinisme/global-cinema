<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Theater;

class ActivityReviewTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function films_endpoint_works()
    {
        $this->withoutExceptionHandling();
        $this->asAdmin()->get('/review/films')->assertOk();
    }

    /** @test */
    public function theaters_endpoint_works()
    {
        $this->withoutExceptionHandling();
        $this->asAdmin()->get('/review/theaters')->assertOk();
    }

    /** @test */
    public function theaters_review_returns_both_unverified_theaters_and_possible_duplicates_among_verified()
    {
        $unverified = factory(Theater::class)->create(['name' => 'Priyamvada', 'verified' => false, 'city_id' => 1]);
        $match = factory(Theater::class)->create(['name' => 'Priamvadaa', 'verified' => true, 'city_id' => 1]);
        $nonmatch = factory(Theater::class)->create(['name' => 'Shakuntala', 'verified' => true, 'city_id' => 1]);

        $response = $this->asAdmin()->get('/review/theaters');
        $response->assertJsonPath('0.current.name', $unverified->name);
        $response->assertJsonPath('0.alternates.0.name', $match->name);
        $response->assertJsonPath('0.alternates.1.name', null);
    }

    /** @test */
    public function theaters_review_returns_at_most_five_alternates_per_theater()
    {
        factory(Theater::class)->create(['verified' => false, 'name' => 'Priyamvada', 'city_id' => 1]);
        factory(Theater::class, 10)->create(['verified' => true, 'name' => 'Priyamvada', 'city_id' => 1]);

        $response = $this->asAdmin()->get('/review/theaters');
        $this->assertEquals(5, count($response->getData()[0]->alternates));
    }
}
