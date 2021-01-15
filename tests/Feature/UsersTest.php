<?php

namespace Tests\Feature;

use App\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class UsersTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function an_admin_can_delete_a_user()
    {
        $user = factory(User::class)->create();
        $this->assertDatabaseHas('users', ['id' => $user->id]);
        $this->asAdmin()->delete('/users/' . $user->id);
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }
}
