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
        $verifiedUsers = User::factory()->instructor()->count(2)->create();
        $unverifiedUsers = User::factory()->needsVerification()->count(2)->create();
        $this->asAdmin()
                ->getJson('/review/users')
                ->assertOK()
                ->assertJson($unverifiedUsers->toArray())
                ->assertJsonMissing($verifiedUsers->toArray());
    }

    /** @test */
    public function a_contributor_canot_review_unverified_users()
    {
        $this->actingAs(User::factory()->make(['role' => 'contributor']))
                ->getJson('/review/users')
                ->assertStatus(403);
    }
}
