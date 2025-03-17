<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = ['text', 'amount'];

    public function todo()
    {
        return $this->belongsTo(Todo::class, 'task_id');
    }
}
