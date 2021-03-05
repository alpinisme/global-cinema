<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Database\Eloquent\Collection;
use App\User;

class UserTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function an_admin_user_is_an_admin()
    {
        $admin = User::factory()->admin()->create();
        $this->assertTrue($admin->hasRole('admin'));
    }

    /** @test */
    public function a_user_has_screenings()
    {
        $user = User::factory()->create();
        $this->assertInstanceOf(Collection::class, $user->screenings);
    }
}
