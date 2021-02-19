<?php

namespace App\Http\Controllers;

use App\Http\Requests\TheaterRequest;
use Illuminate\Http\Request;
use App\Theater;

class TheaterController extends Controller
{
    /**
     * Return all theaters, ordered alphabetically by name.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        return Theater::orderBy('name')->get();
    }

    /**
     * Create a new theater. Return it if successful.
     *
     * @param  App\Http\Requests\TheaterRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(TheaterRequest $request)
    {
        return Theater::create($request->validated());
    }

    /**
     * Update the specified theater. Return it if successful.
     *
     * @param  App\Http\Requests\TheaterRequest  $request
     * @param  User $user
     * @return \Illuminate\Http\Response
     */
    public function update(TheaterRequest $request, Theater $theater)
    {
        $theater->fill($request->validated());
        $theater->save();

        return $theater;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  User  $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(Theater $theater)
    {
        $theater->delete();

        return response('', 204);
    }
}
