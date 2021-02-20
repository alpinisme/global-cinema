<?php

namespace App\Http\Controllers;

use App\Film;
use App\Http\Requests\FilmRequest;
use App\Http\Requests\FilmSearchRequest;

class FilmController extends Controller
{
    /**
     * Return all films, paginated in groups of 50 and narrowed by conditions in query parameters.
     *
     * @param App\Http\Requests\FilmSearchRequest
     * @return \Illuminate\Http\Response
     */
    public function index(FilmSearchRequest $request)
    {
        if ($request->search_term) {
            return Film::before($request->up_to_year ?? 2020)
                        ->titleLike([
                            $request->search_term,
                            "the $request->search_term",
                            "a $request->search_term",
                            "an $request->search_term",
                        ])->get();
        }

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
        return Film::create($request->validated());
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
}
