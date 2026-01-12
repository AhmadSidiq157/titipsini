<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use App\Models\Order;

class OrderStatusNotification extends Notification
{
    use Queueable;

    public $order;
    public $statusType; // 'approved', 'rejected', 'completed', 'pickup_ready'

    public function __construct(Order $order, $statusType)
    {
        $this->order = $order;
        $this->statusType = $statusType;
    }

    // PENTING: Simpan ke database agar muncul di lonceng
    public function via($notifiable)
    {
        return ['database']; 
    }

    // Format data yang disimpan ke database
    public function toArray($notifiable)
    {
        $title = 'Update Pesanan #' . $this->order->id;
        $message = 'Status pesanan Anda telah diperbarui.';
        
        // Link default ke detail history user
        $link = route('history.show', $this->order->id); 

        // Tentukan pesan berdasarkan status
        switch ($this->statusType) {
            case 'approved':
                $message = 'Pembayaran diterima. Pesanan sedang diproses.';
                break;
            case 'rejected':
                $message = 'Pembayaran ditolak. Mohon cek kembali bukti pembayaran.';
                break;
            case 'pickup_ready':
                $message = 'Kurir telah ditugaskan dan sedang menuju lokasi penjemputan.';
                break;
            case 'completed':
                $message = 'Pesanan selesai. Terima kasih telah menggunakan jasa kami!';
                break;
        }

        return [
            'title'    => $title,
            'message'  => $message,
            'order_id' => $this->order->id,
            'link'     => $link,
            'type'     => 'order_status' // Identitas tipe notifikasi
        ];
    }
}