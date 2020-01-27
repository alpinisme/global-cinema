<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserHomeController extends Controller
{
    public function index() 
    {
        if (auth()->user()->isAdmin()) {
            return view('admin/home');
        }

        if (auth()->user()->isStudent()) {
            return view('app');
        }

        return view('app');
        
    }
}
