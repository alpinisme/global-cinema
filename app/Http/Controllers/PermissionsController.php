<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;

class PermissionsController extends Controller
{
    public function index()
    {
        $users = User::all();
        return view('admin/index', compact('users'));
    }

    public function update($id)
    {
        $user = User::find($id);
        $user->role = request('role');
        $user->save();
        return redirect('/admin');
    }
}
