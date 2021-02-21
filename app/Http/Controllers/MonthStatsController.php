<?php

namespace App\Http\Controllers;

use App\Http\Requests\MonthStatsRequest;
use App\Screening;

class MonthStatsController extends Controller
{
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
