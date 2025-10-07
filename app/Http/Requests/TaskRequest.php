<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TaskRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'title'       => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'assigned_to' => 'nullable|exists:users,id',
            'created_by' => 'nullable|string',
            'progress' => 'nullable|integer|min:0|max:2',
            'transactions' => 'nullable|array',
            'transactions.*.text' => 'required_with:transactions|string|max:255',
            'transactions.*.amount' => 'required_with:transactions|numeric|min:0',
        ];
    }
}
