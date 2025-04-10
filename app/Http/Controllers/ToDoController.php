<?php

namespace App\Http\Controllers;

use App\Http\Requests\ToDoRequest;
use App\Services\ToDoService;
use App\Notifications\PersonalizedNotification;
use App\Services\NotificationService;


use Illuminate\Support\Facades\Http;

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

    public function testAI()
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('HUGGINGFACE_API_KEY')
        ])->post('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1', [
            'inputs' => 'Please explain to the user that this task is finished and motivate him to use the app more often.',
        ]);
    
        return response()->json($response->json());
        // \Log::info('HuggingFace key '.env('HUGGINGFACE_API_KEY'));
    }
}
