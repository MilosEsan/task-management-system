<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Task;
use App\Models\User;
use App\Models\Transaction;

class TaskTransactionUserSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('task_transaction_user')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $marko = User::where('email', 'marko@mail.com')->firstOrFail();
        $boban = User::where('email', 'boban@email.co')->firstOrFail();
        $mile  = User::where('email', 'mile@mile.co')->firstOrFail();

        $task1 = Task::where('title', 'Base task 1')->firstOrFail();
        $task2 = Task::where('title', 'Base task 2')->firstOrFail();
        $task3 = Task::where('title', 'Base task 3')->firstOrFail();
        $task4 = Task::where('title', 'Base task 4')->firstOrFail();

        $tscn1 = Transaction::where('text', 'Transfer 1')->firstOrFail();
        $tscn2 = Transaction::where('text', 'Transfer 2')->firstOrFail();
        $tscn3 = Transaction::where('text', 'Transfer 3')->firstOrFail();
        $tscn4 = Transaction::where('text', 'Transfer 4')->firstOrFail();

        $rows = [
            ['transaction_id' => $tscn1->id, 'task_id' => $task1->id, 'from_user_id' => $marko->id, 'to_user_id' => $boban->id, 'created_at' => '2025-10-07 10:13:12', 'updated_at' => '2025-10-07 10:13:12'],
            ['transaction_id' => $tscn2->id, 'task_id' => $task2->id, 'from_user_id' => $marko->id, 'to_user_id' => $mile->id, 'created_at' => '2025-10-07 12:14:54', 'updated_at' => '2025-10-07 12:14:54'],
            ['transaction_id' => $tscn3->id, 'task_id' => $task3->id, 'from_user_id' => $marko->id, 'to_user_id' => null, 'created_at' => now(), 'updated_at' => now()],
            ['transaction_id' => $tscn4->id, 'task_id' => $task4->id, 'from_user_id' => $boban->id, 'to_user_id' => $marko->id, 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('task_transaction_user')->insert($rows);
    }
}
