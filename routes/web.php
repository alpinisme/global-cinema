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

Route::group(['middleware' => ['auth']], function () {
    Route::get('/', function () {
        return view('app');
    });
  
    Route::get('/screenings/{date}', 'ScreeningsController@date');
    Route::resource('/screenings', 'ScreeningsController');

    Route::resource('/films', 'FilmsController');

    Route::resource('/theaters', 'TheatersController');

    Route::get('/assignment', function () {
        return auth()->user()->assignment->assignment;
    });
  
    Route::get('/role', function () {
        return auth()->user()->role;
    });

    Route::get('/instructor', 'InstructorController@index');
});


Route::group(['middleware' => ['can:see admin tools']], function () {
    Route::get('/admin', 'PermissionsController@index');
    Route::post('/admin/user/{id}', 'PermissionsController@update');

    Route::resource('/users', 'UsersController');
    
    Route::get('/assigned_city', 'AssignmentsController@getAssignedCity');
    Route::post('/assigned_city', 'AssignmentsController@setAssignedCity');
});




Auth::routes();
Route::get('/logout', '\App\Http\Controllers\Auth\LoginController@logout');
