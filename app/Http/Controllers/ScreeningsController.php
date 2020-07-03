<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Screening;
use DB;

class ScreeningsController extends StandardResourceController
{
    protected $model = Screening::class;

    protected $fields = [
        'date' => 'required',
        'theater_id' => 'required',
        'film_id' => 'required',
    ];

    protected $objectName = 'screening';

    protected $tableName = 'screenings';

    public function index(Request $request)
    {
        if ($request->wantsJson()) {
            return $this->authorizedScreenings();
        }
        $screenings = $this->authorizedScreenings();

        return view('screenings/index', compact('screenings'));
    }

    public function create()
    {
        $screenings = $this->authorizedScreenings();

        return view('screenings/create', compact('screenings'));
    }

    public function store(Request $request)
    {
        $result = parent::store($request);

        if ($request->wantsJson()) {
            return Screening::with(['film', 'theater'])
                            ->where('id', '=', $result->id)
                            ->get()
                            ->first();
        }

        return $result;
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
        $screenings = DB::table('screenings')
                    ->leftJoin('theaters', 'theaters.id', '=', 'screenings.theater_id')
                    ->leftJoin('films', 'films.id', '=', 'screenings.film_id')
                    ->select('date', 'name', 'lat', 'lng', 'title', 'language', 'country')
                    ->where('screenings.date', '=', $date)
                    ->where('theaters.city_id', '=', $city)
                    ->get();

        // format data according to geoJSON standard
        $features = [];

        foreach ($screenings as $screening) {
            $properties = [
                'theater' => $screening->name,
                'title' => $screening->title,
                'language' => $screening->language,
            ];

            $feature = [];
            $feature['type'] = 'Feature';
            $feature['properties'] = $properties;
            $feature['geometry'] = [
                'type' => 'Point',
                'coordinates' => [
                    $screening->lng,
                    $screening->lat,
                ],
            ];

            $features[] = $feature;
        }

        $crs = [];
        $crs['type'] = 'name';
        $crs['properties'] = ['name' => 'urn:ogc:def:crs:OGC:1.3:CRS84'];

        $geoJSON = [];
        $geoJSON['type'] = 'FeatureCollection';
        $geoJSON['name'] = $date;
        $geoJSON['crs'] = $crs;
        $geoJSON['features'] = $features;

        return $geoJSON;
    }

    /**
     * overwrites parent function to add createdBy field
     * via the currently authenticated user
     * (field is not submitted in request)
     */
    protected function setObjectData()
    {
        $this->object->createdBy = auth()->id();
        parent::setObjectData();
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
