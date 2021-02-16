<?php

namespace Tests\Feature;

use App\User;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AuthenticationsTest extends TestCase
{
    use WithFaker;
    use RefreshDatabase;

    protected function formFields(User $user)
    {
        $form = [
            'name' => $user->name,
            'email' => $user->email,
            'password' => $user->password,
            'password_confirmation' => $user->password,
            'role' => $user->role,
        ];

        if ($user->role == 'student') {
            $instructor = factory(User::class)->states('instructor')->create();
            $form['instructor_id'] = $instructor->id;
        }

        return $form;
    }

    /** @test */
    public function a_guest_can_register()
    {
        $user = factory('App\User')->states('just registered')->make();
        $this->post('/register', $this->formFields($user))->assertRedirect('/');
        $this->assertAuthenticated();
        $this->assertDatabaseHas('users', ['email' => $user->email]);
    }

    /** @test */
    public function a_guest_can_register_via_api()
    {
        $user = factory('App\User')->states('just registered')->make();
        $this->postJson('/register', $this->formFields($user))->assertStatus(201);
        $this->assertAuthenticated();
        $this->assertDatabaseHas('users', ['email' => $user->email]);
    }

    /** @test */
    public function registration_success_via_api_returns_new_role()
    {
        $user = factory('App\User')->states('just registered')->make();
        $response = $this->postJson('/register', $this->formFields($user));
        $response->assertJson(['role' => $user->role]);
    }

    /** @test */
    public function an_existing_user_cannot_register()
    {
        $user = factory('App\User')->make();
        $this->actingAs($user)->get('/register')->assertRedirect('/');
    }

    /** @test */
    public function a_user_can_log_in_with_correct_credentials()
    {
        $user = factory('App\User')->create([
            'password' => bcrypt($password = 'DONT-look'),
        ]);
        $this->from('/login')->post('/login', [
            'email' => $user->email,
            'password' => $password,
        ])->assertStatus(200);
        $this->assertAuthenticated();
    }

    /** @test */
    public function a_user_cannot_log_in_with_bad_credentials()
    {
        $user = factory('App\User')->create();
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
    public function mismatched_password_confirmation_throws_validation_error()
    {
        $user = factory('App\User')->make();
        $this->post('/register', [
            'name' => $user->name,
            'email' => $user->email,
            'password' => $user->password,
            'password_confirmation' => $user->password . 'typo',
            'role' => $user->role,
            'instructor_id' => '1',
        ])->assertRedirect('/')->assertSessionHasErrors('password');
        $this->assertGuest();
    }

    /** @test */
    public function a_guest_cannot_register_as_an_admin()
    {
        $user = factory('App\User')->states('admin')->make();
        $this->post('/register', $this->formFields($user))->assertSessionHasErrors('role');
        $this->assertGuest();
        $this->assertDatabaseMissing('users', ['name' => $user->name]);
    }

    /** @test */
    public function a_guest_cannot_register_as_an_instructor()
    {
        $user = factory('App\User')->states('instructor')->make();
        $this->post('/register', $this->formFields($user))->assertSessionHasErrors('role');
        $this->assertGuest();
        $this->assertDatabaseMissing('users', ['name' => $user->name]);
    }

    /** @test */
    public function a_student_cannot_register_without_specifying_instructor()
    {
        $user = factory('App\User')->states('student')->make();
        $form = $this->formFields($user);
        unset($form['instructor_id']);
        $this->post('/register', $form)->assertSessionHasErrors('instructor_id');
        $this->assertGuest();
        $this->assertDatabaseMissing('users', ['name' => $user->name]);
    }

    /** @test */
    public function a_student_can_register_when_specifying_instructor()
    {
        $user = factory('App\User')->states('student')->make();
        $this->post('/register', $this->formFields($user));
        $this->assertAuthenticated();
        $this->assertDatabaseHas('users', ['name' => $user->name]);
    }
}
