<?php

namespace App\Services;

use App\Repositories\Contracts\ToDoInterface;
use Illuminate\Support\Facades\Log;
use App\Notifications\PersonalizedNotification;
use App\Services\NotificationService;
use Illuminate\Support\Facades\DB;
use App\Models\Todo;

class ToDoService
{
    protected $toDoRepository;

    public function __construct(ToDoInterface $toDoRepository, NotificationService $notificationService)
    {
        $this->toDoRepository = $toDoRepository;
        $this->notificationService = $notificationService;
    }

    public function getAllTodos()
    {
        return [
            'record_count' => $this->toDoRepository->countTodayRecords(),
            'poruka'       => 'dodata relacija sa transakcijama',
            'todos'        => $this->toDoRepository->getAll()
        ];
    }

    public function getTodoById($id)
    {
        return $this->toDoRepository->findById($id);
    }

    public function createTodo(array $data)
    {
        $recordCount = $this->toDoRepository->countTodayRecords();

        if ($recordCount <= 20) {
            try {
                $this->toDoRepository->create($data);
                return response()->json(['message' => 'ToDo Created Successfully!!']);
            } catch (\Exception $e) {
                Log::error($e->getMessage());
                return response()->json(['message' => 'Something went wrong while creating a ToDo!'], 500);
            }
        }

        return response()->json([
            'message' => 'Previše zapisa dodano danas (' . $recordCount . ')'
        ], 422);
    }

    public function updateTodo($id, array $data)
    {
        $task_name = Todo::where('id', $id)->get(['title']);
        $task_name = $task_name[0]->title;
        if (isset($data['progress']) && $data['progress'] == 2) {
            $this->toDoRepository->update($id, $data);
            return $this->completeTask($id, $task_name);
        }
        return $this->toDoRepository->update($id, $data);
    }

    public function deleteTodo($id)
    {
        return $this->toDoRepository->delete($id);
    }

    public function completeTask($taskId, string $taskName)
    {
        $message = $this->notificationService->generateNotificationContent(auth()->user(), $taskName);

        // Send notification
        auth()->user()->notify(new PersonalizedNotification($message));

        return response()->json(['message' => 'Task completed and notification sent!']);
    }
}
