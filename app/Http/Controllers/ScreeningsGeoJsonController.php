<?php

namespace App\Http\Controllers;

use App\Helpers\ScreeningsGeoJson;
use App\Http\Requests\ScreeningsGeoJsonRequest;
use App\Screening;

class ScreeningsGeoJsonController extends Controller
{
    /**
     * Show all theaters for the specified date and city along with their screenings
     * @return \Illuminate\Http\JsonResponse
     */
    public function __invoke(ScreeningsGeoJsonRequest $request)
    {
        // TODO: this method belong to Theaters and its controller, not here
        $screenings = Screening::byCityAndDate($request->city, $request->date);

        return response()->json(new ScreeningsGeoJson($request->date, $screenings));
    }
}
