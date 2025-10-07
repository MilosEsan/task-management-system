<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = ['text', 'amount', 'task_id', 'from_user_id', 'to_user_id'];

    public function task()
    {
        return $this->belongsTo(Task::class, 'task_id');
    }

    public function fromUser() {
        return $this->belongsTo(User::class, 'from_user_id');
    }

    public function toUser() {
        return $this->belongsTo(User::class, 'to_user_id');
    }

    public function senders()
    {
        return $this->belongsToMany(User::class, 'task_transaction_user', 'transaction_id', 'from_user_id')
                    ->withPivot('task_id', 'to_user_id')
                    ->withTimestamps();
    }

    public function recipients()
    {
        return $this->belongsToMany(User::class, 'task_transaction_user', 'transaction_id', 'to_user_id')
                    ->withPivot('task_id', 'from_user_id')
                    ->withTimestamps();
    }
}
