// resources/js/Pages/Admin/Orders/Show.jsx

import React, { useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

// Import komponen-komponen kecil (memisahkan UI agar kode ini tidak berantakan)
import {
    getStatusLabel,
    OrderStepper,
    OrderDetailsBox,
    PaymentVerificationBox,
    CourierAssignmentBox,
    StorageStatusBox,
    TrackingHistoryBox,
    CopyButton,
} from "./OrderComponents";

export default function Show({ auth, order, couriers }) {
    // 1. Ambil data flash message dari backend (untuk notifikasi sukses/gagal)
    const { flash } = usePage().props;

    // 2. Ambil detail form user & tentukan apakah butuh penjemputan
    const details = order.user_form_details || {};
    const needsPickup = details.delivery_method === "pickup";

    // 3. Logika: Kapan tombol "Assign Courier" boleh muncul?
    // Hanya jika butuh pickup DAN statusnya masih dalam tahap awal/proses
    const canAssignCourier =
        needsPickup &&
        [
            "awaiting_verification",
            "verified",
            "ready_for_pickup",
            "processing",
        ].includes(order.status);

    // 4. Effect: Memunculkan Toast Popup saat ada pesan dari backend
    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success, {
                duration: 4000,
                position: "top-center",
                style: {
                    background: "#10B981",
                    color: "#fff",
                    borderRadius: "12px",
                },
            });
        }
        if (flash.error) {
            toast.error(flash.error, { position: "top-center" });
        }
    }, [flash]);

    return (
        <AdminLayout user={auth.user}>
            <Head title={`Order #${order.id}`} />

            {/* Tempat munculnya notifikasi toast */}
            <Toaster />

            <div className="min-h-screen bg-gray-50/50 pb-20">
                {/* --- BAGIAN 1: HEADER (Judul, ID, Status) --- */}
                <div className="bg-white border-b border-gray-200 sticky top-0 z-30 px-6 py-4 shadow-sm">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                        {/* Tombol Kembali & Judul */}
                        <div className="flex items-center w-full md:w-auto">
                            <Link
                                href={route("admin.orders.index")}
                                className="p-2 mr-3 rounded-full hover:bg-gray-100 text-gray-500 transition"
                            >
                                <ArrowRight size={20} className="rotate-180" />
                            </Link>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-xl font-bold text-gray-800">
                                        Order #{order.id}
                                    </h2>
                                    <CopyButton
                                        text={`#${order.id}`}
                                        label="Salin ID"
                                    />
                                </div>
                                <p className="text-xs text-gray-500">
                                    {new Date(order.created_at).toLocaleString(
                                        "id-ID",
                                        {
                                            dateStyle: "full",
                                            timeStyle: "short",
                                        }
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Tombol WhatsApp & Badge Status */}
                        <div className="flex items-center gap-3">
                            {details.phone && (
                                <a
                                    href={`https://wa.me/${details.phone
                                        .replace(/\D/g, "")
                                        .replace(/^0/, "62")}`}
                                    target="_blank"
                                    className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 border border-emerald-200 transition"
                                    title="Chat WhatsApp"
                                >
                                    <MessageCircle size={20} />
                                </a>
                            )}
                            <div className="h-8 w-px bg-gray-300 mx-2"></div>
                            <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase bg-gray-100 text-gray-700 border border-gray-200">
                                {getStatusLabel(order.status)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* --- BAGIAN 2: STEPPER (Progress Bar) --- */}
                <OrderStepper status={order.status} needsPickup={needsPickup} />

                {/* --- BAGIAN 3: KONTEN UTAMA (Grid Layout) --- */}
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                        {/* KOLOM KIRI (7/12): Detail Informasi Pesanan */}
                        <div className="xl:col-span-7 space-y-6">
                            <OrderDetailsBox order={order} />
                        </div>

                        {/* KOLOM KANAN (5/12): Aksi & Status Logistik */}
                        <div className="xl:col-span-5 space-y-6">
                            {/* Panel Verifikasi Pembayaran (Muncul jika status menunggu verifikasi) */}
                            {order.status === "awaiting_verification" && (
                                <PaymentVerificationBox order={order} />
                            )}

                            {/* Panel Pilih Kurir (Muncul jika butuh kurir) */}
                            {canAssignCourier && (
                                <CourierAssignmentBox
                                    order={order}
                                    couriers={couriers}
                                />
                            )}

                            {/* Panel Status Gudang & Penyelesaian */}
                            <StorageStatusBox order={order} />

                            {/* Panel Riwayat Tracking */}
                            <TrackingHistoryBox order={order} />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
