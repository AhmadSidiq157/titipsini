<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('internship_projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('category'); // e.g., Operations Project
            $table->text('description');
            $table->json('learnings'); // Untuk "Yang Akan Dipelajari"
            $table->string('duration');
            $table->string('team_size');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('internship_projects');
    }
};
