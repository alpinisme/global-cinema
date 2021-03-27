<?php

namespace App\Http\Controllers;

use App\Screening;
use Cache;
use Carbon\Carbon;

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
        // to allow for testing
        $dateClause = env('DB_CONNECTION') === 'sqlite'
                    ? 'strftime("%Y-%m", date)'
                    : 'DATE_FORMAT(date, "%Y-%M")';

        $rememberUntil = Carbon::now()->addWeek();

        return Cache::remember('progress-review', $rememberUntil, function () use ($dateClause, $city) {
            return Screening::selectRaw("$dateClause as month, MAX(date)")
                ->distinct()
                ->inCity($city)
                ->groupBy('month')
                ->orderBy('MAX(date)')
                ->get()
                ->map(fn ($d) => $d['month']);
        }) ;
    }
}
