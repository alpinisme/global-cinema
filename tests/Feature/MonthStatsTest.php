<?php

namespace Tests\Feature;

use App\City;
use App\Screening;
use App\Theater;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class MonthStatsTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    /** @test */
    public function month_stats_endpoint_requires_date_and_city_params()
    {
        $this->get('/month-stats')->assertSessionHasErrors(['date', 'city']);
    }

    /** @test */
    public function month_stats_endpoint_gives_ok_response_when_date_and_city_params_present()
    {
        $date = $this->faker->date;
        $city = City::factory()->create()->id;
        $this->get("/month-stats?city=$city&date=$date")->assertOk();
    }

    /** @test */
    public function response_contains_list_of_all_films_screened_during_month_and_their_respective_screening_counts()
    {
        $date = $this->faker->date;
        $city = City::factory()->create()->id;
        $theater = Theater::factory()->create(['city_id' => $city]);
        $screenings = Screening::factory()->count(4)->create(['theater_id' => $theater->id, 'date' => $date]);
        $this->get("/month-stats?city=$city&date=$date")
                ->assertJsonPath('0.film_id', strval($screenings[0]->film_id))
                ->assertJsonPath('3.film_id', strval($screenings[3]->film_id));
    }

    /** @test */
    public function response_contains_no_films_screened_during_other_months()
    {
        $date = '1997-09-09';
        $city = City::factory()->create()->id;
        $theater = Theater::factory()->create(['city_id' => $city]);
        Screening::factory()->create(['theater_id' => $theater->id, 'date' => '1997-10-04']); // decoy
        $screening = Screening::factory()->create(['theater_id' => $theater->id, 'date' => '1997-09-04']);
        $this->get("/month-stats?city=$city&date=$date")
                   ->assertJsonPath('0.film_id', strval($screening->film_id))
                   ->assertJsonCount(1);
    }
}
