<?php

namespace App\Http\Controllers;

use App\Http\Resources\GradingCollection;
use App\Http\Resources\GradingResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GradingController extends Controller
{
    public function index()
    {
        $students = auth()->user()->students;

        return  GradingResource::collection($students);
    }
}
