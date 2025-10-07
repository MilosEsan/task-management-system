<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Services\TransactionService;

class TransactionController extends Controller
{

    protected $transactionService;

    public function __construct(TransactionService $transactionService)
    {
        $this->transactionService = $transactionService;
    }

    public function index()
    {
        return $this->transactionService->get();
    }

    public function store(\App\Http\Requests\TransactionRequest $request)
    {
        $data = $request->validated(); 
        return $this->transactionService->deposit($data);
    }

    public function delete(Request $request, $id)
    {
        $this->transactionService->delete($id);
        return 204;
    }
}
