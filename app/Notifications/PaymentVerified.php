<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use App\Models\Order;

class PaymentVerified extends Notification
{
    use Queueable;

    public $order;

    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return [
            'order_id' => $this->order->id,
            'title' => 'Pembayaran Diterima! 🎉',
            'message' => 'Pembayaran untuk Order #' . $this->order->id . ' telah diverifikasi admin.',
            // Link menuju detail order di sisi user
            'link' => '/orders/' . $this->order->id, 
            'type' => 'success'
        ];
    }
}