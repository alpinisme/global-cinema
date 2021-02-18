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
    public function posting_without_required_fields_gives_validation_errors()
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
    public function file_must_have_a_csv_extension()
    {
        $this->asAdmin()->post($this->uri, ['file' => __FILE__])->assertSessionHasErrors('csv');
    }

    /** @test */
    public function valid_request_receives_ok_status()
    {
        $path = dirname(__FILE__) . '/../test-data/screenings.csv';
        $csv = UploadedFile::fake()->createWithContent('screenings.csv', file_get_contents($path));
        $data = [
            'csv' => $csv,
            'date' => '1955-09-09',
            'city' => factory(City::class)->create()->id,
        ];

        $this->asAdmin()->post($this->uri, $data)->assertSessionDoesntHaveErrors()->assertOk();
    }
}
