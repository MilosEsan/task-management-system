<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// controllers
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TaskController;
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
    // tasks
    Route::get('tasks', [TaskController::class, 'index'])->middleware('checkUser');
    Route::get('tasks/{id}', [TaskController::class, 'show']);
    Route::post('tasks', [TaskController::class, 'store']);
    Route::put('tasks/{id}', [TaskController::class, 'update']);
    Route::delete('tasks/{id}', [TaskController::class, 'delete']);
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
