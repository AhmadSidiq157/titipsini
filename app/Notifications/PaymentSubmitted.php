<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use App\Models\Order;

class PaymentSubmitted extends Notification
{
    use Queueable;

    public $order;

    // Kita terima data Order saat notifikasi dibuat
    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    // Tentukan media pengiriman: simpan ke DATABASE
    public function via($notifiable)
    {
        return ['database'];
    }

    // Susunan data yang akan disimpan ke database
    public function toArray($notifiable)
    {
        return [
            'order_id' => $this->order->id,
            'title' => 'Pembayaran Baru Masuk 💰',
            'message' => 'Order #' . $this->order->id . ' menunggu verifikasi pembayaran.',
            // Sesuaikan route ini dengan nama route detail order admin kamu
            // Jika belum ada, bisa diganti null dulu atau sesuaikan nanti
            'link' => '/admin/orders/' . $this->order->id, 
            'type' => 'info'
        ];
    }
}