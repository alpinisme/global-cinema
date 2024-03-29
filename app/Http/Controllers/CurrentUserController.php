<?php

namespace App\Http\Controllers;

use App\User;

class CurrentUserController extends Controller
{
    public function __invoke()
    {
        $user = auth()->user();

        if ($user->isStudent()) {
            return response()->json(User::with('assignment', 'assignment.city')->find($user->id));
        }

        return $user;
    }
}
