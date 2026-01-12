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
        Schema::create('order_trackings', function (Blueprint $table) {
            $table->id();
            
            // Relasi ke tabel orders. Jika order dihapus, tracking ikut terhapus (cascade)
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            
            // Status Tracking (Contoh: 'PICKUP SUCCESS', 'OTW', 'COMPLETED')
            $table->string('status'); 
            
            // Deskripsi atau Catatan dari Kurir (Boleh kosong/null)
            $table->text('description')->nullable(); 
            
            // [PENTING] Path Foto Bukti (Boleh kosong/null karena tidak semua status butuh foto)
            $table->string('evidence_photo_path')->nullable(); 
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_trackings');
    }
};