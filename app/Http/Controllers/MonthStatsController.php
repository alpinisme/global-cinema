<?php

namespace App\Http\Controllers;

use App\Http\Requests\MonthStatsRequest;
use App\Screening;

class MonthStatsController extends Controller
{
    /**
     * Find all movies screened in a given city + month and count the number of times each was screened
     *
     * @param App\Http\Requests\MonthStatsRequest
     */
    public function __invoke(MonthStatsRequest $request)
    {
        return Screening::with('film')
                        ->selectRaw('film_id, count(*) as screening_count')
                        ->inCity($request->city)
                        ->inMonth($request->date)
                        ->groupBy('film_id')
                        ->get();
    }
}
