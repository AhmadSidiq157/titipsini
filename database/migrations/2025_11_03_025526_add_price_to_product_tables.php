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
        // Menambahkan kolom harga ke tabel services
        Schema::table('services', function (Blueprint $table) {
            $table->bigInteger('price')->after('description')->default(0);
        });

        // Menambahkan kolom harga ke tabel moving_packages
        Schema::table('moving_packages', function (Blueprint $table) {
            $table->bigInteger('price')->after('description')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn('price');
        });

        Schema::table('moving_packages', function (Blueprint $table) {
            $table->dropColumn('price');
        });
    }
};
