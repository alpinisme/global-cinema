<?php

namespace App\Http\Controllers;

use App\Film;
use App\Http\Requests\FilmRequest;
use DB;
use Illuminate\Http\Request;

class FilmController extends Controller
{
    /**
     * Return all films, paginated in groups of 50.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Film::paginate(50);
    }

    /**
     * Create a new film. Return it if successful.
     *
     * @param  App\Http\Requests\FilmRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(FilmRequest $request)
    {
        $film = new Film($request->validated());
        $film->created_by = auth()->id();
        $film->save();

        return $film;
    }

    /**
     * Update the specified film. Return it if successful.
     *
     * @param  App\Http\Requests\FilmRequest  $request
     * @param  User $user
     * @return \Illuminate\Http\Response
     */
    public function update(FilmRequest $request, Film $film)
    {
        $film->fill($request->validated());
        $film->save();

        return $film;
    }

    /**
     * Delete the specified film.
     *
     * @param  User  $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(Film $film)
    {
        $film->delete();

        return response('', 204);
    }

    // TODO: probably belongs in a separate controller
    public function search(Request $request, $string)
    {
        if (strlen($string) < 3) {
            abort(400, 'Search term must be at least three characters long');
        }

        return DB::table('films')
            ->where('year', '<=', $request['year'] ?? 2020)
            ->where(function ($query) use ($string) {
                $query->where('title', 'LIKE', "%$string%")
                ->orWhere('title', 'LIKE', "%the $string%")
                ->orWhere('title', 'LIKE', "%a $string%")
                ->orWhere('title', 'LIKE', "%an $string%");
            })
            ->get();
    }
}
