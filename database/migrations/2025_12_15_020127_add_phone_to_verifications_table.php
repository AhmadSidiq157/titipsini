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
        // TARGET TABEL DIUBAH JADI 'user_verifications'
        Schema::table('user_verifications', function (Blueprint $table) {
            // Tambahkan kolom phone setelah id_card_number
            $table->string('phone', 20)->nullable()->after('id_card_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // TARGET TABEL DIUBAH JADI 'user_verifications'
        Schema::table('user_verifications', function (Blueprint $table) {
            $table->dropColumn('phone');
        });
    }
};