<?php

namespace App\Http\Controllers;

use App\Http\Requests\TheaterCsvUploadRequest;
use App\Helpers\CsvReader;
use App\Exceptions\InvalidCsvException;
use App\Theater;

class TheaterCsvUploadController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  App\Http\Requests\TheaterCsvUploadRequest  $request
     * @param  App\Helpers\CsvReader $csvReader
     * @return \Illuminate\Http\Response
     */
    public function __invoke(TheaterCsvUploadRequest $request, CsvReader $csvReader)
    {
        $required = ['name'];
        $optional = ['lat', 'lng', 'open_year', 'close_year', 'raw', 'capacity', 'address'];
        $allowed = array_merge($required, $optional);

        $count = 0;

        try {
            $rows = $csvReader->read($request->file('csv'))->require($required)->only($allowed)->toArray();

            foreach ($rows as $theater) {
                // each row is a screening, so save it to db
                $theater['city_id'] = $request->city;
                $theater['created_by'] = auth()->id();
                $isSuccess = Theater::create($theater);

                if ($isSuccess) {
                    $count += 1;
                }
            };
        } catch (InvalidCsvException $e) {
            return ['error' => $e->getMessage() . "\nFix this and then reupload."];
        }

        return response()->json($count);
    }
}
