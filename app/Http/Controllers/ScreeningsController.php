<?php

namespace App\Http\Controllers;

use App\Screening;
use App\Helpers\ScreeningsGeoJSON;
use App\Http\Requests\ScreeningsRequest;

class ScreeningsController extends Controller
{
    /**
     * Show all screenings the user is authorized to view
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        if (auth()->user()->isAdmin()) {
            return Screening::joined()->get();
        }

        return Screening::joined()->createdBy(auth()->id())->get();
    }

    /**
     * Store a new screening
     *
     * @param ScreeningsRequest $request
     * @param Screening $screening
     * @return \Illuminate\Http\Response
     */
    public function store(ScreeningsRequest $request, Screening $screening)
    {
        $screening = $screening->fill($request->validated());
        $screening->createdBy = auth()->id();
        $screening->save();
        $response = Screening::joined()->id($screening->id)->first();

        return response()->json($response, 201);
    }

    /**
     * Update the specified screening
     *
     * @param ScreeningsRequest $request
     * @param Screening $screening
     * @return \Illuminate\Http\Response
     */
    public function update(ScreeningsRequest $request, Screening $screening)
    {
        $screening->fill($request->validated());
        $screening->save();

        return Screening::joined()->id($screening->id)->first();
    }

    /**
     * Delete the specified screening
     *
     * @param Screening $screening
     * @return \Illuminate\Http\Response
     */
    public function destroy(Screening $screening)
    {
        $screening->delete();

        return response('', 204);
    }

    /**
     * Shows all screenings for the specified date created by the user
     *
     * @param string $date
     * @return \Illuminate\Http\Response
     */
    public function date($date)
    {
        return Screening::joined()->date($date)->createdBy(auth()->id())->get();
    }

    /**
     * Show the view for the screenings map
     * @return \Illuminate\Http\Response
     */
    public function map()
    {
        return view('map');
    }

    /**
     * Show all theaters for the specified date and city along with their screenings
     * @param string $city city id
     * @param string $date Y-m-d date string
     * @return \Illuminate\Http\Response
     */
    public function geoJSON($city, $date)
    {
        // TODO: this method belong to Theaters and its controller, not here
        $screenings = Screening::byCityAndDate($city, $date);

        return response()->json(new ScreeningsGeoJSON($date, $screenings));
    }
}
