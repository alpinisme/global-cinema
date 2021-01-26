<?php

namespace App\Http\Controllers;

use App\Http\Resources\GradingCollection;
use App\Http\Resources\GradingResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GradingController extends Controller
{
    /**
     * Shows all students belonging to the authenticated instructor for grading
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index()
    {
        $students = auth()->user()->students;

        return  GradingResource::collection($students);
    }
}
