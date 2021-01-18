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

use App\Screening;
use App\User;

Route::get('/', function () {
    return view('app');
});

Route::group(['middleware' => ['auth']], function () {
    Route::get('/screenings/{date}', 'ScreeningsController@date');
    Route::resource('/screenings', 'ScreeningsController');

    Route::get('/films/search/{string}', 'FilmsController@search');
    Route::resource('/films', 'FilmsController');
    Route::resource('/cities', 'CitiesController');

    Route::resource('/theaters', 'TheatersController');

    Route::get('/assignment', function () {
        return auth()->user()->assignment->assignment;
    });

    Route::get('/role', function () {
        return auth()->user()->role;
    });

    Route::get('/instructor', 'InstructorController@index');
    Route::get('/map', 'ScreeningsController@map');
    Route::get('/map/{city}/{date}', 'ScreeningsController@geoJSON');
});

Route::get('/map', 'ScreeningsController@map');
Route::get('/map/{city}/{date}', 'ScreeningsController@geoJSON');
Route::get('/cities', 'CitiesController@index');
Route::get('/instructors', function () {
    return User::select('id', 'name')->where('role', 'instructor')->get();
});

// Route::group(['middleware' => 'auth'], function () {
//     Route::resource('/films', 'FilmsController');
//     Route::resource('/cities', 'CitiesController', ['except' => 'index']);

//     Route::resource('/theaters', 'TheatersController');
// });

Route::group(['middleware' => ['can:see admin tools']], function () {
    Route::get('/admin', 'PermissionsController@index');
    Route::post('/admin/user/{id}', 'PermissionsController@update');

    Route::resource('/users', 'UsersController');

    Route::get('/assigned_city', 'AssignmentsController@getAssignedCity');
    Route::post('/assigned_city', 'AssignmentsController@setAssignedCity');

    Route::post('/password/reset/{id}', 'Auth\ResetPasswordController@getResetLink');
    Route::get('/dupes', 'DuplicateFilmsController@index');
    Route::patch('/dupes', 'DuplicateFilmsController@update');

    Route::get('/review/{category}', 'ActivityReviewController@index');
});

Auth::routes();
Route::get('/logout', '\App\Http\Controllers\Auth\LoginController@logout');

Route::get('/completed/{city}', 'ProgressReviewController@index');

/*

Route::get('/city-assignment',              'CityAssignmentController@get');
Route::post('/city-assignment',             'CityAssignmentController@put');


Route::get('/log',                          '\Rap2hpoutre\LaravelLogViewer\LogViewerController@index'); // see github for how to add

// combine users and permissions controllers

*/
