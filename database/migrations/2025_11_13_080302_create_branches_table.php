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
        // Kode ini sekarang COCOK dengan BranchController Anda
        Schema::create('branches', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('address');
            $table->string('phone', 25)->nullable();

            // [PERBAIKAN] Menggunakan string('status') agar cocok dengan controller
            $table->string('status')->default('Buka'); // Misal: Buka, Tutup, Segera Hadir

            $table->text('google_maps_embed_url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('branches');
    }
};
