<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    protected function asAdmin()
    {
        return $this->actingAs(factory('App\User')->state('admin')->create());
    }
}
