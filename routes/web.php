<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

use App\User;

Route::get('/', function () {
    return view('app');
});
Route::post('/csv', 'CsvController');
Route::get('/test', 'TempFilmMergeController');
Route::get('/grading', 'GradingController@index')->middleware(['can:grade']);

Route::group(['middleware' => ['auth']], function () {
    Route::get('/screenings/{date}', 'ScreeningsController@date');
    Route::get('/films/search/{string}', 'FilmsController@search');

    Route::apiResource('/screenings', 'ScreeningsController');
    Route::apiResource('/films', 'FilmsController');
    Route::apiResource('/cities', 'CitiesController');
    Route::apiResource('/theaters', 'TheatersController');

    Route::get('/assignment', function () {
        return auth()->user()->assignment->assignment;
    });

    Route::get('/user', function () {
        return auth()->user();
    });

    Route::get('/role', function () {
        return auth()->user()->role;
    });
});

Route::get('/map', 'ScreeningsController@map');
Route::get('/map/{city}/{date}', 'ScreeningsController@geoJSON');
Route::get('/cities', 'CitiesController@index');
Route::get('/instructors', function () {
    return User::select('id', 'name')->where('role', 'instructor')->get();
});

Route::group(['middleware' => ['can:see admin tools']], function () {
    Route::apiResource('/users', 'UsersController');

    Route::get('/assigned_city', 'AssignmentsController@getAssignedCity');
    Route::post('/assigned_city', 'AssignmentsController@setAssignedCity');

    Route::post('/password/reset/{id}', 'Auth\ResetPasswordController@getResetLink');
    Route::get('/dupes', 'DuplicateFilmsController@index');
    Route::patch('/dupes', 'DuplicateFilmsController@update');

    Route::get('/review/{category}', 'ActivityReviewController');
    Route::patch('/merge/films', 'FilmMergeController@update');
});

Auth::routes();
Route::get('/logout', '\App\Http\Controllers\Auth\LoginController@logout');

Route::get('/completed/{city}', 'ProgressReviewController@index');

// Route::get('/log',                          '\Rap2hpoutre\LaravelLogViewer\LogViewerController@index'); // see github for how to add
