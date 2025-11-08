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
        Schema::table('orders', function (Blueprint $table) {
            // Tambahkan kolom courier_id setelah kolom user_id (atau sesuaikan)
            $table->foreignId('courier_id')
                ->nullable() // Boleh null, karena awalnya order belum di-assign
                ->after('user_id')
                ->constrained('users') // Foreign key ke tabel 'users'
                ->onDelete('set null'); // Jika kurir dihapus, ordernya tidak ikut terhapus
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Hapus foreign key constraint dulu
            $table->dropForeign(['courier_id']);
            // Hapus kolomnya
            $table->dropColumn('courier_id');
        });
    }
};
