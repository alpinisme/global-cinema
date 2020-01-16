<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UsersTest extends TestCase
{

    use WithFaker;
    use RefreshDatabase;

    /** @test */
    public function a_guest_can_register()
    {
        $user = factory('App\User')->make();
        $this->post('/register', [
            'name' => $user->name,
            'email' => $user->email,
            'password' => $user->password,
            'password_confirmation' => $user->password,
            'role' => $user->role,
        ])->assertRedirect('/home');
        $this->assertAuthenticated();
        $this->assertDatabaseHas('users', ['email' => $user->email]);
    }

    /** @test */
    public function an_existing_user_cannot_register()
    {
        $user = factory('App\User')->make();
        $this->actingAs($user)->get('/register')->assertRedirect('/home');
    }

    /** @test */
    public function a_user_can_log_in_with_correct_credentials()
    {
        $user = factory('App\User')->create([
            'password' => bcrypt($password = 'DONT-look')
        ]);
        $this->from('/login')->post('/login', [
            'email' => $user->email,
            'password' => $password,
        ])->assertRedirect('/home');
        $this->assertAuthenticated();
    }

    /** @test */
    public function a_user_cannot_log_in_with_bad_credentials()
    {
        $user = $user = factory('App\User')->create();
        $this->from('/login')->post('/login', [
            'email' => $user->email,
            'password' => 'bad_pass',
        ])->assertSessionHasErrors('email');
        $this->assertTrue(session()->hasOldInput('email'));
        $this->assertFalse(session()->hasOldInput('password'));
        $this->assertGuest();
    }

    /** @test */
    public function a_user_can_log_out()
    {
        $this->actingAs(factory('App\User')->make())->get('/logout');
        $this->assertGuest();
    }

    /** @test */
    public function nonadmins_cannot_see_admin_links()
    {
        $this->get('/')->assertDontSee('admin-link');
    }

    /** @test */
    public function an_admin_can_see_admin_links()
    {
        $admin = factory('App\User')->states('admin')->create();
        $this->actingAs($admin)->get('/home')->assertSee('admin-link');
    }

    /** @test */
    public function an_admin_can_view_users_list()
    {
        $user = factory('App\User')->create();
        $admin = factory('App\User')->states('admin')->make();
        $this->actingAs($admin)
            ->get('/admin')
            ->assertSee(e($user->name))
            ->assertSee($user->role);
    }

    /** @test */
    public function default_users_cannot_view_users_list()
    {
        $this->actingAs(factory('App\User')->make())->get('/admin')->assertStatus(403);
    }

    /** @test */
    public function an_admin_can_edit_user_roles()
    {
        $user = factory('App\User')->create();
        $admin = factory('App\User')->states('admin')->make();
        $this->actingAs($admin)->post('/admin/user/' . $user->id, [
            'role' => 'admin'
        ])->assertRedirect('/admin');
        $user = \App\User::find($user->id);
        $this->assertTrue($user->hasRole('admin'));
    }
}
