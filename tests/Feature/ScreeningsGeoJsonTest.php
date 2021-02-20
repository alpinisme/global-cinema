<?php

namespace Tests\Feature;

use App\City;
use App\Film;
use App\Screening;
use App\Theater;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ScreeningsGeoJsonTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function a_guest_can_access_the_geojson_endpoint()
    {
        $date = '1955-10-10';
        $city = City::factory()->create()->id;
        $this->get("/geojson?city=$city&date=$date")->assertOk();
    }

    /** @test */
    public function you_can_request_geojson_data_for_screenings_on_a_given_day_and_in_a_given_city()
    {
        $date = '1955-10-10';
        $city = City::factory()->create()->id;
        $theater = Theater::factory()->create(['city_id' => $city]);
        $film = Film::factory()->create(['year' => 1955]);
        Screening::factory()->create(['date' => $date, 'theater_id' => $theater->id, 'film_id' => $film->id]);
        $this->get("/geojson?city=$city&date=$date")
            ->assertJsonFragment(['title' => $film->title])
            ->assertJsonPath('type', 'FeatureCollection')
            ->assertJsonPath('features.0.properties.theater', $theater->name);
    }

    /** @test */
    public function geojson_data_is_well_formed()
    {
        $date = '1955-10-10';
        $city = City::factory()->create()->id;
        $theater = Theater::factory()->create(['city_id' => $city]);
        $film = Film::factory()->create(['year' => 1955]);
        Screening::factory()->create(['date' => $date, 'theater_id' => $theater->id, 'film_id' => $film->id]);
        $this->get("/geojson?city=$city&date=$date")
                ->assertJsonPath('type', 'FeatureCollection')
                ->assertJsonPath('features.0.properties.theater', $theater->name)
                ->assertJsonPath('features.0.geometry.coordinates.0', strval($theater->lng));
    }

    /** @test */
    public function geojson_does_not_include_irrelevant_screenings()
    {
        $date = '1955-10-10';
        $wrongDate = '1954-01-01';
        $cities = City::factory()->count(2)->create();
        $theater = Theater::factory()->create(['city_id' => $cities[0]->id]);
        $decoyTheater = Theater::factory()->create(['city_id' => $cities[1]->id]);
        $film = Film::factory()->create(['year' => 1955]);
        $decoyFilm = Film::factory()->create(['year' => 1955]);
        Screening::factory()->create(['date' => $date, 'theater_id' => $theater->id, 'film_id' => $film->id]);
        Screening::factory()->create(['date' => $wrongDate, 'theater_id' => $theater->id, 'film_id' => $decoyFilm->id]);
        Screening::factory()->create(['date' => $date, 'theater_id' => $decoyTheater->id, 'film_id' => $film->id]);
        $this->get('/geojson?city=' . $cities[0]->id . "&date=$date")->assertJsonMissing(['title' => $decoyFilm->title]);
        $this->get('/geojson?city=' . $cities[0]->id . "&date=$date")->assertJsonMissing(['theater' => $decoyTheater->title]);
    }
}
