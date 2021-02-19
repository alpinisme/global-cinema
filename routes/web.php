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
Route::post('/csv/screenings', 'ScreeningCsvUploadController');
Route::get('/test', 'TempFilmMergeController');
Route::get('/grading', 'GradingController@index')->middleware(['can:grade']);

Route::group(['middleware' => ['auth']], function () {
    Route::get('/screenings/{date}', 'ScreeningController@date');
    Route::get('/films/search/{string}', 'FilmController@search');

    Route::apiResource('/screenings', 'ScreeningController');
    Route::apiResource('/films', 'FilmController');
    Route::apiResource('/cities', 'CityController');
    Route::apiResource('/theaters', 'TheaterController');

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

Route::get('/map', 'ScreeningController@map');
Route::get('/map/{city}/{date}', 'ScreeningController@geoJSON');
Route::get('/cities', 'CityController@index');
Route::get('/instructors', function () {
    return User::select('id', 'name')->where('role', 'instructor')->get();
});

Route::group(['middleware' => ['can:see admin tools']], function () {
    Route::apiResource('/users', 'UserController');

    Route::get('/assigned_city', 'AssignmentController@getAssignedCity');
    Route::post('/assigned_city', 'AssignmentController@setAssignedCity');

    Route::post('/password/reset/{id}', 'Auth\ResetPasswordController@getResetLink');

    Route::get('/review/{category}', 'ActivityReviewController');
    Route::patch('/merge/films', 'FilmMergeController@update');
});

Auth::routes();
Route::get('/logout', '\App\Http\Controllers\Auth\LoginController@logout');

Route::get('/completed/{city}', 'ProgressReviewController@index');

// Route::get('/log',                          '\Rap2hpoutre\LaravelLogViewer\LogViewerController@index'); // see github for how to add
