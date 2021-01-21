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
        $requiredFields = ['title', 'theater'];

        try {
            $rows = $csvReader->read($file, $requiredFields);
        } catch (InvalidCsvException $e) {
            return ['error' => $e->getMessage()];
        }

        return response()->json($rows);
    }
}
