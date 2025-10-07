<?php

namespace App\Services;

use App\Repositories\Contracts\TransactionInterface;
use Illuminate\Support\Facades\DB;
use App\Models\Transaction;

class TransactionService
{
    protected $repo;

    public function __construct(TransactionInterface $transactionRepository)
    {
        $this->repo = $transactionRepository;
    }

    public function get()
    {
        return response()->json([
            'transactions' => $this->repo->get(),
            'connected_data' => $this->getUserAndTaskData()
        ]);
    }

    private function getUserAndTaskData() {
        $users = \App\Models\User::all('name', 'id');
        $tasks = \App\Models\ToDo::all('title', 'id');

        return [
            'users'=> $users,
            'tasks' => $tasks
        ];
    }

    public function deposit(array $params)
    {
            try {
                \DB::transaction(function() use($params) {
                $this->repo->deposit($params);
                }, 5);
                return response()->json(['message' => 'Transaction created (new edt est way)'], 201);
            } catch (\Throwable $e) {
                \Log::error('Deposit failed: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
                return response()->json(['error' => 'Could not create transaction'], 500);
            }

    }

    public function delete($id)
    {
        return $this->repo->delete($id);
    }
}
