<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $roles = ['admin', 'student', 'instructor', 'contributor', 'unconfirmed_contributor'];
        foreach ($roles as $role) {
            DB::table('users')->insert([
                'name' => $role,
                'role' => $role,
                'email' => $role.'@example.com',
                'password' => Hash::make('password'),
            ]);
        }
    }
}
