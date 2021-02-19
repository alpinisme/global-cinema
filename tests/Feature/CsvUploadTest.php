<?php

namespace Tests\Feature;

use App\City;
use App\Film;
use App\Theater;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class CsvUploadTest extends TestCase
{
    private $uri = '/csv';

    use RefreshDatabase;
    use WithFaker;

    /** @test */
    public function request_must_have_required_fields()
    {
        $this->asAdmin()->post($this->uri, [])->assertSessionHasErrors(['csv', 'city', 'date']);
    }

    /** @test */
    public function city_must_exist_in_db()
    {
        $this->asAdmin()->post($this->uri, ['city' => 1])->assertSessionHasErrors('city');
    }

    /** @test */
    public function date_must_be_in_valid_format()
    {
        $this->asAdmin()->post($this->uri, ['date' => 'January 12, 1997'])->assertSessionHasErrors('city');
    }

    /** @test */
    public function file_must_have_be_a_csv()
    {
        $this->asAdmin()->post($this->uri, ['file' => __FILE__])->assertSessionHasErrors('csv');
    }

    /** @test */
    public function request_with_valid_fields_receives_ok_status()
    {
        $data = [
            'csv' => UploadedFile::fake()->create('screenings.csv'),
            'date' => '1955-09-09',
            'city' => factory(City::class)->create()->id,
        ];

        $this->asAdmin()->post($this->uri, $data)->assertSessionDoesntHaveErrors()->assertOk();
    }

    /** @test */
    public function unknown_theaters_and_films_from_csv_are_created_in_db()
    {
        $name = $this->faker->name;
        $title = $this->faker->name;
        $csv = "theater,title\n$name,$title";
        $file = UploadedFile::fake()->createWithContent('screenings.csv', $csv);

        $data = [
            'csv' => $file,
            'date' => '1955-09-09',
            'city' => factory(City::class)->create()->id,
        ];

        $this->asAdmin()->post($this->uri, $data);

        $this->assertDatabaseHas('theaters', ['name' => $name]);
        $this->assertDatabaseHas('films', ['title' => $title]);
    }

    /** @test */
    public function screenings_are_created_for_each_line_of_csv()
    {
        $csv = "theater,title\ntest theater,test film\nanother name,another title";
        $file = UploadedFile::fake()->createWithContent('screenings.csv', $csv);

        $data = [
            'csv' => $file,
            'date' => '1955-09-09',
            'city' => factory(City::class)->create()->id,
        ];

        $this->asAdmin()->post($this->uri, $data);

        // since these are newly created films and theaters in an empty testing db, they ought to have consecutive ids
        $this->assertDatabaseHas('screenings', ['film_id' => 1, 'theater_id' => 1]);
        $this->assertDatabaseHas('screenings', ['film_id' => 2, 'theater_id' => 2]);
    }

    /** @test */
    public function new_screenings_use_existing_theaters_and_films_where_possible()
    {
        $city = factory(City::class)->create()->id;
        $year = $this->faker->year;
        $film = factory(Film::class)->create(['id' => 32, 'year' => $year]);
        $theater = factory(Theater::class)->create(['id' => 11, 'city_id' => $city]);
        $csv = "theater,title\n$theater->name,$film->title";
        $file = UploadedFile::fake()->createWithContent('screenings.csv', $csv);

        $data = [
            'csv' => $file,
            'date' => "$year-09-09",
            'city' => $city,
        ];

        $this->asAdmin()->post($this->uri, $data);

        $this->assertDatabaseHas('screenings', ['film_id' => $film->id, 'theater_id' => $theater->id]);
    }

    /** @test */
    public function new_screenings_do_not_use_existing_theaters_from_other_cities()
    {
        $city1 = factory(City::class)->create()->id;
        $city2 = factory(City::class)->create()->id;
        $year = $this->faker->year;
        $film = factory(Film::class)->create(['id' => 32, 'year' => $year]);
        $theater = factory(Theater::class)->create(['id' => 11, 'city_id' => $city1]);
        $csv = "theater,title\n$theater->name,$film->title";
        $file = UploadedFile::fake()->createWithContent('screenings.csv', $csv);

        $data = [
            'csv' => $file,
            'date' => "$year-09-09",
            'city' => $city2,
        ];

        $this->asAdmin()->post($this->uri, $data);

        $this->assertDatabaseMissing('screenings', ['film_id' => $film->id, 'theater_id' => $theater->id]);
    }

    /** @test */
    public function new_screenings_do_not_use_films_released_after_screening_year()
    {
        $city = factory(City::class)->create()->id;
        $year = $this->faker->year;
        $film = factory(Film::class)->create(['id' => 32, 'year' => $year + 5]);
        $theater = factory(Theater::class)->create(['id' => 11, 'city_id' => $city]);
        $csv = "theater,title\n$theater->name,$film->title";
        $file = UploadedFile::fake()->createWithContent('screenings.csv', $csv);

        $data = [
            'csv' => $file,
            'date' => "$year-09-09",
            'city' => $city,
        ];

        $this->asAdmin()->post($this->uri, $data);

        $this->assertDatabaseMissing('screenings', ['film_id' => $film->id, 'theater_id' => $theater->id]);
    }

    /** @test */
    public function new_screenings_reuse_newly_created_theaters_and_films_where_possible()
    {
        $city = factory(City::class)->create()->id;
        $year = $this->faker->year;
        $film = factory(Film::class)->make()->title;
        $theater = factory(Theater::class)->make()->name;
        $csv = "theater,title\n$theater,$film\n$theater,another title\nanother theater,$film";
        $file = UploadedFile::fake()->createWithContent('screenings.csv', $csv);

        $data = [
            'csv' => $file,
            'date' => "$year-09-09",
            'city' => $city,
        ];

        $this->asAdmin()->post($this->uri, $data);

        // this test also relies on consecutive id incrementing
        $this->assertDatabaseHas('screenings', ['film_id' => 1, 'theater_id' => 2]);
        $this->assertDatabaseHas('screenings', ['film_id' => 2, 'theater_id' => 1]);
    }

    /** @test */
    public function new_screenings_use_approximate_matching_theaters_and_films_when_no_exact_match()
    {
        $this->withoutExceptionHandling();
        $city = factory(City::class)->create()->id;
        $year = $this->faker->year;
        $film = factory(Film::class)->create(['id' => 32, 'year' => $year, 'verified' => true]);
        $theater = factory(Theater::class)->create(['id' => 11, 'city_id' => $city, 'verified' => true]);
        $corruptedTitle = $film->title . 'z';
        $corruptedTheater = 'r' . $theater->name . 'f';
        $csv = "theater,title\n$corruptedTheater,$corruptedTitle";
        $file = UploadedFile::fake()->createWithContent('screenings.csv', $csv);

        $data = [
            'csv' => $file,
            'date' => "$year-09-09",
            'city' => $city,
        ];

        $this->asAdmin()->post($this->uri, $data);

        $this->assertDatabaseMissing('films', ['title' => $corruptedTitle]);
        $this->assertDatabaseHas('screenings', ['film_id' => $film->id, 'theater_id' => $theater->id]);
    }
}
