<?php

namespace App\Http\Controllers;

use App\Http\Requests\ToDoRequest;
use App\Services\ToDoService;

class ToDoController extends Controller
{
    protected $toDoService;

    public function __construct(ToDoService $toDoService)
    {
        $this->toDoService = $toDoService;
    }

    public function index()
    {
        return $this->toDoService->getAllTodos();
    }

    public function show($id)
    {
        return $this->toDoService->getTodoById($id);
    }

    public function store(ToDoRequest $request)
    {
        return $this->toDoService->createTodo($request->validated());
    }

    public function update(ToDoRequest $request, $id)
    {
        return $this->toDoService->updateTodo($id, $request->validated());
    }

    public function delete($id)
    {
        return response()->json(
            ['message' => 'Deleted Successfully'], 
            $this->toDoService->deleteTodo($id) ? 200 : 400
        );
    }
}
