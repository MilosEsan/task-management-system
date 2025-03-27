<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\User;

use App\Http\Requests\UserRequest;
use App\Services\UserService;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }
    public function index()
    {
        return $this->userService->getAllUsers();
    }
 
    public function show($id)
    {
        return $this->userService->getTodoById($id);
    }

    public function create(UserRequest $request)
    {
        return $this->userService->createUser($request->validated());
    }

    public function delete($id)
    {
        return response()->json(
            ['message' => 'User Deleted Successfully'], 
            $this->userService->deleteUser($id) ? 200 : 400
        );
    }
}