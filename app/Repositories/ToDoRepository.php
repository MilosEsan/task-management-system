<?php

namespace App\Repositories;

use App\Models\Todo;
use App\Repositories\Contracts\ToDoInterface;
use Illuminate\Support\Facades\DB;

class ToDoRepository implements ToDoInterface
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
            $result[$key] = Todo::with(['user:id,name', 'transactions:task_id,text,amount'])
            ->where('progress', $status)
            ->get();
        }

        return $result;
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
