<?php

namespace App\Http\Controllers;

use App\Exceptions\InvalidCsvException;
use App\Film;
use App\Helpers\CsvReader;
use App\Helpers\FuzzySearch;
use App\Helpers\StringHelper;
use App\Http\Requests\ScreeningCsvUploadRequest;
use App\Screening;
use App\Theater;

class ScreeningCsvUploadController extends Controller
{
    protected $city;

    protected $date;

    public function __invoke(ScreeningCsvUploadRequest $request, CsvReader $csvReader, StringHelper $stringHelper)
    {
        $this->city = $request->input('city');
        $this->date = $request->input('date');
        $this->stringHelper = $stringHelper;
        $file = $request->file('csv');

        $required = ['title', 'theater'];
        $optional = ['raw'];
        $allowed = array_merge($required, $optional);

        $count = 0;

        try {
            $rows = $csvReader->read($file)->require($required)->only($allowed);
            $rowsWithIds = $rows->map([$this, 'replaceTheaterNamesWithIds'])->map([$this, 'replaceFilmTitlesWithIds']);
            foreach ($rowsWithIds->toArray() as $row) {
                // each row is a screening, so save it to db
                $screening = new Screening([
                    'date' => $this->date,
                    'theater_id' => $row['theater'],
                    'film_id' => $row['title'],
                ]);
                $screening->created_by = auth()->id();
                $isSuccess = $screening->save();

                if ($isSuccess) {
                    $count += 1;
                }
            };
        } catch (InvalidCsvException $e) {
            return ['error' => $e->getMessage() . "\nFix this and then reupload."];
        }

        return response()->json($count);
    }

    public function replaceTheaterNamesWithIds($row)
    {
        $row['theater'] = $this->getTheaterId($row['theater']);

        return $row;
    }

    public function replaceFilmTitlesWithIds($row)
    {
        $row['title'] = $this->getFilmId($row['title']);

        return $row;
    }

    protected function getTheaterId($name)
    {
        $directMatches = Theater::where('city_id', $this->city)->where('name', $name)->get(['id']);

        if ($directMatches->count() > 1) {
            throw new InvalidCsvException('The theater named "' . $name . '" matches more than one theater in the database');
        }

        if ($directMatches->count() === 1) {
            return $directMatches->first()->id;
        }

        $allTheaters = Theater::where('city_id', $this->city)->get(['id', 'name']);
        $searcher = new FuzzySearch(['name' => $name], $allTheaters);
        $fuzzyMatch = $searcher->sort('name')->threshold(0.8)->take(1);

        if ($fuzzyMatch->count() === 1) {
            return $fuzzyMatch->first()->id;
        }

        $name = substr($name, 0, 35); // database column is varchar(35)
        $newTheater = new Theater(['city_id' => $this->city, 'name' => $name, 'verified' => false]);
        $newTheater->save();

        return $newTheater->id;
    }

    protected function getFilmId($title)
    {
        $year = substr($this->date, 0, 4);
        $directMatches = Film::where('year', '<=', $year)->where('title', $title)->get(['id']);
        $perfectMatches = $directMatches->where('year', $year);

        if ($perfectMatches->count() > 1) { // I'm not sure this should be an error. Theaters, yes, but films should fail quietly
            throw new InvalidCsvException('The film named "' . $title . '" matches more than one film in the year ' . $year);
        }

        if ($perfectMatches->count() == 1) {
            return $perfectMatches->first()->id;
        }

        if ($directMatches->count() === 1) {
            return $directMatches->first()->id;
        }

        if ($directMatches->count() === 0) {
            $allTheaters = Film::verifiedLike($this->stringHelper->substrings($title), substr($this->date, 0, 4));

            $searcher = new FuzzySearch(['title' => $title], $allTheaters);
            $fuzzyMatch = $searcher->sort('title')->threshold(0.7)->take(1);

            if ($fuzzyMatch->count() === 1) {
                return $fuzzyMatch->first()->id;
            }
        }

        $title = substr($title, 0, 150); // database column is varchar(150)
        $newFilm = new Film(['title' => $title, 'year' => $year, 'verified' => false]);
        $newFilm->created_by = auth()->id();
        $newFilm->save();

        return $newFilm->id;
    }
}
