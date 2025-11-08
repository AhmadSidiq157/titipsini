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
        Schema::create('courier_verifications', function (Blueprint $table) {
            $table->id();

            // Relasi ke user (kurir)
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            // Data Kendaraan
            $table->string('vehicle_brand'); // Mis: Honda, Yamaha
            $table->string('vehicle_model'); // Mis: Vario 150, NMAX
            $table->string('plat_nomor')->unique(); // Plat Nomor
            $table->string('no_bpkb')->unique(); // Nomor BPKB

            // Data Identitas
            $table->string('no_sim')->unique(); // Nomor SIM

            // Path Penyimpanan File
            $table->string('foto_ktp_path');
            $table->string('foto_sim_path');
            $table->string('foto_kendaraan_path');

            // Status Verifikasi
            $table->string('status')->default('pending'); // pending, approved, rejected
            $table->text('rejection_reason')->nullable(); // Alasan jika ditolak admin

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courier_verifications');
    }
};
