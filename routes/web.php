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

    Route::get('/home', 'UserHomeController@index');
  
    Route::resource('/films', 'FilmsController');
  
    Route::resource('/theaters', 'TheatersController');
  
    Route::get('/screenings/{date}', 'ScreeningsController@date');
    Route::resource('/screenings', 'ScreeningsController');

    Route::get('/assignment', function () {
        return auth()->user()->assignment->assignment;
    });
  
    Route::get('/role', function () {
        return auth()->user()->role;
    });
    Route::get('/instructor', 'InstructorController@index');
});

Route::get('/admin', 'PermissionsController@index')->middleware('can:see admin tools');
Route::post('/admin/user/{id}', 'PermissionsController@update')->middleware('can:see admin tools');
Route::resource('/users', 'UsersController')->middleware('can:see admin tools');


Auth::routes();
Route::get('/logout', '\App\Http\Controllers\Auth\LoginController@logout');
