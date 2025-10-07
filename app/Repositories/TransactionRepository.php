<?php

namespace App\Repositories;

use App\Models\Transaction;
use App\Repositories\Contracts\TransactionInterface;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Illuminate\Validation\ValidationException;


class TransactionRepository implements TransactionInterface
{
    public function get()
    {
        // TASK: make different ways to sort the values in different responses
        return Transaction::with('senders:id,name', 'recipients:id,name', 'task:id,title')->get();
    }

    public function deposit(array $params)
    {
        $toUserId = $params['to_user_id'] ?? null;

        $from_user = DB::table('users')
        ->where('id', $params["from_user_id"])
        ->lockForUpdate()
        ->first();

        $toUser = null;
        if ($toUserId) {
            $toUser = DB::table('users')
                ->where('id', $toUserId)
                ->lockForUpdate()
                ->first();

            if (!$toUser) {
                throw ValidationException::withMessages(['to_user_id' => 'To user not found']);
            }
        }

        if ($from_user->balance < $params["amount"]) {
            throw ValidationException::withMessages(['balance'=> 'Not enough money']);
        }

        if ($toUser) {
            DB::table('users')->where('id', $toUserId)->increment('balance', $params["amount"]);
        }

        if ($params["from_user_id"]) {
            DB::table('users')->where('id', $params["from_user_id"])->decrement('balance', $params["amount"]);
        }

        $transaction = Transaction::create([
            'text' => $params["text"],
            'amount' => $params["amount"],
            'task_id' => $params["task_id"]
        ]);

        DB::table('task_transaction_user')
        ->insertGetId([
            'from_user_id' => $params["from_user_id"],
            'to_user_id' => $toUserId,
            'task_id' => $params["task_id"],
            'transaction_id' => $transaction->id,
            'created_at'  => now(),
            'updated_at'  => now()
        ]);
        return $transaction->fresh();
    }

    public function delete($id)
    {
        // to be implemented later
        $transaction = Transaction::findOrFail($id);
        $transaction->delete();
    }
}
