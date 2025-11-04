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
        // Tabel untuk mencatat pesanan utama
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            // Ini adalah 'polymorphic relationship'
            // 'orderable' bisa berupa Model 'Service' atau 'MovingPackage'
            $table->morphs('orderable');

            $table->bigInteger('final_amount'); // Harga final (disalin dari harga produk saat itu)
            $table->text('user_form_details')->nullable(); // JSON untuk data form (cth: tgl mulai, tgl akhir, dll)

            // Status pesanan
            $table->string('status')->default('pending'); // cth: pending, awaiting_payment, awaiting_verification, completed, cancelled

            $table->timestamps();
        });

        // Tabel untuk menyimpan bukti pembayaran manual
        Schema::create('manual_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Siapa yg upload

            $table->string('payment_proof_path'); // Path ke gambar screenshot
            $table->text('notes')->nullable(); // Catatan dari user (cth: "Sudah transfer dari BCA a/n Budi")
            $table->string('status')->default('pending_verification'); // cth: pending_verification, verified, rejected

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('manual_payments');
        Schema::dropIfExists('orders');
    }
};
