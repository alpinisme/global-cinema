<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class InstructorController extends Controller
{
    public function index()
    {
        if (!auth()->user()->isInstructor()) {
            return 'unable to authenticate instructor';
        }

        $students = auth()->user()->students;

        $results = [];

        foreach ($students as $student) {
            $entry = [];
            $entry['info'] = $student;
            $entry['datesCompleted'] = $student->datesCompleted();
            $results[] = $entry;
        }

        return $results;
    }
}
