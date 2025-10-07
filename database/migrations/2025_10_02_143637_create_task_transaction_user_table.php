<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTaskTransactionUserTable extends Migration
{
    public function up()
    {
        Schema::create('task_transaction_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transaction_id')->constrained('transactions')->onDelete('cascade');
            $table->foreignId('task_id')->constrained('todos')->onDelete('cascade');
            $table->foreignId('from_user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('to_user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['transaction_id', 'from_user_id', 'to_user_id'], 'txn_from_to_unique');
        });
    }

    public function down()
    {
        Schema::dropIfExists('task_transaction_user');
    }
}
