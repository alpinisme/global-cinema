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
  Route::get('/', 'UserHomeController@index');
  Route::get('/home', 'UserHomeController@index');
  
  Route::get('/films/json', 'FilmsController@json');
  Route::resource('/films', 'FilmsController');
  
  Route::get('theaters/json', 'TheatersController@json');
  Route::resource('/theaters', 'TheatersController');
  
  Route::resource('/screenings', 'ScreeningsController');
  
  Route::get('/dates', 'DatesController@index');
});



Route::get('/admin', 'PermissionsController@index')->middleware('can:see admin tools');
Route::post('/admin/user/{id}', 'PermissionsController@update')->middleware('can:see admin tools');



// Route::get('/contact', function () {
//     $tasks = [
//         'do A',
//         'do B',
//         'do C'
//     ];
//     // OR: return view('contact').withTasks($tasks)
//     // OR: return view('contact').withTasks(INLINE LIST of tasks)
//     // OR return view('contact').with(INLINE DEF of tasks)
//     // OR: return view('contact', [ASSOCIATIVE ARRAY of variables and vals])
//     return view('contact', [
//         'tasks' => $tasks
//     ]);
// });

Auth::routes();
Route::get('/logout', '\App\Http\Controllers\Auth\LoginController@logout');
