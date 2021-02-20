<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use App\User;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    protected function asAdmin()
    {
        return $this->actingAs(User::factory()->admin()->create());
    }
}
