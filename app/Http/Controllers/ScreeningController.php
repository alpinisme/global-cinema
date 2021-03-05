<?php

namespace App\Http\Controllers;

use App\Screening;
use App\Http\Requests\ScreeningRequest;

class ScreeningController extends Controller
{
    /**
     * Show all screenings the user is authorized to view
     *
     * @param string date
     * @return \Illuminate\Http\Response
     */
    public function index($date = null)
    {
        if (!$date) {
            return Screening::joined()->createdBy(auth()->id())->paginate(50);
        }

        return Screening::joined()->date($date)->createdBy(auth()->id())->get();
    }

    /**
     * Store a new screening
     *
     * @param ScreeningRequest $request
     * @param Screening $screening
     * @return \Illuminate\Http\Response
     */
    public function store(ScreeningRequest $request, Screening $screening)
    {
        $screening->create($request->validated());

        return Screening::joined()->id($screening->id)->first();

        //     return response()->json($response);
    }

    /**
     * Update the specified screening
     *
     * @param ScreeningRequest $request
     * @param Screening $screening
     * @return \Illuminate\Http\Response
     */
    public function update(ScreeningRequest $request, Screening $screening)
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
}
