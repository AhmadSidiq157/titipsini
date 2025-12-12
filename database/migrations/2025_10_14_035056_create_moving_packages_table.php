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
        Schema::create('moving_packages', function (Blueprint $table) {
            $table->id();
            
            // Info Dasar Paket
            $table->string('name'); // Contoh: "Paket Hemat (Dalam Kota)"
            $table->text('description'); // Penjelasan singkat
            $table->json('features'); // List fitur (array JSON)

            // [MODIFIKASI UTAMA: LOGIKA HARGA & JARAK]
            $table->bigInteger('price'); // Harga Dasar (Base Price)
            $table->bigInteger('price_per_km')->default(0); // Harga per KM tambahan
            $table->integer('max_distance')->nullable(); // Batas Jarak Maksimal (KM). Null = Tidak terbatas.

            // Badge & Timestamp
            $table->boolean('popular')->default(false); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('moving_packages');
    }
};