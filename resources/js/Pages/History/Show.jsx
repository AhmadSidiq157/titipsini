import React, { useState, useEffect } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, usePage, router } from "@inertiajs/react"; // [UPDATE] Import usePage
import LiveMap from "@/Components/LiveMap";
import axios from "axios";
import {
    ArrowLeft,
    Box,
    Calendar,
    Check,
    Clock,
    FileText,
    MapPin,
    Package,
    Phone,
    Truck,
    User,
    ShieldCheck,
    Map as MapIcon,
    MessageCircle,
    HelpCircle, // [BARU] Tambah ikon
} from "lucide-react";

const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number || 0);
};

// --- 1. KOMPONEN LIVE TRACKING ---
const LiveTrackingBox = ({ order }) => {
    if (!order.courier) return null;

    const [courierPos, setCourierPos] = useState({
        lat: order.courier.latitude ? parseFloat(order.courier.latitude) : null,
        lng: order.courier.longitude
            ? parseFloat(order.courier.longitude)
            : null,
    });

    const isLive = ["on_delivery", "picked_up", "ready_for_pickup"].includes(
        order.status
    );

    useEffect(() => {
        if (!isLive) return;
        // Polling sederhana untuk refresh halaman parsial (agar data kurir terupdate)
        // Idealnya menggunakan endpoint API JSON khusus seperti di Admin
        const interval = setInterval(() => {
            router.reload({ only: ["order"], preserveScroll: true });
        }, 5000);
        return () => clearInterval(interval);
    }, [isLive]);

    const hasCoordinates = courierPos.lat && courierPos.lng;

    return (
        <div className="bg-white rounded-3xl p-1 shadow-lg border border-blue-100 mb-8 overflow-hidden">
            <div className="p-4 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <MapIcon className="w-5 h-5 mr-2 text-blue-600" />
                    Live Tracking
                </h3>
                {isLive ? (
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full border border-green-200">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
                        </span>
                        <span className="text-xs font-bold text-green-700 uppercase">
                            Aktif
                        </span>
                    </div>
                ) : (
                    <span className="text-xs text-gray-400 font-medium bg-gray-100 px-3 py-1 rounded-full">
                        Offline
                    </span>
                )}
            </div>
            <div className="h-80 w-full relative z-0">
                {hasCoordinates ? (
                    <LiveMap
                        courierLat={courierPos.lat}
                        courierLng={courierPos.lng}
                    />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                        <MapIcon className="w-10 h-10 mb-2 opacity-20" />
                        <p>Menunggu sinyal lokasi kurir...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- 2. KOMPONEN INFO KURIR (Hubungi Kurir) ---
const CourierInfoCard = ({ courier }) => {
    if (!courier) return null;
    const verif = courier.courier_verification || {};

    // Helper link WA Kurir
    const courierWa = courier.phone
        ? `https://wa.me/${courier.phone
              .replace(/\D/g, "")
              .replace(/^0/, "62")}`
        : "#";

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Truck className="w-5 h-5 mr-2 text-gray-500" />
                Kurir Anda
            </h3>
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-600 border-2 border-white shadow-sm">
                    {courier.name.charAt(0)}
                </div>
                <div>
                    <p className="font-bold text-lg text-gray-900">
                        {courier.name}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 gap-3 mt-1">
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 border border-gray-200">
                            {verif.plat_nomor || "Plat -"}
                        </span>
                        <span>
                            {verif.vehicle_model || "Kendaraan"} (
                            {verif.vehicle_type || "-"})
                        </span>
                    </div>
                </div>
            </div>

            {/* Tombol Kontak KURIR */}
            <div className="mt-6 grid grid-cols-2 gap-3">
                <a
                    href={courierWa}
                    target="_blank"
                    className="flex items-center justify-center py-2.5 bg-green-50 text-green-700 rounded-xl font-semibold hover:bg-green-100 transition"
                >
                    <MessageCircle className="w-4 h-4 mr-2" /> Chat WA
                </a>
                <a
                    href={`tel:${courier.phone}`}
                    className="flex items-center justify-center py-2.5 bg-gray-50 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition"
                >
                    <Phone className="w-4 h-4 mr-2" /> Telepon
                </a>
            </div>
        </div>
    );
};

// --- 3. KOMPONEN TIMELINE ---
const Timeline = ({ trackings }) => {
    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-gray-500" />
                Riwayat Perjalanan
            </h3>
            <div className="relative pl-4 border-l-2 border-gray-100 space-y-8 ml-2">
                {trackings.length > 0 ? (
                    trackings.map((log, index) => (
                        <div key={log.id} className="relative">
                            <div
                                className={`absolute -left-[21px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm 
                            ${
                                index === 0
                                    ? "bg-green-500 ring-4 ring-green-100"
                                    : "bg-gray-300"
                            }`}
                            ></div>
                            <div>
                                <p className="text-xs text-gray-400 mb-1">
                                    {new Date(log.created_at).toLocaleString(
                                        "id-ID",
                                        {
                                            day: "numeric",
                                            month: "short",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        }
                                    )}
                                </p>
                                <p
                                    className={`text-sm font-medium ${
                                        index === 0
                                            ? "text-gray-900 font-bold"
                                            : "text-gray-600"
                                    }`}
                                >
                                    {log.description}
                                </p>
                                <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-gray-100 rounded text-gray-500">
                                    {log.status}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 text-sm italic">
                        Belum ada riwayat perjalanan.
                    </p>
                )}
            </div>
        </div>
    );
};

// --- 4. [BARU] KOMPONEN BANTUAN ADMIN ---
const AdminHelpCard = () => {
    // Ambil settings global untuk dapat nomor Admin
    const { settings } = usePage().props;

    // Format nomor Admin
    const adminPhone = settings.contact_phone
        ? settings.contact_phone.replace(/\D/g, "")
        : "";
    const adminWaTarget = adminPhone.startsWith("0")
        ? "62" + adminPhone.slice(1)
        : adminPhone;
    const adminLink = `https://wa.me/${adminWaTarget}?text=${encodeURIComponent(
        "Halo Admin, saya butuh bantuan terkait pesanan saya."
    )}`;

    return (
        <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100 text-center">
            <p className="text-blue-800 font-medium mb-2 flex items-center justify-center">
                <HelpCircle className="w-5 h-5 mr-2" />
                Butuh Bantuan CS?
            </p>
            <p className="text-xs text-blue-600 mb-4 px-4">
                Jika ada kendala dengan pesanan atau kurir, hubungi kami
                langsung.
            </p>
            <a
                href={adminLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-2.5 bg-white text-blue-600 font-bold rounded-xl shadow-sm hover:bg-blue-100 transition"
            >
                Hubungi Admin
            </a>
        </div>
    );
};

export default function Show({ auth, order }) {
    const details = order.user_form_details || {};
    const isPindahan = !!details.alamat_penjemputan;

    return (
        <>
            <Head title={`Pesanan #${order.id}`} />

            <div className="min-h-screen bg-gray-50/50 py-12 md:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                    {/* Header Navigasi */}
                    <div className="flex items-center mb-8">
                        <Link
                            href={route("history.index")}
                            className="p-2 bg-white rounded-full shadow-sm border border-gray-200 hover:bg-gray-50 mr-4 text-gray-600"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-extrabold text-gray-900">
                                Detail Pesanan #{order.id}
                            </h1>
                            <p className="text-sm text-gray-500">
                                Lihat detail lengkap dan lacak pesanan Anda.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* --- KOLOM KIRI (UTAMA) --- */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* 1. PETA LIVE (Hanya untuk Pindahan yang aktif) */}
                            {isPindahan &&
                                [
                                    "ready_for_pickup",
                                    "picked_up",
                                    "on_delivery",
                                ].includes(order.status) && (
                                    <LiveTrackingBox order={order} />
                                )}

                            {/* 2. DETAIL PESANAN */}
                            <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                                <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-100">
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">
                                            Layanan
                                        </p>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            {order.orderable.name ||
                                                order.orderable.title}
                                        </h2>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">
                                            Total Biaya
                                        </p>
                                        <p className="text-xl font-extrabold text-green-600">
                                            {formatRupiah(order.final_amount)}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Informasi Klien */}
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                                            <User
                                                size={18}
                                                className="mr-2 text-gray-400"
                                            />{" "}
                                            Data Pemesan
                                        </h4>
                                        <ul className="space-y-3 text-sm text-gray-600">
                                            <li>
                                                <span className="block text-xs text-gray-400">
                                                    Nama:
                                                </span>{" "}
                                                {auth.user.name}
                                            </li>
                                            <li>
                                                <span className="block text-xs text-gray-400">
                                                    Email:
                                                </span>{" "}
                                                {auth.user.email}
                                            </li>
                                            <li>
                                                <span className="block text-xs text-gray-400">
                                                    Telepon:
                                                </span>{" "}
                                                {details.telepon ||
                                                    auth.user.phone}
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Informasi Detail (Dinamis Pindahan/Penitipan) */}
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                                            {isPindahan ? (
                                                <Truck
                                                    size={18}
                                                    className="mr-2 text-gray-400"
                                                />
                                            ) : (
                                                <Box
                                                    size={18}
                                                    className="mr-2 text-gray-400"
                                                />
                                            )}
                                            {isPindahan
                                                ? "Rute Pindahan"
                                                : "Info Penitipan"}
                                        </h4>

                                        {isPindahan ? (
                                            <div className="space-y-4 relative pl-3 border-l-2 border-dashed border-gray-200">
                                                <div className="relative">
                                                    <div className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-white"></div>
                                                    <p className="text-xs text-blue-500 font-bold uppercase mb-1">
                                                        Dari
                                                    </p>
                                                    <p className="text-sm text-gray-800">
                                                        {
                                                            details.alamat_penjemputan
                                                        }
                                                    </p>
                                                </div>
                                                <div className="relative">
                                                    <div className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-green-500 ring-4 ring-white"></div>
                                                    <p className="text-xs text-green-500 font-bold uppercase mb-1">
                                                        Ke
                                                    </p>
                                                    <p className="text-sm text-gray-800">
                                                        {details.alamat_tujuan}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <ul className="space-y-3 text-sm text-gray-600">
                                                <li>
                                                    <span className="block text-xs text-gray-400">
                                                        Mulai:
                                                    </span>{" "}
                                                    {details.start_date}
                                                </li>
                                                <li>
                                                    <span className="block text-xs text-gray-400">
                                                        Selesai:
                                                    </span>{" "}
                                                    {details.end_date}
                                                </li>
                                                {details.delivery_method && (
                                                    <li>
                                                        <span className="block text-xs text-gray-400">
                                                            Metode:
                                                        </span>{" "}
                                                        {details.delivery_method ===
                                                        "pickup"
                                                            ? "Dijemput Kurir"
                                                            : "Antar Sendiri"}
                                                    </li>
                                                )}
                                            </ul>
                                        )}
                                    </div>
                                </div>

                                {details.notes && (
                                    <div className="mt-8 p-4 bg-gray-50 rounded-xl text-sm text-gray-600 italic border border-gray-100">
                                        <span className="font-bold not-italic block mb-1 text-gray-400 text-xs uppercase">
                                            Catatan Tambahan:
                                        </span>
                                        "{details.notes}"
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* --- KOLOM KANAN (SIDEBAR) --- */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Info Kurir (Hubungi Kurir) */}
                            <CourierInfoCard courier={order.courier} />

                            {/* Timeline Tracking */}
                            <Timeline trackings={order.trackings} />

                            {/* Status Pembayaran */}
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                    <ShieldCheck className="w-5 h-5 mr-2 text-gray-500" />
                                    Status Pembayaran
                                </h3>
                                <div
                                    className={`p-4 rounded-xl text-center font-bold ${
                                        order.status === "awaiting_payment"
                                            ? "bg-yellow-50 text-yellow-700"
                                            : order.status ===
                                              "awaiting_verification"
                                            ? "bg-blue-50 text-blue-700"
                                            : "bg-green-50 text-green-700"
                                    }`}
                                >
                                    {order.status
                                        .replace("_", " ")
                                        .toUpperCase()}
                                </div>
                                {order.status === "awaiting_payment" && (
                                    <Link
                                        href={route("order.payment", order.id)}
                                        className="block w-full mt-4 py-3 bg-green-600 text-white font-bold text-center rounded-xl hover:bg-green-700 transition shadow-lg shadow-green-200"
                                    >
                                        Bayar Sekarang
                                    </Link>
                                )}
                            </div>

                            {/* [BARU] Kotak Bantuan Admin (Hubungi CS) */}
                            <AdminHelpCard />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Show.layout = (page) => <GuestLayout children={page} />;
