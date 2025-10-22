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
        Schema::create('internship_positions', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('category'); // e.g., Operations, Marketing
            $table->string('type')->default('Full-time');
            $table->text('description');
            $table->string('location');
            $table->string('duration'); // e.g., 3-6 Bulan
            $table->integer('slots'); // e.g., 3 posisi
            $table->date('deadline');
            $table->json('requirements');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('internship_positions');
    }
};
