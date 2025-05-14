<?php

namespace App\Repositories;

use App\Models\Todo;
use App\Repositories\Contracts\ToDoInterface;
use Illuminate\Support\Facades\DB;

class ToDoRepository implements ToDoInterface
{
    public function getAll()
    {
        $backlog = Todo::with(['user:id,name', 'transactions:task_id,text,amount'])
        ->where('progress', 0)
        ->get();

        $in_progress = Todo::with(['user:id,name', 'transactions:task_id,text,amount'])
        ->where('progress', 1)
        ->get();

        $completed = Todo::with(['user:id,name', 'transactions:task_id,text,amount'])
        ->where('progress', 2)
        ->get();

        return [
            'backlog' => $backlog,
            'in_progress' => $in_progress,
            'completed' => $completed
        ];
    }

    public function findById($id)
    {
        return Todo::with(['user:id,name', 'transactions:task_id,text,amount'])->find($id);
    }

    public function countTodayRecords()
    {
        return DB::table('todos')
            ->where('created_at', '>=', now()->startOfDay())
            ->where('created_at', '<=', now()->endOfDay())
            ->count();
    }

    public function create(array $data)
    {
        return Todo::create($data);
    }

    public function update($id, array $data)
    {
        $todo = Todo::findOrFail($id);
        $todo->update($data);
        return $todo;
    }

    public function delete($id)
    {
        $todo = Todo::findOrFail($id);
        return $todo->delete();
    }
}
