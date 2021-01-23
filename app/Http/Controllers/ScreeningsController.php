<?php

namespace App\Http\Controllers;

use App\Screening;
use App\Helpers\ScreeningsGeoJSON;
use App\Http\Requests\ScreeningsRequest;

class ScreeningsController extends Controller
{
    public function index()
    {
        return $this->authorizedScreenings();
    }

    public function store(ScreeningsRequest $request)
    {
        $screening = new Screening($request->validated());
        $screening->createdBy = auth()->id();
        $screening->save();

        $response = Screening::with(['film', 'theater'])
        ->where('id', '=', $screening->id)
        ->get()
        ->first();

        return response()->json($response, 201);
    }

    public function update(ScreeningsRequest $request, Screening $screening)
    {
        $screening->fill($request->validated());
        $screening->save();

        return Screening::with(['film', 'theater'])
                        ->where('id', '=', $screening->id)
                        ->get()
                        ->first();
    }

    public function destroy(Screening $screening)
    {
        $screening->delete();

        return response('', 204);
    }

    public function date($date)
    {
        return Screening::with(['film', 'theater'])
                    ->where('date', $date)
                    ->where('screenings.createdBy', auth()->id())
                    ->get();
    }

    public function map()
    {
        return view('map');
    }

    public function geoJSON($city, $date)
    {
        $screenings = Screening::leftJoin('theaters', 'theaters.id', '=', 'screenings.theater_id')
                    ->leftJoin('films', 'films.id', '=', 'screenings.film_id')
                    ->select('date', 'name', 'lat', 'lng', 'title', 'language', 'country')
                    ->where('screenings.date', '=', $date)
                    ->where('theaters.city_id', '=', $city)
                    ->get();

        // format data according to geoJSON standard
        $geoJSON = new ScreeningsGeoJSON($date, $screenings);

        return response()->json($geoJSON);
    }

    protected function authorizedScreenings()
    {
        $user = auth()->user();
        if ($user->isStudent()) {
            return $user->screenings;
        }
        if ($user->isAdmin()) {
            return Screening::all();
        }

        return 'user type not recognized';
    }
}
