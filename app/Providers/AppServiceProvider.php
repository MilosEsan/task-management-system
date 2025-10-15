<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

use App\Repositories\Contracts\UserInterface;
use App\Repositories\UserRepository;
use App\Repositories\Contracts\TaskInterface;
use App\Repositories\TaskRepository;
use App\Repositories\Contracts\TransactionInterface;
use App\Repositories\TransactionRepository;

use App\Models\Task;
use App\Models\Transaction;
use App\Models\User;

use App\Observers\AuditLogObserver;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(UserInterface::class, UserRepository::class);
        $this->app->bind(TaskInterface::class, TaskRepository::class);
        $this->app->bind(TransactionInterface::class, TransactionRepository::class);

        // audit observer

    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Task::observe(AuditLogObserver::class);
        Transaction::observe(AuditLogObserver::class);
        User::observe(AuditLogObserver::class);
    }
}
