<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('order_trackings', function (Blueprint $table) {
            if (!Schema::hasColumn('order_trackings', 'evidence_photo_path')) {
                // Menambahkan kolom untuk menyimpan path foto bukti
                // Ditaruh setelah kolom description agar rapi
                $table->string('evidence_photo_path')->nullable()->after('description');
            }
        });
    }

    public function down(): void
    {
        Schema::table('order_trackings', function (Blueprint $table) {
            if (Schema::hasColumn('order_trackings', 'evidence_photo_path')) {
                $table->dropColumn('evidence_photo_path');
            }
        });
    }
};
