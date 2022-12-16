<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;

class TransactionController extends Controller
{
    public function index()
    {
        return Transaction::all();
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
        $todo = Transaction::findOrFail($id);
        $todo->update($request->all());

        return $todo;
    }

    public function delete(Request $request, $id)
    {
        $todo = Transaction::findOrFail($id);
        $todo->delete();

        return 204;
    }
}
