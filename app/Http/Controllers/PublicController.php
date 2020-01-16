<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PublicController extends Controller
{
    public function projects()
    {
        return view('public/projects');
    }

    public function people()
    {
        return view('public/people');
    }

    public function landing()
    {
        return view('public/landing');
    }
}
