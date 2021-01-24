<?php

namespace App\Http\Controllers;

use App\Screening;

class ProgressReviewController extends Controller
{
    /**
     * Return all months that the database has screenings for in specified city
     *
     * Example: ['1999-September', '1999-October', '2001-April']
     *
     * @param int $city city id
     * @return \Illuminate\Http\Response
     */
    public function index($city)
    {
        return Screening::selectRaw('DATE_FORMAT(date, "%Y-%M") as month, MAX(date)')
                        ->distinct()
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
