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

use App\Http\Controllers\ActivityReviewController;
use App\Http\Controllers\AssignmentSettingController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\CityController;
use App\Http\Controllers\FilmController;
use App\Http\Controllers\FilmMergeController;
use App\Http\Controllers\GradingController;
use App\Http\Controllers\ProgressReviewController;
use App\Http\Controllers\ScreeningController;
use App\Http\Controllers\ScreeningCsvUploadController;
use App\Http\Controllers\TempFilmMergeController;
use App\Http\Controllers\TheaterController;
use App\Http\Controllers\TheaterCsvUploadController;
use App\Http\Controllers\UserController;
use App\User;

Route::get('/', function () {
    return view('app');
});
Route::get('/test', TempFilmMergeController::class);
Route::get('/grading', [GradingController::class, 'index'])->middleware(['can:grade']);

Route::group(['middleware' => ['auth']], function () {
    Route::get('/screenings/{date}', [ScreeningController::class, 'date']);

    Route::apiResource('/screenings', ScreeningController::class);
    Route::apiResource('/films', FilmController::class);
    Route::apiResource('/cities', CityController::class);
    Route::apiResource('/theaters', TheaterController::class);

    Route::get('/assignment', function () {
        return auth()->user()->assignment->assignment; // TODO: switch to controller
    });

    Route::get('/user', function () {
        return auth()->user(); // TODO: switch to controller
    });

    Route::get('/role', function () {
        return auth()->user()->role; // TODO: switch to controller
    });
    Route::post('/csv/screenings', ScreeningCsvUploadController::class);
    Route::post('/csv/theaters', TheaterCsvUploadController::class);
});

Route::get('/map', [ScreeningController::class, 'map']);
Route::get('/map/{city}/{date}', [ScreeningController::class, 'geoJSON']);
Route::get('/cities', [CityController::class, 'index']);
Route::get('/instructors', function () {
    return User::select('id', 'name')->where('role', 'instructor')->get(); // TODO: switch to controller
});

Route::group(['middleware' => ['can:see admin tools']], function () {
    Route::apiResource('/users', UserController::class);

    Route::get('/assigned-city', [AssignmentSettingController::class, 'show']);
    Route::post('/assigned-city', [AssignmentSettingController::class, 'create']);

    Route::post('/password/reset/{id}', [ResetPasswordController::class, 'getResetLink']);

    Route::get('/review/{category}', ActivityReviewController::class);
    Route::patch('/merge/films', [FilmMergeController::class, 'update']);
});

Auth::routes();
Route::get('/logout', [LoginController::class, 'logout']);

Route::get('/completed/{city}', [ProgressReviewController::class, 'index']);

// Route::get('/log',                          '\Rap2hpoutre\LaravelLogViewer\LogViewerController@index'); // see github for how to add
