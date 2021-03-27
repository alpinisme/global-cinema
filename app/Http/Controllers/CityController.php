<?php

namespace App\Http\Controllers;

use App\City;
use App\Http\Requests\CityRequest;
use App\Screening;
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
        $cities = City::orderBy('name')->get();

        return $cities->map(function ($city) {
            $city['latest'] = Screening::select('date')->inCity($city->id)->latest('date')->first()->date ?? null;
            $city['oldest'] = Screening::select('date')->inCity($city->id)->oldest('date')->first()->date ?? null;

            return $city;
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
