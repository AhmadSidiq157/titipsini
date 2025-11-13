<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Jalankan migrasi untuk membuat tabel branches.
     */
    public function up(): void
    {
        Schema::create('branches', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nama cabang
            $table->text('address'); // Alamat lengkap
            $table->string('phone', 20); // Nomor telepon (dibatasi panjang)
            $table->string('status', 50)->default('Buka'); // Status cabang (misal: Buka / Segera Hadir)
            $table->text('google_maps_embed_url')->nullable(); // Link Google Maps embed
            $table->timestamps();
        });
    }

    /**
     * Rollback migrasi (hapus tabel).
     */
    public function down(): void
    {
        Schema::dropIfExists('branches');
    }
};
