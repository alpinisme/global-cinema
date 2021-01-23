<?php

namespace App\Http\Controllers;

use App\City;
use App\Http\Requests\CitiesRequest;

class CitiesController extends Controller
{
    /**
     * Return all cities, ordered alphabetically by name.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return City::orderBy('name')->get();
    }

    /**
     * Create a new city. Return it if successful.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CitiesRequest $request)
    {
        return City::create($request->validated());
    }

    /**
     * Update the specified city. Return it if successful.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  User $user
     * @return \Illuminate\Http\Response
     */
    public function update(CitiesRequest $request, City $city)
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
