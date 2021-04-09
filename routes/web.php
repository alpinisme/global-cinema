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
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\CityController;
use App\Http\Controllers\CurrentUserController;
use App\Http\Controllers\FilmController;
use App\Http\Controllers\FilmMergeController;
use App\Http\Controllers\GradingController;
use App\Http\Controllers\MonthStatsController;
use App\Http\Controllers\ProgressReviewController;
use App\Http\Controllers\ScreeningController;
use App\Http\Controllers\ScreeningCsvUploadController;
use App\Http\Controllers\ScreeningsGeoJsonController;
use App\Http\Controllers\TheaterController;
use App\Http\Controllers\TheaterCsvUploadController;
use App\Http\Controllers\UserController;
use App\User;

Route::get('/grading', [GradingController::class, 'index'])->middleware(['can:grade']);
Route::get('/geojson', ScreeningsGeoJsonController::class);
Route::get('/month-stats', MonthStatsController::class);
Route::get('/cities', [CityController::class, 'index']);
Route::get('/completed/{city}', [ProgressReviewController::class, 'index']);
Route::get('/instructors', fn () => User::select('id', 'name')->where('role', 'instructor')->get()); // TODO: switch to controller

Route::group(['middleware' => ['auth']], function () {
    Route::get('/screenings/{date?}', [ScreeningController::class, 'index']);
    Route::apiResource('/screenings', ScreeningController::class);
    Route::apiResource('/films', FilmController::class);
    Route::apiResource('/cities', CityController::class)->except('index');
    Route::apiResource('/theaters', TheaterController::class);
    Route::get('/user', CurrentUserController::class);
    Route::post('/csv/screenings', ScreeningCsvUploadController::class);
    Route::post('/csv/theaters', TheaterCsvUploadController::class);
});

Route::group(['middleware' => ['can:see admin tools']], function () {
    Route::apiResource('/users', UserController::class);
    Route::get('/assigned-city', [AssignmentSettingController::class, 'show']);
    Route::post('/assigned-city', [AssignmentSettingController::class, 'create']);
    Route::post('/password/reset/{id}', [ResetPasswordController::class, 'getResetLink']);
    Route::get('/review/{category}', ActivityReviewController::class);
    Route::patch('/merge/films', [FilmMergeController::class, 'update']);
});

Route::post('/login', [LoginController::class, 'login']);
Route::post('/logout', [LoginController::class, 'logout']);
Route::post('/register', [RegisterController::class, 'register']);
Route::post('/password/reset', [ResetPasswordController::class, 'reset']);

Route::fallback(fn () => view('app'));
