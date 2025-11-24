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
        Schema::table('manual_payments', function (Blueprint $table) {
            // Cek apakah kolom 'amount' belum ada, jika belum maka tambahkan
            if (!Schema::hasColumn('manual_payments', 'amount')) {
                $table->decimal('amount', 15, 2)->nullable()->after('payment_proof_path');
            }

            // (Opsional) Jaga-jaga jika kolom lain juga hilang
            if (!Schema::hasColumn('manual_payments', 'notes')) {
                $table->text('notes')->nullable()->after('amount');
            }
            if (!Schema::hasColumn('manual_payments', 'status')) {
                $table->string('status')->default('pending_verification')->after('notes');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('manual_payments', function (Blueprint $table) {
            if (Schema::hasColumn('manual_payments', 'amount')) {
                $table->dropColumn('amount');
            }
        });
    }
};
