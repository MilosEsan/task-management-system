<?php

namespace App\Services;

use App\Repositories\Contracts\UserInterface;
use Illuminate\Support\Facades\Log;

class UserService
{
    protected $userRepository;

    public function __construct(UserInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function getAllUsers()
    {
        return $this->userRepository->getAll();
    }

    public function getUserById($id)
    {
        return $this->userRepository->findById($id);
    }

    public function createUser(array $data)
    {
        try {
                $this->userRepository->create($data);
                return response()->json(['message' => 'User Created Successfully (from service)!!']);
            } catch (\Exception $e) {
                Log::error($e->getMessage());
                return response()->json(['message' => 'Something went wrong while creating a user!'], 500);
            }
    }

    public function updateUser($id, array $data)
    {
        return $this->userRepository->update($id, $data);
    }

    public function deleteUser($id)
    {
        return $this->userRepository->delete($id);
    }
}
