<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DatesController extends Controller
{
    public function index()
    {
        return view('check');
    }
}
