<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    protected $fillable = [
        'user_id', 
        'task_id', 
        'transaction_id', 
        'action', 
        'model_type', 
        'model_id', 
        'old_values', 
        'new_values', 
        'ip_address', 
        'device_info'
    ];

    public function users()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function tasks()
    {
        return $this->belongsTo(Task::class, 'task_id');
    }

    public function transactions()
    {
        return $this->belongsTo(Transaction::class, 'transaction_id');
    }
}
