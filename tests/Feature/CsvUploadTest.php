<?php

namespace Tests\Feature;

use App\City;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class CsvUploadTest extends TestCase
{
    private $uri = '/csv';

    use RefreshDatabase;

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
        $name = 'test theater';
        $title = 'test film';
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
        $this->withoutExceptionHandling();
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
}
