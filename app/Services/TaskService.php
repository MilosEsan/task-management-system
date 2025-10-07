<?php

namespace App\Services;

use App\Repositories\Contracts\TaskInterface;
use Illuminate\Support\Facades\Log;
use App\Notifications\PersonalizedNotification;
use App\Services\NotificationService;
use Illuminate\Support\Facades\DB;
use App\Models\Task;
use App\Models\User;

class TaskService
{
    protected $taskRepository;

    public function __construct(TaskInterface $taskRepository, NotificationService $notificationService)
    {
        $this->taskRepository = $taskRepository;
        $this->notificationService = $notificationService;
    }

    public function getAllTasks()
    {
        return response()->json([
            'record_count' => $this->taskRepository->countTodayRecords(),
            'user'         => auth()->user()->id,
            'backlog'      => $this->taskRepository->getAll()['backlog'],
            'in_progress'  => $this->taskRepository->getAll()['in_progress'],
            'completed'    => $this->taskRepository->getAll()['completed'],
            'date'         => now()->format('Y-m-d H:i:s'),
        ]);
    }

    public function getTaskById($id)
    {
        return $this->taskRepository->findById($id);
    }

    public function createTask(array $data)
    {
        $recordCount = $this->taskRepository->countTodayRecords();

        if ($recordCount <= 20) {
            try {
                $this->taskRepository->create($data);
                return response()->json(['message' => 'task Created Successfully!!']);
            } catch (\Exception $e) {
                Log::error($e->getMessage());
                return response()->json(['message' => 'Something went wrong while creating a task!'], 500);
            }
        }

        return response()->json([
            'message' => 'Previše zapisa dodano danas (' . $recordCount . ')'
        ], 422);
    }

    public function updateTask($id, array $data)
    {
        $task_name = Task::where('id', $id)->get(['title']);
        $task_name = $task_name[0]->title;
        if (isset($data['progress']) && $data['progress'] == 2) {
            $this->taskRepository->update($id, $data);
            return $this->completeTask($id, $task_name);
        }
        return $this->taskRepository->update($id, $data);
    }

    public function deleteTask($id)
    {
        return $this->taskRepository->delete($id);
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
