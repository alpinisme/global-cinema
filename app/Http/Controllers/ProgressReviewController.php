<?php

namespace App\Http\Controllers;

use App\Screening;
use DB;
use Illuminate\Http\Request;

class ProgressReviewController extends Controller
{
    public function index($city)
    {
        return Screening::select(
            DB::raw('DATE_FORMAT(date, "%Y-%M") as month, MAX(date)')
        )->distinct()
        ->whereIn(
            'theater_id',
            function ($query) use ($city) {
                $query->select('id')->from('theaters')->where('city_id', $city);
            }
        )->groupBy('month')
        ->orderBy('MAX(date)')
        ->get()
        ->map(function ($d) {return $d['month']; });
    }
}
