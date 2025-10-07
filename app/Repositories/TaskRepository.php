<?php

namespace App\Repositories;

use App\Models\Task;
use App\Repositories\Contracts\TaskInterface;
use Illuminate\Support\Facades\DB;

class TaskRepository implements TaskInterface
{
    public function getAll()
    {
        $progress_stats = [
            'backlog' => 0,
            'in_progress' => 1,
            'completed' => 2
        ];
        $result = [];

        foreach ($progress_stats as $key => $status) {
            $result[$key] = Task::with(['user:id,name', 'transactions:task_id,text,amount'])
            ->where('progress', $status)
            ->get();
        }

        return $result;
    }

    public function findById($id)
    {
        return Task::with(['user:id,name', 'transactions:task_id,text,amount'])->find($id);
    }

    public function countTodayRecords()
    {
        return DB::table('tasks')
            ->where('created_at', '>=', now()->startOfDay())
            ->where('created_at', '<=', now()->endOfDay())
            ->count();
    }

    public function create(array $data)
    {
        return Task::create($data);
    }

    public function update($id, array $data)
    {
        $task = Task::findOrFail($id);
        $task->update($data);
        return $task;
    }

    public function delete($id)
    {
        $task = Task::findOrFail($id);
        return $task->delete();
    }
}
