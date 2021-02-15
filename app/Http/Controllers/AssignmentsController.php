<?php

namespace App\Http\Controllers;

use DB;
use Illuminate\Http\Request;

class AssignmentsController extends Controller
{
    // TODO: implement ability for admin to assign or re-assign dates for students

    public function getAssignedCity()
    {
        $query = DB::select("Select column_default from information_schema.columns where table_name='theaters' and column_name='city_id'");

        return $query[0]->column_default;
    }

    public function setAssignedCitys(Request $request)
    {
        // get value from request, make sure it is a valid city; if not, return error; if yes, execute query
        $query = DB::table('alter table theaters alter city_id set default ?', []);
    }
}
