<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Todo;
use Illuminate\Support\Facades\DB;

class ToDoController extends Controller
{

    private $recordCount; 

    public function __construct()
    {
        $this->recordCount = DB::table('todos')
            ->where('created_at', '>=', now()->startOfDay())
            ->where('created_at', '<=', now()->endOfDay())
            ->count();
    }

    public function index()
    {
        // $todos = DB::table('todos')
        //     ->leftJoin('transactions', 'todos.id', '=', 'transactions.task_id')
        //     ->leftJoin('users', 'todos.assigned_to', '=', 'users.id')
        //     ->select(
        //         'todos.*', 
        //         'transactions.*',
        //         'users.name as assigned_user_name',
        //         'users.email as assigned_user_email'
        //     )
        //     ->get();
        $todos = Todo::with(['user:id,name', 'transactions:task_id,text,amount'])->get();

        return [
            'record_count' => $this->recordCount,
            'poruka' => 'dodata relacija sa transakcijama',
            'todos' => $todos
        ];

    }
 
    public function show($id)
    {
        $todo = Todo::find($id);
        if ($todo) {
            $todo->load(['user:id,name', 'transactions:task_id,text,amount']);
        }
        return $todo;
    }

    public function store(Request $request)
    {
        if ($this->recordCount <= 20) {
            try{
                Todo::create($request->all());
                return response()->json([
                    'message'=>'ToDoo Created Successfully!!',
                ]);
            }catch(\Exception $e){
                \Log::error($e->getMessage());
                return response()->json([
                    'message'=>'Something goes wrong while creating a todo!!'
                ],500);
            }
        } else {
            return response()->json(['message' => 'Previše zapisa dodano danas (There\'s no more place for any record) '.'('.$recordCount.')'], 422);
        }
    }

    public function update(Request $request, $id)
    {
        $todo = Todo::findOrFail($id);
        $todo->update($request->all());

        return $todo;
    }

    public function delete(Request $request, $id)
    {
        $todo = Todo::findOrFail($id);
        $todo->delete();

        // dodati deleted records table

        return 204;
    }
}
