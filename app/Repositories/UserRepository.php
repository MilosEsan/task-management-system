<?php

namespace App\Repositories;

use App\Models\User;
use App\Repositories\Contracts\UserInterface;
use Illuminate\Support\Facades\DB;

use Illuminate\Support\Facades\Hash;

class UserRepository implements UserInterface
{
    public function getAll()
    {
        return User::all();
    }

    public function findById($id)
    {
        return User::find($id);
    }

    public function create(array $data)
    {
        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']), 
        ]);

        return $user;
    }

    public function update($id, array $data) {}

    public function delete($id)
    {
        $user = User::findOrFail($id);
        return $user->delete();
    }
}
