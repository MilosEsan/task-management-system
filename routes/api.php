<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('todos', 'ToDoController@index');
Route::get('todos/{id}', 'ToDoController@show');
Route::post('todos', 'ToDoController@store');
Route::put('todos/{id}', 'ToDoController@update');
Route::delete('todos/{id}', 'ToDoController@delete');

Route::get('transactions', 'TransactionController@index');
Route::get('transactions/{id}', 'TransactionController@show');
Route::post('transactions', 'TransactionController@store');
Route::put('transactions/{id}', 'TransactionController@update');
Route::delete('transactions/{id}', 'TransactionController@delete');

Route::get('users', 'UserController@index');
Route::get('users/{id}', 'UserController@show');

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
