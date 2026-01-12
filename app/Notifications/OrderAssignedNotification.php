<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Order;

class OrderAssignedNotification extends Notification
{
    use Queueable;

    public $order;
    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    /**
     * Get the notification's delivery channels.
     * Saat ini kita fokus ke 'database' (Lonceng Notifikasi).
     * Jika SMTP email sudah siap, tambahkan 'mail' ke dalam array.
     */
    public function via(object $notifiable): array
    {
        return ['database']; 
        // return ['database', 'mail']; // Aktifkan baris ini jika ingin kirim email juga
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        // Menggunakan helper route() agar URL otomatis benar sesuai settingan Laravel
        $url = route('courier.orders.show', $this->order->id);
        
        // Mengambil nama layanan (misal: "Paket Pindahan Rumah" atau "Service AC")
        $serviceName = $this->order->orderable->name ?? 'Layanan Titipsini';

        return (new MailMessage)
                    ->subject('Tugas Baru: Order #' . $this->order->id)
                    ->greeting('Halo ' . $notifiable->name . ',')
                    ->line('Anda telah ditugaskan oleh Admin untuk menangani pesanan baru.')
                    ->line('Jenis Pekerjaan: ' . $serviceName)
                    ->action('Lihat Detail Tugas', $url)
                    ->line('Segera lakukan penjemputan atau pemrosesan. Semangat!');
    }

    /**
     * Get the array representation of the notification.
     * Data ini yang akan masuk ke tabel 'notifications' dan muncul di Lonceng Frontend.
     */
    public function toArray(object $notifiable): array
    {
        // Ambil nama layanan agar info di lonceng lebih jelas
        $serviceName = $this->order->orderable->name ?? 'Layanan';

        return [
            'order_id' => $this->order->id,
            'title'    => 'Tugas Baru Masuk!',
            // Pesan: "Admin menugaskan Anda untuk Order #12 (Pindahan Kos)"
            'message'  => "Admin menugaskan Anda untuk Order #{$this->order->id} ({$serviceName})",
            'type'     => 'courier_assigned', 
            'link'     => route('courier.orders.show', $this->order->id),
        ];
    }
}