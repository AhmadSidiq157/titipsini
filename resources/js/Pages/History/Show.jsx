import React, { useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react"; // Hapus import AuthenticatedLayout
import Modal from "@/Components/Modal";
import {
    ArrowLeft,
    Box,
    Calendar,
    Check,
    Clock,
    MapPin,
    Phone,
    Truck,
    MessageCircle,
    HelpCircle,
    Copy,
    CheckCircle2,
    Flag,
    ImageIcon,
    X,
    PackageCheck,
    ShieldCheck,
} from "lucide-react";

// --- Helper Functions ---
const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number || 0);
};

const getStatusLabel = (status) => {
    const labels = {
        unpaid: "Belum Bayar",
        awaiting_payment: "Menunggu Bayar",
        awaiting_verification: "Verifikasi Pembayaran",
        verified: "Pembayaran Diterima",
        processing: "Sedang Diproses",
        process: "Diproses",
        ready_for_pickup: "Menunggu Kurir",
        courier_assigned: "Kurir Ditugaskan",
        courier_otw_pickup: "Kurir Menuju Lokasi",
        picked_up: "Paket Diambil Kurir",
        on_delivery: "Sedang Diantar",
        delivered: "Sampai Tujuan",
        completed: "Selesai",
        cancelled: "Dibatalkan",
        rejected: "Ditolak",
    };
    return labels[status] || status.replace(/_/g, " ");
};

const CopyButton = ({ text }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button
            onClick={handleCopy}
            className="text-xs flex items-center gap-1 text-gray-400 hover:text-emerald-600 transition-colors ml-2 bg-gray-50 px-2 py-0.5 rounded border border-gray-200"
        >
            {copied ? <Check size={10} /> : <Copy size={10} />}
            {copied ? "Disalin" : "Salin"}
        </button>
    );
};

const getMapsLink = (address) =>
    address
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              address
          )}`
        : "#";

// --- Image Modal ---
const ImageModal = ({ show, onClose, src, title }) => (
    <Modal show={show} onClose={onClose} maxWidth="4xl">
        <div className="p-2 bg-black rounded-lg relative group">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-all z-20 backdrop-blur-md"
            >
                <X size={24} />
            </button>
            <div className="relative overflow-hidden rounded">
                <img
                    src={src}
                    alt={title}
                    className="w-full h-auto max-h-[85vh] object-contain"
                />
            </div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center pointer-events-none">
                <span className="bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md border border-white/10">
                    {title}
                </span>
            </div>
        </div>
    </Modal>
);

// --- MAIN COMPONENT ---
export default function Show({ auth, order }) {
    const { settings } = usePage().props;

    // Variabel-variabel Penting
    const details = order.user_form_details || {};
    const orderable = order.orderable || {};
    const trackings = order.trackings || [];

    const isPenitipan =
        order.orderable_type?.includes("Service") || !!details.branch_address;
    const needsPickup = details.delivery_method === "pickup";
    const ServiceIcon = isPenitipan ? Box : Truck;

    const notes = details.notes || "-";

    // Kontak Admin
    const adminPhone = settings?.contact_phone
        ? settings.contact_phone.replace(/\D/g, "")
        : "";
    const adminWaTarget = adminPhone.startsWith("0")
        ? "62" + adminPhone.slice(1)
        : adminPhone;
    const adminWaLink = adminWaTarget
        ? `https://wa.me/${adminWaTarget}?text=${encodeURIComponent(
              `Halo Admin, saya butuh bantuan order #${order.id}`
          )}`
        : "#";

    // State untuk Image Modal
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        // Gunakan Fragment <>...</> agar tidak ada wrapper Layout
        <>
            <Head title={`Detail Order #${order.id}`} />

            {/* Container Full Screen */}
            <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans text-gray-800">
                {/* 1. HEADER KHUSUS (Sticky Top) */}
                <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 px-4 md:px-8 py-4 shadow-sm transition-all">
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center w-full md:w-auto">
                            {/* Tombol Kembali ke List History */}
                            <Link
                                href={route("history.index")}
                                className="group p-2 mr-3 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-all active:scale-95"
                            >
                                <ArrowLeft
                                    size={22}
                                    className="group-hover:-translate-x-1 transition-transform"
                                />
                            </Link>

                            {/* Judul & Tanggal */}
                            <div>
                                <div className="flex items-center gap-3">
                                    <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                                        Order #{order.id}
                                    </h2>
                                    <CopyButton text={`#${order.id}`} />
                                </div>
                                <p className="text-xs text-gray-500 font-medium mt-0.5">
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

                        {/* Badge Status di Header */}
                        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                            <span
                                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${
                                    order.status === "completed"
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        : ["cancelled", "rejected"].includes(
                                              order.status
                                          )
                                        ? "bg-red-50 text-red-700 border-red-200"
                                        : "bg-blue-50 text-blue-700 border-blue-200"
                                }`}
                            >
                                {getStatusLabel(order.status)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 2. MAIN CONTENT SCROLLABLE */}
                <div className="flex-1 py-8 overflow-y-auto">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* --- TIMELINE PROGRESS (Horizontal Scroll) --- */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8 overflow-hidden">
                            <div className="overflow-x-auto pb-2 -mb-2 custom-scrollbar">
                                <div className="flex items-center justify-between min-w-[600px] relative px-4 py-4">
                                    {/* Garis Dasar Abu */}
                                    <div className="absolute top-1/2 left-4 right-4 h-1 bg-gray-100 -z-10 rounded-full"></div>

                                    {(() => {
                                        const status = order.status;
                                        const steps = [
                                            {
                                                key: "payment",
                                                label: "Bayar",
                                                icon: Clock,
                                                activeStatuses: [
                                                    "unpaid",
                                                    "awaiting_payment",
                                                ],
                                            },
                                            {
                                                key: "verification",
                                                label: "Verifikasi",
                                                icon: ShieldCheck,
                                                activeStatuses: [
                                                    "paid",
                                                    "awaiting_verification",
                                                    "pending_verification",
                                                ],
                                            },
                                        ];

                                        if (needsPickup) {
                                            steps.push({
                                                key: "pickup",
                                                label: "Jemput",
                                                icon: Truck,
                                                activeStatuses: [
                                                    "ready_for_pickup",
                                                    "courier_assigned",
                                                    "courier_otw_pickup",
                                                ],
                                            });
                                        }

                                        steps.push({
                                            key: "process",
                                            label: "Proses",
                                            icon: Box,
                                            activeStatuses: [
                                                "verified",
                                                "processing",
                                                "process",
                                                "picked_up",
                                                "on_delivery",
                                                "delivery_otw",
                                                "delivered",
                                            ],
                                        });

                                        steps.push({
                                            key: "completed",
                                            label: "Selesai",
                                            icon: PackageCheck,
                                            activeStatuses: [
                                                "completed",
                                                "done",
                                            ],
                                        });

                                        let activeIndex = 0;
                                        const foundIndex = steps.findIndex(
                                            (step) =>
                                                step.activeStatuses.includes(
                                                    status
                                                )
                                        );

                                        if (foundIndex !== -1) {
                                            activeIndex = foundIndex;
                                        } else {
                                            if (
                                                ["completed", "done"].includes(
                                                    status
                                                )
                                            )
                                                activeIndex = steps.length - 1;
                                            else if (
                                                [
                                                    "cancelled",
                                                    "rejected",
                                                ].includes(status)
                                            )
                                                activeIndex = -1;
                                        }

                                        return (
                                            <>
                                                {/* Garis Hijau Progress */}
                                                <div
                                                    className="absolute top-1/2 left-4 h-1 bg-emerald-500 -z-10 rounded-full transition-all duration-1000 ease-out"
                                                    style={{
                                                        width:
                                                            activeIndex === -1
                                                                ? "0%"
                                                                : `${
                                                                      (activeIndex /
                                                                          (steps.length -
                                                                              1)) *
                                                                      100
                                                                  }%`,
                                                    }}
                                                ></div>

                                                {steps.map((step, index) => {
                                                    const isActive =
                                                        index <= activeIndex &&
                                                        activeIndex !== -1;
                                                    const Icon = step.icon;

                                                    return (
                                                        <div
                                                            key={step.key}
                                                            className="flex flex-col items-center gap-3 relative group"
                                                        >
                                                            <div
                                                                className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500 z-10 ${
                                                                    isActive
                                                                        ? "bg-emerald-500 border-emerald-50 text-white shadow-lg shadow-emerald-200 scale-110"
                                                                        : "bg-white border-gray-100 text-gray-300"
                                                                }`}
                                                            >
                                                                <Icon
                                                                    size={20}
                                                                    strokeWidth={
                                                                        isActive
                                                                            ? 2.5
                                                                            : 2
                                                                    }
                                                                />
                                                            </div>
                                                            <span
                                                                className={`text-xs font-bold whitespace-nowrap px-3 py-1 rounded-full transition-colors ${
                                                                    isActive
                                                                        ? "text-emerald-700 bg-emerald-50"
                                                                        : "text-gray-400"
                                                                }`}
                                                            >
                                                                {step.label}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>

                        {/* --- GRID UTAMA (Kiri: Detail, Kanan: Sidebar) --- */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* KOLOM KIRI: Informasi Utama */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* CARD DETAIL PESANAN */}
                                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                    {/* Judul Card */}
                                    <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-100">
                                        <div className="flex items-center gap-5">
                                            <div
                                                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-gray-100 ${
                                                    isPenitipan
                                                        ? "bg-gradient-to-br from-emerald-400 to-emerald-600"
                                                        : "bg-gradient-to-br from-blue-500 to-blue-700"
                                                }`}
                                            >
                                                <ServiceIcon size={28} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">
                                                    Layanan Dipilih
                                                </p>
                                                <h2 className="text-xl font-black text-gray-900 leading-tight">
                                                    {orderable.name ||
                                                        orderable.title}
                                                </h2>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">
                                                Total Biaya
                                            </p>
                                            <p className="text-2xl font-black text-emerald-600 tracking-tight">
                                                {formatRupiah(
                                                    order.final_amount
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        {/* ALAMAT (Timeline Vertical) */}
                                        <div className="bg-[#F8F9FB] rounded-3xl p-6 border border-gray-100 relative overflow-hidden">
                                            {/* Garis Putus-putus */}
                                            <div className="absolute left-[38px] top-12 bottom-12 w-0.5 border-l-2 border-dashed border-gray-300 z-0"></div>

                                            {/* Pickup Point */}
                                            <div className="relative z-10 mb-8 flex items-start gap-5">
                                                <div className="w-5 h-5 rounded-full bg-white border-[5px] border-blue-500 shadow-sm flex-shrink-0 mt-1"></div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">
                                                            Lokasi Jemput
                                                        </p>
                                                    </div>
                                                    <p className="text-sm font-semibold text-gray-800 leading-relaxed">
                                                        {details.alamat_penjemputan ||
                                                            "Tidak tersedia"}
                                                    </p>
                                                    <a
                                                        href={getMapsLink(
                                                            details.alamat_penjemputan
                                                        )}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center mt-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
                                                    >
                                                        <MapPin
                                                            size={12}
                                                            className="mr-1.5"
                                                        />{" "}
                                                        Buka Maps
                                                    </a>
                                                </div>
                                            </div>

                                            {/* Delivery Point */}
                                            <div className="relative z-10 flex items-start gap-5">
                                                <div className="w-5 h-5 rounded-full bg-white border-[5px] border-green-500 shadow-sm flex-shrink-0 mt-1"></div>
                                                <div className="flex-1">
                                                    <p className="text-xs text-green-600 font-bold uppercase tracking-wider mb-1">
                                                        Tujuan Pengiriman
                                                    </p>
                                                    <p className="text-sm font-semibold text-gray-800 leading-relaxed">
                                                        {isPenitipan
                                                            ? details.branch_address
                                                                ? `${details.branch_name} - ${details.branch_address}`
                                                                : "Gudang Cabang"
                                                            : details.alamat_tujuan}
                                                    </p>
                                                    <a
                                                        href={getMapsLink(
                                                            isPenitipan
                                                                ? details.branch_address
                                                                : details.alamat_tujuan
                                                        )}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center mt-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:text-green-600 hover:border-green-200 transition-all shadow-sm"
                                                    >
                                                        <MapPin
                                                            size={12}
                                                            className="mr-1.5"
                                                        />{" "}
                                                        Buka Maps
                                                    </a>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Info Tambahan Grid */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-5 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors shadow-sm">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">
                                                    Jadwal
                                                </p>
                                                <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                                    <Calendar
                                                        size={16}
                                                        className="text-gray-400"
                                                    />
                                                    {details.tanggal_pindahan
                                                        ? new Date(
                                                              details.tanggal_pindahan
                                                          ).toLocaleDateString(
                                                              "id-ID",
                                                              {
                                                                  dateStyle:
                                                                      "full",
                                                              }
                                                          )
                                                        : details.start_date ||
                                                          "-"}
                                                </p>
                                            </div>
                                            <div className="p-5 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors shadow-sm">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">
                                                    Metode
                                                </p>
                                                <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                                    <Truck
                                                        size={16}
                                                        className="text-gray-400"
                                                    />
                                                    {details.delivery_method ===
                                                    "pickup"
                                                        ? "Dijemput Kurir"
                                                        : "Antar Sendiri"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Notes Display */}
                                        {notes && notes !== "-" && (
                                            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100 flex gap-4 items-start">
                                                <div className="mt-1">
                                                    <HelpCircle
                                                        size={18}
                                                        className="text-amber-500"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">
                                                        Catatan Tambahan
                                                    </p>
                                                    <p className="text-sm text-gray-800 italic leading-relaxed">
                                                        "{notes}"
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* KOLOM KANAN: Sidebar Status & Kurir */}
                            <div className="lg:col-span-1 space-y-6">
                                {/* CARD STATUS SAAT INI */}
                                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-500"></div>
                                    <div
                                        className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg ${
                                            order.status === "completed"
                                                ? "bg-emerald-100 text-emerald-600"
                                                : "bg-blue-50 text-blue-600"
                                        }`}
                                    >
                                        {order.status === "completed" ? (
                                            <CheckCircle2 size={40} />
                                        ) : (
                                            <Truck size={40} />
                                        )}
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 mb-2">
                                        {getStatusLabel(order.status)}
                                    </h3>
                                    <p className="text-xs text-gray-500 px-4 leading-relaxed mb-6">
                                        Pantau terus status pesanan Anda di
                                        halaman ini.
                                    </p>

                                    {order.status === "awaiting_payment" && (
                                        <Link
                                            href={route(
                                                "order.payment",
                                                order.id
                                            )}
                                            className="block w-full py-3.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-black shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                                        >
                                            Bayar Sekarang
                                        </Link>
                                    )}
                                </div>

                                {/* CARD INFO KURIR (Jika Ada) */}
                                {order.courier && (
                                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-sm font-bold text-gray-900 flex items-center uppercase tracking-wider">
                                                <Truck className="w-4 h-4 mr-2 text-gray-400" />{" "}
                                                Info Kurir
                                            </h3>
                                            <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded uppercase">
                                                Mitra
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-500 border-2 border-white shadow-md">
                                                {order.courier.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-lg text-gray-900 leading-none mb-1">
                                                    {order.courier.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    ID: {order.courier.id}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <a
                                                href={`https://wa.me/${order.courier.phone?.replace(
                                                    /\D/g,
                                                    ""
                                                )}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center justify-center py-2.5 bg-green-50 text-green-700 border border-green-100 rounded-xl font-bold text-sm hover:bg-green-100 transition shadow-sm"
                                            >
                                                <MessageCircle className="w-4 h-4 mr-2" />{" "}
                                                Chat
                                            </a>
                                            <a
                                                href={`tel:${order.courier.phone}`}
                                                className="flex items-center justify-center py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold text-sm hover:bg-gray-50 transition shadow-sm"
                                            >
                                                <Phone className="w-4 h-4 mr-2" />{" "}
                                                Panggil
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {/* CARD RIWAYAT AKTIVITAS */}
                                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                                    <h3 className="text-sm font-bold text-gray-900 mb-6 flex items-center uppercase tracking-wider">
                                        <Flag className="w-4 h-4 mr-2 text-purple-500" />{" "}
                                        Riwayat Aktivitas
                                    </h3>
                                    <div className="relative pl-4 border-l-2 border-gray-100 space-y-8 ml-2">
                                        {trackings.length > 0 ? (
                                            trackings.map((log, index) => (
                                                <div
                                                    key={log.id}
                                                    className="relative group"
                                                >
                                                    <div
                                                        className={`absolute -left-[21px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm transition-colors ${
                                                            index === 0
                                                                ? "bg-purple-500 ring-4 ring-purple-50"
                                                                : "bg-gray-300 group-hover:bg-gray-400"
                                                        }`}
                                                    ></div>
                                                    <div className="mb-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                                        <span
                                                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded w-fit ${
                                                                index === 0
                                                                    ? "bg-purple-50 text-purple-700"
                                                                    : "bg-gray-100 text-gray-500"
                                                            }`}
                                                        >
                                                            {log.status}
                                                        </span>
                                                        <span className="text-[10px] text-gray-400 font-medium">
                                                            {new Date(
                                                                log.created_at
                                                            ).toLocaleString(
                                                                "id-ID",
                                                                {
                                                                    day: "numeric",
                                                                    month: "short",
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                }
                                                            )}
                                                        </span>
                                                    </div>
                                                    <p
                                                        className={`text-sm mt-1 leading-snug ${
                                                            index === 0
                                                                ? "text-gray-900 font-semibold"
                                                                : "text-gray-600"
                                                        }`}
                                                    >
                                                        {log.description}
                                                    </p>
                                                    {log.evidence_photo_path && (
                                                        <button
                                                            onClick={() =>
                                                                setSelectedImage(
                                                                    `/storage/${log.evidence_photo_path}`
                                                                )
                                                            }
                                                            className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:text-purple-600 hover:border-purple-200 hover:bg-purple-50 transition-all"
                                                        >
                                                            <ImageIcon
                                                                size={14}
                                                            />{" "}
                                                            Lihat Bukti
                                                        </button>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-400 text-sm italic text-center py-4">
                                                Belum ada riwayat aktivitas.
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* CARD BANTUAN */}
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 border border-blue-100 text-center">
                                    <p className="text-blue-800 font-bold mb-3 flex items-center justify-center gap-2 text-sm uppercase tracking-wide">
                                        <HelpCircle size={16} /> Butuh Bantuan?
                                    </p>
                                    <a
                                        href={adminWaLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block w-full py-3 bg-white text-blue-600 font-bold rounded-xl shadow-sm hover:shadow-md hover:text-blue-700 transition-all"
                                    >
                                        Hubungi Admin
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. FOOTER SIMPLE */}
                <footer className="bg-white border-t border-gray-200 py-6 text-center text-gray-400 text-xs font-medium">
                    <p>
                        © {new Date().getFullYear()} Titipsini.com. All rights
                        reserved.
                    </p>
                </footer>
            </div>

            {/* MODAL IMAGE */}
            <ImageModal
                show={!!selectedImage}
                onClose={() => setSelectedImage(null)}
                src={selectedImage}
                title="Bukti Lapangan"
            />
        </>
    );
}
