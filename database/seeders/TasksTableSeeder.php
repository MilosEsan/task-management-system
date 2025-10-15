<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Task;
use App\Models\User;

class TasksTableSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('tasks')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $marko = User::where('email', 'marko@mail.com')->firstOrFail();
        $boban = User::where('email', 'boban@email.co')->firstOrFail();
        $mile  = User::where('email', 'mile@mile.co')->firstOrFail();

        $tasks = [
            ['title' => 'Base task 1', 'description' => 'Various obligations', 'progress' => 1, 'created_by' => $marko->name, 'assigned_to' => $boban->id, 'created_at' => '2025-10-07 10:11:00', 'updated_at' => '2025-10-11 12:16:35'],
            ['title' => 'Base task 2', 'description' => 'Various obligations 2', 'progress' => 0, 'created_by' => $marko->name, 'assigned_to' => $mile->id, 'created_at' => '2025-10-07 10:11:26', 'updated_at' => '2025-10-13 08:50:40'],
            ['title' => 'Base task 3', 'description' => 'Various obligations 3 EDITED', 'progress' => 1, 'created_by' => $marko->name, 'assigned_to' => $boban->id, 'created_at' => '2025-10-07 10:11:59', 'updated_at' => '2025-10-11 12:16:51'],
            ['title' => 'Base task 4', 'description' => '4th task', 'progress' => 1, 'created_by' => $marko->name, 'assigned_to' => $boban->id, 'created_at' => now(), 'updated_at' => now()],
        ];

        foreach ($tasks as $t) {
            Task::create($t);
        }
    }
}
