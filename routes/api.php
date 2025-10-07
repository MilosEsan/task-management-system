<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// controllers
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ToDoController;
use App\Http\Controllers\TransactionController;

use Http\Middleware\CheckUser;



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

    Route::post('users/create', [UserController::class, 'create' ]);


Route::middleware(['auth:sanctum'])->group(function () {
    // todos
    Route::get('todos', [ToDoController::class, 'index'])->middleware('checkUser');
    Route::get('todos/{id}', [ToDoController::class, 'show']);
    Route::post('todos', [ToDoController::class, 'store']);
    Route::put('todos/{id}', [ToDoController::class, 'update']);
    Route::delete('todos/{id}', [ToDoController::class, 'delete']);
    // transactions
    Route::get('transactions', [TransactionController::class, 'index']);
    Route::get('transactions/{id}', 'TransactionController@show');
    Route::post('transactions', [TransactionController::class, 'store']);
    Route::put('transactions/{id}', 'TransactionController@update');
    Route::delete('transactions/{id}', 'TransactionController@delete');
    // users
    Route::get('users', [UserController::class, 'index' ]);
    Route::get('users/{id}', [UserController::class, 'show' ]);
    Route::delete('users/{id}', [UserController::class, 'delete' ]);
});

Route::post('login', [AuthController::class, 'login']);
Route::post('logout', [AuthController::class, 'logout']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
