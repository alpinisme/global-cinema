<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\User;

class UsersTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function a_default_user_is_not_an_admin()
    {
        $user = factory(User::class)->create();
        $this->assertFalse($user->hasRole('admin'));
    }

    /** @test */
    public function an_admin_user_is_an_admin()
    {
        $admin = factory(User::class)->states('admin')->create();
        $this->assertTrue($admin->hasRole('admin'));
    }
}
