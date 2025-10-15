<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Transaction;
use App\Models\Task;

class TransactionsTableSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('transactions')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $task1 = Task::where('title', 'Base task 1')->firstOrFail();
        $task2 = Task::where('title', 'Base task 2')->firstOrFail();
        $task3 = Task::where('title', 'Base task 3')->firstOrFail();
        $task4 = Task::where('title', 'Base task 4')->firstOrFail();

        $rows = [
            ['text' => 'Transfer 1', 'amount' => 100, 'task_id' => $task1->id, 'created_at' => '2025-10-07 10:13:12', 'updated_at' => '2025-10-07 10:13:12'],
            ['text' => 'Transfer 2', 'amount' => 300, 'task_id' => $task2->id, 'created_at' => '2025-10-07 12:14:54', 'updated_at' => '2025-10-07 12:14:54'],
            ['text' => 'Transfer 3', 'amount' => 100, 'task_id' => $task3->id, 'created_at' => now(), 'updated_at' => now()],
            ['text' => 'Transfer 4', 'amount' => 100, 'task_id' => $task4->id, 'created_at' => now(), 'updated_at' => now()],
        ];

        foreach ($rows as $r) {
            Transaction::create($r);
        }
    }
}
