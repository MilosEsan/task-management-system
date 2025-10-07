<?php

namespace App\Repositories\Contracts;

interface TransactionInterface 
{
    public function get();
    public function deposit(array $params);
    public function delete($id);
}