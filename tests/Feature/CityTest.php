<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CityTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function a_guest_can_access_cities_endpoint()
    {
        $this->get('/cities')->assertOk();
    }
}
