<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\User;

class PermissionsRequestReviewTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    /** @test */
    public function an_admin_can_review_unverified_users()
    {
        $verifiedUsers = factory(User::class, 2)->states('instructor')->create();
        $unverifiedUsers = factory(User::class, 2)->states('needs verification')->create();
        $this->asAdmin()
                ->getJson('/review/users')
                ->assertOK()
                ->assertJson($unverifiedUsers->toArray())
                ->assertJsonMissing($verifiedUsers->toArray());
    }

    /** @test */
    public function a_contributor_canot_review_unverified_users()
    {
        $this->actingAs(factory(User::class)->make(['role' => 'contributor']))
                ->getJson('/review/users')
                ->assertStatus(403);
    }
}
