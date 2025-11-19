<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('courier_verifications', function (Blueprint $table) {
            // Tambahkan kolom Tipe Kendaraan
            // Kita taruh setelah user_id agar rapi
            $table->string('vehicle_type')->after('user_id'); // Cth: Motor, Mobil, Pickup, Blind Van

            // Tambahkan kolom Foto STNK
            $table->string('foto_stnk_path')->after('foto_sim_path');
        });
    }

    public function down(): void
    {
        Schema::table('courier_verifications', function (Blueprint $table) {
            $table->dropColumn(['vehicle_type', 'foto_stnk_path']);
        });
    }
};
