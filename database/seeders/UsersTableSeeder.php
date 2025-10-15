<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UsersTableSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('users')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $users = [
            ['name' => 'Marko Stojic', 'email' => 'marko@mail.com', 'role' => 'super_admin', 'balance' => 8200.00],
            ['name' => 'Mile Ostojic', 'email' => 'mile@mile.co', 'role' => 'team_member', 'balance' => 2400.00],
            ['name' => 'Boban Grajic', 'email' => 'boban@email.co', 'role' => 'team_member', 'balance' => 1000.00],
            ['name' => 'Milan Mrsic', 'email' => 'milan@mail.com', 'role' => 'super_admin', 'balance' => 900.00],
        ];

        foreach ($users as $u) {
            User::create([
                'name' => $u['name'],
                'email' => $u['email'],
                'password' => Hash::make('1234qwer'),
                'role' => $u['role'],
                'balance' => $u['balance'],
            ]);
        }
    }
}
