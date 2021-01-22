<?php

namespace App\Http\Controllers;

use App\Exceptions\InvalidCsvException;
use App\Helpers\CsvReader;
use App\Http\Requests\CsvUploadRequest;

class CsvController extends Controller
{
    public function __invoke(CsvUploadRequest $request, CsvReader $csvReader)
    {
        $city = $request->input('city');
        $date = $request->input('date');
        $file = $request->file('csv');

        $required = ['title', 'theater'];
        $optional = ['raw'];
        $allowed = array_merge($required, $optional);

        try {
            $rows = $csvReader->read($file)->require($required)->only($allowed)->toArray();
        } catch (InvalidCsvException $e) {
            return ['error' => $e->getMessage()];
        }

        return response()->json($rows);
    }

    protected function getTheaterId($name, $city)
    {
        // return theater id -- create one if need be
    }

    protected function getFilmId($title, $year)
    {
        // return film id -- create one if need be
    }
}
