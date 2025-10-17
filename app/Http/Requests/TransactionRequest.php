<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TransactionRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'text' => 'required|string|max:255',
            'amount' => 'required|numeric|min:100',
            'task_id' => 'required|exists:tasks,id',
            'from_user_id' => 'required|exists:users,id',
            'to_user_id' => 'nullable|exists:users,id',
        ];
    }
}
