<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_verifications', function (Blueprint $table) {
            $table->id();

            // Relasi one-to-one ke user. 
            // unique() memastikan 1 user hanya punya 1 data verifikasi.
            $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');

            $table->string('legal_name'); // Nama lengkap sesuai KTP
            $table->string('id_card_type'); // 'KTP', 'SIM', atau 'Passport'
            $table->string('id_card_number'); // NIK atau No. SIM
            $table->string('id_card_path'); // Path ke file foto KTP/SIM
            $table->text('address_on_id'); // Alamat sesuai KTP
            $table->string('gender'); // 'laki-laki' atau 'perempuan'

            // Status verifikasi oleh admin
            $table->string('status')->default('pending'); // pending, approved, rejected

            $table->text('rejection_notes')->nullable(); // Alasan jika admin me-reject

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_verifications');
    }
};
