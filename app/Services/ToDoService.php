<?php

namespace App\Services;

use App\Repositories\Contracts\ToDoInterface;
use Illuminate\Support\Facades\Log;

class ToDoService
{
    protected $toDoRepository;

    public function __construct(ToDoInterface $toDoRepository)
    {
        $this->toDoRepository = $toDoRepository;
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
        return $this->toDoRepository->update($id, $data);
    }

    public function deleteTodo($id)
    {
        return $this->toDoRepository->delete($id);
    }
}
