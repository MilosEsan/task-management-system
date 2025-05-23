<?php

namespace App\Services;

use App\Repositories\Contracts\ToDoInterface;
use Illuminate\Support\Facades\Log;
use App\Notifications\PersonalizedNotification;
use App\Services\NotificationService;
use Illuminate\Support\Facades\DB;
use App\Models\Todo;
use App\Models\User;

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
        return response()->json([
            'record_count' => $this->toDoRepository->countTodayRecords(),
            'user'         => auth()->user()->id,
            'backlog'      => $this->toDoRepository->getAll()['backlog'],
            'in_progress'  => $this->toDoRepository->getAll()['in_progress'],
            'completed'    => $this->toDoRepository->getAll()['completed'],
            'date'         => now()->format('Y-m-d H:i:s'),
        ]);
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

    private function completeTask($taskId, string $taskName)
    {
        $message = $this->notificationService->generateNotificationContent(auth()->user(), $taskName);

        $managers = User::where('role', 'super_admin')->get();

        foreach ($managers as $manager) {
            $manager->notify(new PersonalizedNotification($message));
        }
        return response()->json(['message' => 'Task completed and notification sent!']);
    }
}
