<?php

namespace Tests\Feature;

use App\City;
use App\Theater;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class TheaterCsvUploadTest extends TestCase
{
    private $uri = '/csv/theaters';

    use RefreshDatabase;
    use WithFaker;

    /** @test */
    public function request_must_have_required_fields()
    {
        $this->asAdmin()->post($this->uri, [])->assertSessionHasErrors(['csv', 'city']);
    }

    /** @test */
    public function city_must_exist_in_db()
    {
        $this->asAdmin()->post($this->uri, ['city' => 1])->assertSessionHasErrors('city');
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
            'csv' => UploadedFile::fake()->create('theaters.csv'),
            'city' => City::factory()->create()->id,
        ];

        $this->asAdmin()->post($this->uri, $data)->assertSessionDoesntHaveErrors()->assertOk();
    }

    /** @test */
    public function admins_can_save_theaters_via_csv()
    {
        $cityId = City::factory()->create()->id;
        $theater = Theater::factory()->make(['city_id' => $cityId]);
        $csv = "Name,Address,Capacity\n$theater->name,\"$theater->address\",$theater->capacity";
        $data = [
            'csv' => UploadedFile::fake()->createWithContent('theaters.csv', $csv),
            'city' => $cityId,
        ];

        $this->asAdmin()->post($this->uri, $data);
        $this->assertDatabaseHas('theaters', ['name' => $theater->name, 'address' => $theater->address, 'capacity' => $theater->capacity]);
    }
}
