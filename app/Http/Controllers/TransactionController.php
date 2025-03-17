<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;

class TransactionController extends Controller
{
    public function index()
    {
        return Transaction::with('todo:id,title')->get();
    }
 
    public function show($id)
    {
        return Transaction::find($id);
    }

    public function store(Request $request)
    {
        return Transaction::create($request->all());
    }

    public function update(Request $request, $id)
    {
        $transaction = Transaction::findOrFail($id);
        $transaction->update($request->all());

        return $transaction;
    }

    public function delete(Request $request, $id)
    {
        $transaction = Transaction::findOrFail($id);
        $transaction->delete();

        return 204;
    }
}
