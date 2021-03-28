<?php

namespace App\Http\Controllers;

use App\City;
use App\Http\Requests\CityRequest;
use Cache;
use Carbon\Carbon;

class CityController extends Controller
{
    /**
     * Return all cities, ordered alphabetically by name.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Cache::remember('cities_index', Carbon::now()->addWeek(), function () {
            City::allWithLatestAndOldestScreenings();
        });
    }

    /**
     * Create a new city. Return it if successful.
     *
     * @param  App\Http\Requests\CityRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CityRequest $request)
    {
        return City::create($request->validated());
    }

    /**
     * Update the specified city. Return it if successful.
     *
     * @param  App\Http\Requests\CityRequest  $request
     * @param  User $user
     * @return \Illuminate\Http\Response
     */
    public function update(CityRequest $request, City $city)
    {
        $city->fill($request->validated());
        $city->save();

        return $city;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  User  $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(City $city)
    {
        $city->delete();

        return response('', 204);
    }
}
