<?php

namespace App\Http\Controllers;

use App\Http\Requests\TaskRequest;
use App\Services\TaskService;
use App\Notifications\PersonalizedNotification;
use App\Services\NotificationService;


use Illuminate\Support\Facades\Http;

class TaskController extends Controller
{
    protected $taskService;

    public function __construct(TaskService $taskService)
    {
        $this->taskService = $taskService;
    }

    public function index()
    {
        return $this->taskService->getAllTasks();
    }

    public function show($id)
    {
        return $this->taskService->getTaskById($id);
    }

    public function store(TaskRequest $request)
    {
        return $this->taskService->createTask($request->validated());
    }

    public function update(TaskRequest $request, $id)
    {
        return $this->taskService->updateTask($id, $request->validated());
    }

    public function delete($id)
    {
        return response()->json(
            ['message' => 'Deleted Successfully'], 
            $this->taskService->deleteTask($id) ? 200 : 400
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
