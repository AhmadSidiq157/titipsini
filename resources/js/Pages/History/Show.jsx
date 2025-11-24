import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage, router } from "@inertiajs/react";
import LiveMap from "@/Components/LiveMap";
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
    HelpCircle,
    Printer,
    Copy,
    ChevronRight,
    CheckCircle2,
    Flag,
    ImageIcon,
    Search,
    X,
    Maximize2,
    PackageCheck, // [FIX] Sudah ditambahkan ke import
} from "lucide-react";
import PrimaryButton from "@/Components/PrimaryButton";
import Modal from "@/Components/Modal";

const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number || 0);
};

// --- KAMUS STATUS ---
const STATUS_LABELS = {
    pending: "Menunggu",
    awaiting_payment: "Menunggu Bayar",
    awaiting_verification: "Verifikasi Pembayaran",
    verified: "Terverifikasi",
    processing: "Sedang Diproses",
    ready_for_pickup: "Kurir Menjemput",
    picked_up: "Barang Diangkut",
    on_delivery: "Dalam Pengiriman",
    delivered: "Sampai Tujuan",
    completed: "Selesai",
    cancelled: "Dibatalkan",
    rejected: "Ditolak",
};

const getStatusLabel = (status) => {
    return STATUS_LABELS[status] || status.replace(/_/g, " ");
};

// --- Helper: Copy Button ---
const CopyButton = ({ text, label = "Salin" }) => {
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
            title={label}
        >
            {copied ? <Check size={10} /> : <Copy size={10} />}
            {copied ? "Disalin" : "Salin"}
        </button>
    );
};

// --- Helper: Google Maps Link ---
const getMapsLink = (address) => {
    if (!address) return "#";
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        address
    )}`;
};

// --- Helper: Image Zoom Modal ---
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

// --- 1. KOMPONEN LIVE TRACKING ---
const LiveTrackingBox = ({ order }) => {
    if (!order.courier) return null;

    // Koordinat kurir (jika null, pakai default Jakarta atau koordinat order)
    const courierLat = order.courier.latitude
        ? parseFloat(order.courier.latitude)
        : null;
    const courierLng = order.courier.longitude
        ? parseFloat(order.courier.longitude)
        : null;

    const isLive = ["on_delivery", "picked_up", "ready_for_pickup"].includes(
        order.status
    );

    // Auto-refresh data order untuk update posisi kurir
    useEffect(() => {
        if (!isLive) return;
        const interval = setInterval(() => {
            router.reload({ only: ["order"], preserveScroll: true });
        }, 10000); // Refresh tiap 10 detik
        return () => clearInterval(interval);
    }, [isLive]);

    return (
        <div className="bg-white rounded-3xl border border-blue-100 shadow-lg shadow-blue-500/5 overflow-hidden mb-8 relative">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 flex justify-between items-center text-white">
                <h3 className="text-sm font-bold flex items-center uppercase tracking-wider">
                    <MapIcon className="w-4 h-4 mr-2" />
                    Live Tracking
                </h3>
                {isLive ? (
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-[10px] font-bold">
                            KURIR AKTIF
                        </span>
                    </div>
                ) : (
                    <span className="text-[10px] bg-gray-500/50 px-2 py-1 rounded text-gray-200">
                        OFFLINE
                    </span>
                )}
            </div>

            <div className="relative h-80 bg-gray-100">
                {courierLat && courierLng ? (
                    <LiveMap courierLat={courierLat} courierLng={courierLng} />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-2 animate-pulse">
                            <MapIcon className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium">
                            Menunggu sinyal lokasi kurir...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- 2. KOMPONEN INFO KURIR ---
const CourierInfoCard = ({ courier }) => {
    if (!courier) return null;
    const verif = courier.courier_verification || {};

    // Format Nomor WA
    const courierPhone = courier.phone ? courier.phone.replace(/\D/g, "") : "";
    const courierWaTarget = courierPhone.startsWith("0")
        ? "62" + courierPhone.slice(1)
        : courierPhone;
    const courierWaLink = `https://wa.me/${courierWaTarget}`;

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Truck className="w-5 h-5 mr-2 text-gray-500" />
                Info Kurir
            </h3>
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xl font-bold text-gray-600 border-2 border-white shadow-md">
                    {courier.name.charAt(0)}
                </div>
                <div>
                    <p className="font-bold text-lg text-gray-900">
                        {courier.name}
                    </p>
                    <div className="flex flex-wrap items-center text-xs text-gray-500 gap-2 mt-1">
                        <span className="bg-gray-100 px-2 py-0.5 rounded border border-gray-200 font-mono font-bold text-gray-700">
                            {verif.plat_nomor || "Plat -"}
                        </span>
                        <span>
                            {verif.vehicle_model || "Kendaraan"} •{" "}
                            {verif.vehicle_type || "Motor"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Tombol Kontak */}
            <div className="mt-6 grid grid-cols-2 gap-3">
                <a
                    href={courierWaLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center py-2.5 bg-green-50 text-green-700 border border-green-100 rounded-xl font-bold text-sm hover:bg-green-100 transition"
                >
                    <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
                </a>
                <a
                    href={`tel:${courier.phone}`}
                    className="flex items-center justify-center py-2.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-xl font-bold text-sm hover:bg-gray-100 transition"
                >
                    <Phone className="w-4 h-4 mr-2" /> Telepon
                </a>
            </div>
        </div>
    );
};

// --- 3. TIMELINE RIWAYAT PERJALANAN ---
const TimelineHistory = ({ trackings }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Flag className="w-5 h-5 mr-2 text-purple-500" />
                Aktivitas Perjalanan
            </h3>

            <div className="relative pl-4 border-l-2 border-gray-100 space-y-8 ml-2">
                {trackings.length > 0 ? (
                    trackings.map((log, index) => (
                        <div key={log.id} className="relative">
                            <div
                                className={`absolute -left-[21px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                                    index === 0
                                        ? "bg-purple-500 ring-4 ring-purple-100"
                                        : "bg-gray-300"
                                }`}
                            ></div>

                            <div className="mb-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-gray-100 rounded text-gray-500 mr-2">
                                    {log.status}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {new Date(log.created_at).toLocaleString(
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
                                className={`text-sm ${
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
                                    className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:text-purple-600 hover:border-purple-200 transition-all"
                                >
                                    <ImageIcon size={14} /> Lihat Bukti Foto
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 text-sm italic">
                        Belum ada riwayat perjalanan.
                    </p>
                )}
            </div>

            <ImageModal
                show={!!selectedImage}
                onClose={() => setSelectedImage(null)}
                src={selectedImage}
                title="Bukti Lapangan"
            />
        </div>
    );
};

// --- 4. STEPPER (Timeline Status) ---
const OrderStepper = ({ status, needsPickup }) => {
    const steps = [
        { key: "awaiting_payment", label: "Bayar", icon: Clock },
        {
            key: "awaiting_verification",
            label: "Verifikasi",
            icon: ShieldCheck,
        },
        ...(needsPickup
            ? [{ key: "ready_for_pickup", label: "Jemput", icon: Truck }]
            : []),
        { key: "processing", label: "Proses", icon: Box },
        { key: "completed", label: "Selesai", icon: PackageCheck },
    ];

    let activeIndex = steps.findIndex((s) => s.key === status);
    if (status === "verified") activeIndex = 1;
    if (["picked_up", "on_delivery"].includes(status))
        activeIndex = needsPickup ? 2 : 1;
    if (status === "delivered") activeIndex = needsPickup ? 3 : 2;
    if (["cancelled", "rejected"].includes(status)) activeIndex = -1;

    return (
        <div className="w-full py-8 overflow-x-auto">
            <div className="flex items-center justify-between min-w-[500px] relative px-4">
                <div className="absolute top-1/2 left-4 right-4 h-1 bg-gray-200 -z-10 rounded-full"></div>
                <div
                    className="absolute top-1/2 left-4 h-1 bg-emerald-500 -z-10 rounded-full transition-all duration-1000"
                    style={{
                        width:
                            activeIndex === -1
                                ? "0%"
                                : `${
                                      (activeIndex / (steps.length - 1)) * 100
                                  }%`,
                    }}
                ></div>

                {steps.map((step, index) => {
                    const isActive = index <= activeIndex && activeIndex !== -1;
                    const Icon = step.icon;
                    return (
                        <div
                            key={step.key}
                            className="flex flex-col items-center gap-2 relative group"
                        >
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 z-10 ${
                                    isActive
                                        ? "bg-emerald-500 border-emerald-100 text-white shadow-lg"
                                        : "bg-white border-gray-200 text-gray-300"
                                }`}
                            >
                                <Icon size={18} />
                            </div>
                            <span
                                className={`text-xs font-bold whitespace-nowrap ${
                                    isActive
                                        ? "text-emerald-700"
                                        : "text-gray-400"
                                }`}
                            >
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
export default function Show({ auth, order }) {
    const { settings } = usePage().props;
    const details = order.user_form_details || {};
    const orderable = order.orderable || {};

    // Logic Layanan
    const isPenitipan =
        order.orderable_type?.includes("Service") || !!details.branch_address;
    const needsPickup = details.delivery_method === "pickup";
    const ServiceIcon = isPenitipan ? Box : Truck;

    // Admin Contact
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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Detail Pesanan
                </h2>
            }
        >
            <Head title={`Order #${order.id}`} />

            <div className="min-h-screen bg-gray-50/50 pb-20">
                {/* HEADER */}
                <div className="bg-white border-b border-gray-200 sticky top-0 z-30 px-4 md:px-8 py-4 shadow-sm">
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center w-full md:w-auto">
                            <Link
                                href={route("history.index")}
                                className="p-2 mr-3 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </Link>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-xl font-black text-gray-800 tracking-tight">
                                        Order #{order.id}
                                    </h2>
                                    <CopyButton
                                        text={`#${order.id}`}
                                        label="Salin ID"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 font-medium">
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
                        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                            <span
                                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${
                                    order.status === "completed"
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        : "bg-blue-50 text-blue-700 border-blue-200"
                                }`}
                            >
                                {getStatusLabel(order.status)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* STEPPER */}
                    <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 mb-8">
                        <OrderStepper
                            status={order.status}
                            needsPickup={needsPickup}
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* --- KOLOM KIRI (Live Map & Info Utama) --- */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Live Tracking */}
                            <LiveTrackingBox order={order} />

                            {/* Detail Card */}
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md ${
                                                isPenitipan
                                                    ? "bg-emerald-500"
                                                    : "bg-blue-600"
                                            }`}
                                        >
                                            <ServiceIcon size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">
                                                Layanan
                                            </p>
                                            <h2 className="text-xl font-bold text-gray-900">
                                                {orderable.name ||
                                                    orderable.title}
                                            </h2>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">
                                            Total Biaya
                                        </p>
                                        <p className="text-xl font-extrabold text-emerald-600">
                                            {formatRupiah(order.final_amount)}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* Alamat */}
                                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 relative overflow-hidden">
                                        {/* Garis Connector */}
                                        <div className="absolute left-[29px] top-10 bottom-10 w-0.5 border-l-2 border-dashed border-gray-300 z-0"></div>

                                        <div className="relative z-10 mb-6 flex items-start gap-4">
                                            <div className="w-6 h-6 rounded-full bg-white border-4 border-blue-500 shadow-sm flex-shrink-0 mt-0.5"></div>
                                            <div className="flex-1">
                                                <p className="text-xs text-blue-500 font-bold uppercase mb-1">
                                                    Lokasi Jemput
                                                </p>
                                                <p className="text-sm font-medium text-gray-800 leading-snug">
                                                    {details.alamat_penjemputan ||
                                                        "Tidak tersedia"}
                                                </p>
                                                <a
                                                    href={getMapsLink(
                                                        details.alamat_penjemputan
                                                    )}
                                                    target="_blank"
                                                    className="inline-flex items-center mt-2 text-xs font-bold text-blue-600 hover:underline"
                                                >
                                                    <MapPin
                                                        size={12}
                                                        className="mr-1"
                                                    />{" "}
                                                    Buka Maps
                                                </a>
                                            </div>
                                        </div>

                                        <div className="relative z-10 flex items-start gap-4">
                                            <div className="w-6 h-6 rounded-full bg-white border-4 border-green-500 shadow-sm flex-shrink-0 mt-0.5"></div>
                                            <div className="flex-1">
                                                <p className="text-xs text-green-500 font-bold uppercase mb-1">
                                                    Tujuan
                                                </p>
                                                <p className="text-sm font-medium text-gray-800 leading-snug">
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
                                                    className="inline-flex items-center mt-2 text-xs font-bold text-green-600 hover:underline"
                                                >
                                                    <MapPin
                                                        size={12}
                                                        className="mr-1"
                                                    />{" "}
                                                    Buka Maps
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info Tambahan */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                            <p className="text-xs text-gray-400 font-bold uppercase mb-1">
                                                Tanggal Jadwal
                                            </p>
                                            <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                                <Calendar size={14} />
                                                {details.tanggal_pindahan
                                                    ? new Date(
                                                          details.tanggal_pindahan
                                                      ).toLocaleDateString(
                                                          "id-ID"
                                                      )
                                                    : details.start_date || "-"}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                            <p className="text-xs text-gray-400 font-bold uppercase mb-1">
                                                Metode
                                            </p>
                                            <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                                <Truck size={14} />
                                                {details.delivery_method ===
                                                "pickup"
                                                    ? "Dijemput Kurir"
                                                    : "Antar Sendiri"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- KOLOM KANAN (Sidebar) --- */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Status Card */}
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
                                <div
                                    className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                                        order.status === "completed"
                                            ? "bg-green-100 text-green-600"
                                            : order.status ===
                                              "awaiting_payment"
                                            ? "bg-yellow-100 text-yellow-600"
                                            : "bg-blue-100 text-blue-600"
                                    }`}
                                >
                                    {order.status === "completed" ? (
                                        <CheckCircle2 size={32} />
                                    ) : order.status === "awaiting_payment" ? (
                                        <Clock size={32} />
                                    ) : (
                                        <Truck size={32} />
                                    )}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">
                                    {getStatusLabel(order.status)}
                                </h3>
                                <p className="text-xs text-gray-500 px-4">
                                    Status pesanan Anda saat ini.
                                </p>

                                {order.status === "awaiting_payment" && (
                                    <Link
                                        href={route("order.payment", order.id)}
                                        className="block w-full mt-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg shadow-green-200"
                                    >
                                        Bayar Sekarang
                                    </Link>
                                )}
                            </div>

                            {/* Info Kurir & Tracking */}
                            <CourierInfoCard courier={order.courier} />
                            <TimelineHistory trackings={order.trackings} />

                            {/* Admin Help */}
                            <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100 text-center">
                                <p className="text-blue-800 font-bold mb-2 flex items-center justify-center gap-2">
                                    <HelpCircle size={18} /> Bantuan CS
                                </p>
                                <p className="text-xs text-blue-600 mb-4">
                                    Ada masalah dengan pesanan? Hubungi kami.
                                </p>
                                <a
                                    href={adminWaLink}
                                    target="_blank"
                                    className="block w-full py-2.5 bg-white text-blue-600 font-bold rounded-xl shadow-sm hover:bg-blue-100 transition"
                                >
                                    Hubungi Admin
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
