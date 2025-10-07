<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = ['title', 'description', 'is_completed', 'progress', 'created_by', 'assigned_to'];

    public function user()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }


    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'task_id');
    }

    // deleting parent records
    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($task) {
            $task->transactions()->delete();
        });
    }
}
