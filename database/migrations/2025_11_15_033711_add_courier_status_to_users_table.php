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
        Schema::table('users', function (Blueprint $table) {
            // Kita akan definisikan 3 status:
            // available: Kurir sedang standby
            // on_delivery: Kurir sedang mengantar pesanan
            // offline: Kurir sedang tidak aktif
            $table->string('courier_status')->default('offline')->after('password');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('courier_status');
        });
    }
};
