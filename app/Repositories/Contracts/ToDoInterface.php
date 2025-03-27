<?php

namespace App\Repositories\Contracts;

interface ToDoInterface 
{
    public function getAll();
    public function findById($id);
    public function countTodayRecords();
    public function create(array $data);
    public function update($id, array $data);
    public function delete($id);
}