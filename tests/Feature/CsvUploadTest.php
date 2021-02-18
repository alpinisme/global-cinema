<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
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
}
