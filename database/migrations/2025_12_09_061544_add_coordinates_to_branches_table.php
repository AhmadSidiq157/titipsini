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
        Schema::table('branches', function (Blueprint $table) {
            // Menambahkan kolom latitude (garis lintang)
            // Total 10 digit, 8 di belakang koma (presisi tinggi)
            $table->decimal('latitude', 10, 8)->nullable()->after('address');

            // Menambahkan kolom longitude (garis bujur)
            // Total 11 digit, 8 di belakang koma
            $table->decimal('longitude', 11, 8)->nullable()->after('latitude');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('branches', function (Blueprint $table) {
            // Menghapus kolom jika rollback
            $table->dropColumn(['latitude', 'longitude']);
        });
    }
};