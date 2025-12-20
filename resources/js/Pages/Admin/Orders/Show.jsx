// resources/js/Pages/Admin/Orders/Show.jsx

import React, { useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { ArrowRight, MessageCircle, MapPin } from "lucide-react"; // Tambah Icon MapPin
import { Toaster, toast } from "react-hot-toast";

// Import komponen-komponen kecil
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
    // 1. Ambil data flash message
    const { flash } = usePage().props;

    // 2. Ambil detail form user
    const details = order.user_form_details || {};
    const needsPickup = details.delivery_method === "pickup";

    // [BARU] Cek apakah ada data koordinat untuk ditampilkan di peta
    const hasCoordinates = details.latitude && details.longitude;
    // Khusus Pindahan (Ada Origin & Destination)
    const isMovingService =
        order.orderable_type && order.orderable_type.includes("MovingPackage");
    const hasMovingCoordinates =
        details.origin_latitude && details.destination_latitude;

    // 3. Logika Tombol "Assign Courier"
    const canAssignCourier =
        needsPickup &&
        [
            "awaiting_verification",
            "verified",
            "ready_for_pickup",
            "processing",
        ].includes(order.status);

    // 4. Effect Toast Notification
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

            <Toaster />

            <div className="min-h-screen bg-gray-50/50 pb-20">
                {/* --- BAGIAN 1: HEADER --- */}
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
                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                    <span>
                                        {new Date(
                                            order.created_at
                                        ).toLocaleString("id-ID", {
                                            dateStyle: "full",
                                            timeStyle: "short",
                                        })}
                                    </span>
                                    {/* [BARU] Label Jarak jika ada */}
                                    {details.distance_km > 0 && (
                                        <>
                                            <span>•</span>
                                            <span className="flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                                                <MapPin size={10} />{" "}
                                                {details.distance_km} KM
                                            </span>
                                        </>
                                    )}
                                </div>
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
                                    rel="noopener noreferrer"
                                    className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 border border-emerald-200 transition"
                                    title="Chat WhatsApp User"
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

                {/* --- BAGIAN 2: STEPPER --- */}
                <OrderStepper status={order.status} needsPickup={needsPickup} />

                {/* --- BAGIAN 3: KONTEN UTAMA --- */}
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                        {/* KOLOM KIRI (7/12): Detail Informasi */}
                        <div className="xl:col-span-7 space-y-6">
                            {/* Kita passing properti tambahan ke OrderDetailsBox 
                                agar dia tau ada koordinat yang perlu ditampilkan.
                            */}
                            <OrderDetailsBox
                                order={order}
                                hasCoordinates={hasCoordinates}
                                hasMovingCoordinates={hasMovingCoordinates}
                                isMovingService={isMovingService}
                            />
                        </div>

                        {/* KOLOM KANAN (5/12): Aksi & Status Logistik */}
                        <div className="xl:col-span-5 space-y-6">
                            {/* Panel Verifikasi Pembayaran */}
                            {order.status === "awaiting_verification" && (
                                <PaymentVerificationBox order={order} />
                            )}

                            {/* Panel Pilih Kurir */}
                            {canAssignCourier && (
                                <CourierAssignmentBox
                                    order={order}
                                    couriers={couriers}
                                />
                            )}

                            {/* Panel Status Gudang */}
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
