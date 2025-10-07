<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role'
    ];

    public function tasks()
    {
        return $this->hasMany(Task::class, 'assigned_to');
    }

    // transactions where this user helped (is from_user_id)
    public function helpedTransactions()
    {
        return $this->belongsToMany(Transaction::class, 'task_transaction_user', 'from_user_id', 'transaction_id')
                    ->withPivot('task_id', 'to_user_id')
                    ->withTimestamps();
    }

    // transactions where this user received help (is to_user_id)
    public function receivedTransactions()
    {
        return $this->belongsToMany(Transaction::class, 'task_transaction_user', 'to_user_id', 'transaction_id')
                    ->withPivot('task_id', 'from_user_id')
                    ->withTimestamps();
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
}
