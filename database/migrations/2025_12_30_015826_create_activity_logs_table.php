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
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            
            // Kolom untuk mencatat ID User yang melakukan aksi (bisa null jika tamu/sistem)
            // 'constrained' akan otomatis menghubungkan ke tabel 'users'
            // 'onDelete set null' artinya jika user dihapus, log-nya tetap ada tapi user_id jadi null
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            
            // Kolom judul aksi, misal: "LOGIN", "CREATE_ORDER"
            $table->string('action');
            
            // Kolom deskripsi detail, pakai text biar muat banyak
            $table->text('description')->nullable();
            
            // Kolom alamat IP pengguna
            $table->string('ip_address')->nullable();
            
            // Kolom info browser/device pengguna
            $table->string('user_agent')->nullable();
            
            // Kolom data tambahan (format JSON), misal data sebelum vs sesudah edit
            $table->json('properties')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};