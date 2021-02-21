<?php

namespace Tests\Feature;

use App\City;
use App\Screening;
use App\Theater;
use DateTime;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ProgressReviewTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function an_admin_can_hit_the_endpoint_without_errors()
    {
        $this->asAdmin()->get('/completed/1')->assertOk();
    }

    /** @test */
    public function an_admin_can_see_list_of_all_months_that_have_data_in_a_given_city()
    {
        $city = City::factory()->create()->id;
        $theater = Theater::factory()->create(['city_id' => $city])->id;
        $screenings = Screening::factory()->count(4)->create(['theater_id' => $theater]);
        $date = new DateTime($screenings[0]->date);
        $formatted = $date->format('Y-m'); // this format is test-specific. SQLITE does not allow Y-F formatting.
        $this->asAdmin()->get("/completed/$city")
                    ->assertJsonCount(4) // this could fail (rarely) due to random overlap of dates
                    ->assertSee($formatted);
    }
}
