import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, usePage, useForm } from "@inertiajs/react";
import {
    Check,
    X,
    User,
    Calendar,
    FileText,
    Box,
    ShieldCheck,
    Clock,
    PackageCheck,
    Truck,
    ArrowRight,
    Image as ImageIcon,
    ExternalLink,
    MapPin,
    Smartphone,
    Search,
    AlertTriangle,
    Printer,
    MessageCircle,
    Copy,
    ChevronRight,
    Flag,
    Phone,
} from "lucide-react";
import PrimaryButton from "@/Components/PrimaryButton";
import DangerButton from "@/Components/DangerButton";
import Modal from "@/Components/Modal";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";

const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number);
};

// --- KAMUS STATUS ---
const STATUS_LABELS = {
    pending: "Menunggu",
    awaiting_payment: "Menunggu Bayar",
    awaiting_verification: "Perlu Verifikasi",
    verified: "Terverifikasi",
    processing: "Diproses/Disimpan",
    ready_for_pickup: "Siap Dijemput",
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

// --- Helper: Copy to Clipboard ---
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
            className="text-xs flex items-center gap-1 text-gray-400 hover:text-emerald-600 transition-colors ml-2"
            title={label}
        >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Tersalin" : ""}
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

// --- Helper: Status Stepper (Timeline) [DIPERBAIKI] ---
const OrderStepper = ({ status, needsPickup }) => {
    // Definisi Tahapan
    const steps = [
        { key: "awaiting_payment", label: "Menunggu Bayar", icon: Clock },
        {
            key: "awaiting_verification",
            label: "Verifikasi",
            icon: ShieldCheck,
        },
        // Jika butuh jemput, tampilkan tahap Penjemputan
        ...(needsPickup
            ? [{ key: "ready_for_pickup", label: "Penjemputan", icon: Truck }]
            : []),
        // Tahap Penyimpanan/Proses (Untuk pindahan ini berarti 'Sedang Jalan' atau 'Sampai')
        { key: "processing", label: "Dalam Proses", icon: Box },
        { key: "completed", label: "Selesai", icon: PackageCheck },
    ];

    let activeIndex = steps.findIndex((s) => s.key === status);

    // [LOGIKA PERBAIKAN WARNA HIJAU]
    // 1. Jika Verified -> Sudah lewat Verifikasi (Index 1)
    if (status === "verified") activeIndex = 1;

    // 2. Jika Kurir Sedang Kerja (Picked Up / OTW) -> Anggap sedang di tahap Penjemputan/Proses
    if (["picked_up", "on_delivery"].includes(status)) {
        // Jika ada pickup, nyalakan sampai index Penjemputan (2)
        // Jika tidak, nyalakan sampai index Verifikasi (1) menuju Proses
        activeIndex = needsPickup ? 2 : 1;
    }

    // 3. Jika DELIVERED (Sampai Tujuan) -> Nyalakan sampai tahap 'Dalam Proses' (Index 3)
    if (status === "delivered") {
        activeIndex = needsPickup ? 3 : 2; // Index 3 adalah 'processing' (Dalam Proses/Disimpan)
    }

    // 4. Cancelled/Rejected -> Matikan semua (atau set -1)
    if (["cancelled", "rejected"].includes(status)) activeIndex = -1;

    return (
        <div className="w-full py-6 px-4 bg-white border-b border-gray-200 mb-6 overflow-x-auto">
            <div className="flex items-center justify-between min-w-[600px] max-w-4xl mx-auto relative">
                {/* Garis Abu-abu (Background) */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10 rounded-full"></div>

                {/* Garis Hijau (Progress) */}
                <div
                    className="absolute top-1/2 left-0 h-1 bg-emerald-500 -z-10 rounded-full transition-all duration-1000"
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
                    const isCurrent = index === activeIndex;
                    const Icon = step.icon;

                    return (
                        <div
                            key={step.key}
                            className="flex flex-col items-center gap-2 relative group"
                        >
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 z-10 ${
                                    isActive
                                        ? "bg-emerald-500 border-emerald-100 text-white shadow-lg shadow-emerald-200"
                                        : "bg-white border-gray-200 text-gray-300"
                                }`}
                            >
                                <Icon size={18} />
                            </div>
                            <span
                                className={`text-xs font-bold whitespace-nowrap transition-colors ${
                                    isCurrent
                                        ? "text-emerald-600"
                                        : isActive
                                        ? "text-gray-700"
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

// --- KOTAK RIWAYAT TRACKING ---
const TrackingHistoryBox = ({ order }) => {
    const trackings = order.trackings || [];
    const [selectedImage, setSelectedImage] = useState(null);

    if (trackings.length === 0) return null;

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Flag className="w-5 h-5 mr-2 text-purple-500" />
                Riwayat & Bukti Lapangan
            </h3>

            <div className="space-y-6 relative pl-2">
                <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gray-200"></div>

                {trackings.map((log, index) => (
                    <div
                        key={log.id}
                        className="relative flex gap-4 items-start group"
                    >
                        <div
                            className={`relative z-10 w-7 h-7 rounded-full border-2 border-white shadow-sm flex items-center justify-center flex-shrink-0 ${
                                index === 0
                                    ? "bg-purple-600 text-white"
                                    : "bg-gray-200 text-gray-500"
                            }`}
                        >
                            <Clock size={12} />
                        </div>
                        <div className="flex-1 bg-gray-50 p-4 rounded-xl text-sm border border-gray-100 hover:border-purple-200 hover:bg-purple-50/50 transition-colors">
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-bold text-gray-800">
                                    {getStatusLabel(log.status)}
                                </span>
                                <span className="text-[10px] text-gray-400">
                                    {new Date(log.created_at).toLocaleString(
                                        "id-ID"
                                    )}
                                </span>
                            </div>
                            <p className="text-gray-600 mb-2">
                                {log.description}
                            </p>

                            {log.evidence_photo_path && (
                                <button
                                    onClick={() =>
                                        setSelectedImage(
                                            `/storage/${log.evidence_photo_path}`
                                        )
                                    }
                                    className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:text-purple-600 hover:border-purple-300 shadow-sm transition-all"
                                >
                                    <ImageIcon size={14} /> Lihat Foto Bukti
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <ImageModal
                show={!!selectedImage}
                onClose={() => setSelectedImage(null)}
                src={selectedImage}
                title="Bukti Lapangan Kurir"
            />
        </div>
    );
};

// --- Kotak Verifikasi Pembayaran ---
const PaymentVerificationBox = ({ order }) => {
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showImagePreview, setShowImagePreview] = useState(false);
    const { data, setData, post, processing, reset } = useForm({
        rejection_reason: "",
    });

    const submitReject = (e) => {
        e.preventDefault();
        post(route("admin.orders.reject", order.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowRejectModal(false);
                reset();
            },
        });
    };

    const proofPath = order.payment?.payment_proof_path
        ? `/storage/${order.payment.payment_proof_path}`
        : null;
    const isPdf = proofPath?.toLowerCase().endsWith(".pdf");

    return (
        <div className="bg-white rounded-2xl p-1 border border-orange-100 shadow-lg shadow-orange-500/5 relative overflow-hidden mb-6 group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-400 group-hover:w-2 transition-all"></div>
            <div className="p-5 pl-7">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <ShieldCheck className="w-5 h-5 mr-2 text-orange-500" />{" "}
                    Verifikasi Pembayaran
                </h3>
                {order.payment ? (
                    <div className="space-y-4">
                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 relative">
                            {isPdf ? (
                                <div className="flex flex-col items-center justify-center h-40 text-gray-500 gap-2">
                                    <FileText
                                        size={40}
                                        className="text-red-500"
                                    />
                                    <span className="font-medium text-sm">
                                        Dokumen PDF
                                    </span>
                                    <a
                                        href={proofPath}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs text-blue-600 hover:underline flex items-center mt-1"
                                    >
                                        Buka Dokumen{" "}
                                        <ExternalLink
                                            size={12}
                                            className="ml-1"
                                        />
                                    </a>
                                </div>
                            ) : (
                                <div
                                    className="relative group/img cursor-zoom-in overflow-hidden rounded-lg h-48 bg-gray-200"
                                    onClick={() => setShowImagePreview(true)}
                                >
                                    <img
                                        src={proofPath}
                                        alt="Bukti Transfer"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="text-white text-xs font-bold border border-white px-3 py-1 rounded-full flex items-center bg-white/20 backdrop-blur-md">
                                            <Search
                                                size={14}
                                                className="mr-1"
                                            />{" "}
                                            Perbesar
                                        </span>
                                    </div>
                                </div>
                            )}
                            {order.payment.notes && (
                                <div className="mt-3 text-xs text-gray-500 border-t border-gray-200 pt-2 italic">
                                    <span className="font-bold not-italic mr-1">
                                        Catatan User:
                                    </span>{" "}
                                    "{order.payment.notes}"
                                </div>
                            )}
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Link
                                href={route("admin.orders.approve", order.id)}
                                method="post"
                                as="button"
                                className="flex-1 flex justify-center items-center px-4 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 hover:shadow-lg shadow-emerald-200 transition-all transform hover:-translate-y-0.5"
                                onBefore={() =>
                                    confirm(
                                        "Pastikan dana sudah masuk mutasi rekening. Setujui?"
                                    )
                                }
                            >
                                <Check className="w-5 h-5 mr-2" /> Terima
                            </Link>
                            <button
                                onClick={() => setShowRejectModal(true)}
                                className="flex-1 flex justify-center items-center px-4 py-3 bg-white border border-red-200 text-red-600 rounded-xl font-bold text-sm hover:bg-red-50 transition-all"
                            >
                                <X className="w-5 h-5 mr-2" /> Tolak
                            </button>
                        </div>
                        <ImageModal
                            show={showImagePreview}
                            onClose={() => setShowImagePreview(false)}
                            src={proofPath}
                            title="Bukti Pembayaran"
                        />
                    </div>
                ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-xl text-gray-400 text-sm border border-dashed border-gray-300 flex flex-col items-center">
                        <Clock className="w-8 h-8 mb-2 text-gray-300" />{" "}
                        Menunggu user mengupload bukti...
                    </div>
                )}
                <Modal
                    show={showRejectModal}
                    onClose={() => setShowRejectModal(false)}
                >
                    <form onSubmit={submitReject} className="p-6">
                        <div className="flex items-center gap-3 mb-4 text-red-600">
                            <div className="p-2 bg-red-100 rounded-full">
                                <AlertTriangle size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Tolak Pembayaran
                            </h2>
                        </div>
                        <div className="mb-6">
                            <InputLabel value="Alasan Penolakan (Wajib)" />
                            <textarea
                                value={data.rejection_reason}
                                onChange={(e) =>
                                    setData("rejection_reason", e.target.value)
                                }
                                className="w-full border-gray-300 rounded-xl mt-1 focus:ring-red-500 focus:border-red-500 min-h-[100px]"
                                placeholder="Alasan..."
                                required
                            ></textarea>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowRejectModal(false)}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Batal
                            </button>
                            <DangerButton
                                disabled={processing}
                                className="rounded-lg"
                            >
                                Tolak Verifikasi
                            </DangerButton>
                        </div>
                    </form>
                </Modal>
            </div>
        </div>
    );
};

// --- Kotak Penugasan Kurir ---
const CourierAssignmentBox = ({ order, couriers }) => {
    const { data, setData, post, processing, errors } = useForm({
        courier_id: order.courier_id || "",
    });
    useEffect(() => {
        setData("courier_id", order.courier_id || "");
    }, [order]);
    const submit = (e) => {
        e.preventDefault();
        post(route("admin.orders.assignCourier", order.id), {
            preserveScroll: true,
        });
    };
    const getStatusInfo = (status) => {
        switch (status) {
            case "available":
                return { label: "🟢 Ready", disabled: false };
            case "on_delivery":
                return { label: "🔴 Sibuk", disabled: true };
            case "offline":
                return { label: "⚫ Offline", disabled: true };
            default:
                return { label: "⚪ Unknown", disabled: true };
        }
    };

    return (
        <div className="bg-white rounded-2xl p-1 border border-blue-100 shadow-lg shadow-blue-500/5 relative overflow-hidden mb-6 group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500 group-hover:w-2 transition-all"></div>
            <div className="p-5 pl-7">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Truck className="w-5 h-5 mr-2 text-blue-500" /> Penjemputan
                    Barang
                </h3>
                {order.courier ? (
                    <div className="mb-5 p-4 bg-gradient-to-br from-blue-50 to-white border border-blue-100 text-blue-800 rounded-xl flex items-center justify-between shadow-sm">
                        <div>
                            <p className="text-[10px] text-blue-500 uppercase font-bold tracking-wider mb-1">
                                Kurir Bertugas
                            </p>
                            <p className="font-bold text-lg text-gray-800">
                                {order.courier.name}
                            </p>
                        </div>
                        <div className="bg-white p-2 rounded-full shadow-sm border border-blue-50">
                            <User className="w-5 h-5 text-blue-500" />
                        </div>
                    </div>
                ) : (
                    <div className="mb-4 p-3 bg-amber-50 text-amber-800 text-sm rounded-lg border border-amber-100 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />{" "}
                        Barang butuh dijemput. Segera tugaskan kurir.
                    </div>
                )}
                <form onSubmit={submit} className="space-y-3">
                    <div>
                        <InputLabel
                            htmlFor="courier_id"
                            value={
                                order.courier
                                    ? "Ganti Penugasan"
                                    : "Pilih Kurir"
                            }
                            className="text-xs uppercase text-gray-500"
                        />
                        <div className="relative">
                            <select
                                id="courier_id"
                                value={data.courier_id}
                                onChange={(e) =>
                                    setData("courier_id", e.target.value)
                                }
                                className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-xl text-sm block p-3 pr-8 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                                disabled={couriers.length === 0}
                            >
                                <option value="">
                                    -- Pilih Kurir Tersedia --
                                </option>
                                {couriers.map((courier) => {
                                    const info = getStatusInfo(
                                        courier.courier_status
                                    );
                                    return (
                                        <option
                                            key={courier.id}
                                            value={courier.id}
                                            disabled={info.disabled}
                                            className={
                                                info.disabled
                                                    ? "text-gray-400 bg-gray-50"
                                                    : "font-bold text-gray-900"
                                            }
                                        >
                                            {courier.name} — {info.label}
                                        </option>
                                    );
                                })}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                                <ChevronRight size={16} className="rotate-90" />
                            </div>
                        </div>
                    </div>
                    <PrimaryButton
                        className="w-full justify-center rounded-xl py-3 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
                        disabled={processing || !data.courier_id}
                    >
                        {processing ? "Menyimpan..." : "Simpan Penugasan"}
                    </PrimaryButton>
                    <InputError message={errors.courier_id} className="mt-1" />
                </form>
            </div>
        </div>
    );
};

// --- Kotak Status Penyimpanan ---
const StorageStatusBox = ({ order }) => {
    const { post, processing } = useForm();
    const handleComplete = () => {
        if (
            confirm(
                "Pastikan barang sudah benar-benar dikembalikan ke customer. Lanjutkan?"
            )
        )
            post(route("admin.orders.complete", order.id));
    };

    if (order.status === "completed")
        return (
            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200 text-center shadow-sm">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in">
                    <PackageCheck size={32} />
                </div>
                <h4 className="text-xl font-bold text-emerald-800">
                    Pesanan Selesai
                </h4>
                <p className="text-sm text-emerald-600 mt-1">
                    Barang telah dikembalikan & transaksi ditutup.
                </p>
            </div>
        );

    if (order.status === "processing" || order.status === "delivered")
        return (
            // [FIX] Tampilkan juga saat DELIVERED
            <div className="bg-white rounded-2xl p-1 border border-indigo-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500"></div>
                <div className="p-5 pl-7">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <Box className="w-5 h-5 mr-2 text-indigo-500" /> Status
                        Penyimpanan
                    </h3>
                    <div className="bg-indigo-50 p-4 rounded-xl mb-6 flex items-start gap-4 border border-indigo-100">
                        <div className="bg-white p-2 rounded-lg shadow-sm text-indigo-600">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-bold text-indigo-900 text-lg">
                                {order.status === "delivered"
                                    ? "Barang Sampai (Gudang)"
                                    : "Sedang Disimpan"}
                            </p>
                            <p className="text-xs text-indigo-600 mt-1">
                                Durasi sewa sedang berjalan.
                            </p>
                        </div>
                    </div>
                    <PrimaryButton
                        onClick={handleComplete}
                        disabled={processing}
                        className="w-full justify-center py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-sm shadow-lg shadow-indigo-200"
                    >
                        <PackageCheck className="w-4 h-4 mr-2" /> Selesaikan
                        (Barang Diambil)
                    </PrimaryButton>
                </div>
            </div>
        );
    return null;
};

// --- Kotak Detail Pesanan (Left Column) [DIPERBAIKI: DINAMIS] ---
const OrderDetailsBox = ({ order }) => {
    const details = order.user_form_details || {};
    const [showPhoto, setShowPhoto] = useState(false);

    return (
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg shadow-gray-100 h-full">
            <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center pb-4 border-b border-gray-50">
                <FileText className="w-5 h-5 mr-3 text-emerald-500" /> Detail
                Informasi
            </h3>
            <div className="space-y-8">
                {/* KLIEN DINAMIS */}
                <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center flex-shrink-0 text-gray-400 border border-gray-100">
                        <User size={24} />
                    </div>
                    <div className="flex-1">
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">
                            Pelanggan
                        </p>
                        <div className="flex items-center gap-2">
                            <p className="font-bold text-gray-900 text-lg">
                                {order.user.name}
                            </p>
                            <CopyButton text={order.user.name} />
                        </div>
                        <p className="text-sm text-gray-500 font-medium">
                            {order.user.email}
                        </p>
                        {/* PHONE DINAMIS */}
                        {details.phone && (
                            <div className="flex gap-2 mt-2">
                                <a
                                    href={`https://wa.me/${details.phone
                                        .replace(/^0/, "62")
                                        .replace(/\D/g, "")}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors font-medium"
                                >
                                    <MessageCircle size={14} /> WhatsApp
                                </a>
                                <a
                                    href={`tel:${details.phone}`}
                                    className="inline-flex items-center gap-2 text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors font-medium"
                                >
                                    <Phone size={14} /> Panggil
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* PAKET & DURASI */}
                <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center flex-shrink-0 text-gray-400 border border-gray-100">
                        <Box size={24} />
                    </div>
                    <div className="flex-1">
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">
                            Paket Layanan
                        </p>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <p className="font-bold text-gray-900 text-lg">
                                {order.orderable.title || order.orderable.name}
                            </p>
                            <span className="text-emerald-700 font-black text-lg bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 inline-block w-fit">
                                {formatRupiah(order.final_amount)}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200/60">
                    <div className="flex items-center gap-2 text-gray-500 mb-4">
                        <Calendar size={16} className="text-emerald-500" />
                        <span className="text-xs font-bold uppercase tracking-wide">
                            Masa Sewa
                        </span>
                    </div>
                    <div className="flex items-center justify-between relative">
                        <div>
                            <p className="text-xs text-gray-400 mb-1">Mulai</p>
                            <p className="font-bold text-gray-900 text-sm md:text-base">
                                {details.start_date || details.tanggal_pindahan}
                            </p>
                        </div>
                        <div className="flex-1 mx-4 h-px bg-gray-300 relative top-2">
                            <div className="absolute right-0 -top-1.5 text-gray-300">
                                <ArrowRight size={14} />
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400 mb-1">Durasi</p>
                            <p className="font-bold text-gray-900 text-sm md:text-base">
                                {details.duration_value
                                    ? `${details.duration_value} ${details.duration_unit}`
                                    : "-"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ALAMAT DINAMIS (BISA DIKLIK KE MAPS) */}
                {details.delivery_method && (
                    <div
                        className={`flex items-center gap-4 p-4 border rounded-2xl ${
                            details.delivery_method === "pickup"
                                ? "bg-blue-50/50 border-blue-200"
                                : "bg-gray-50 border-gray-200"
                        }`}
                    >
                        <div
                            className={`p-3 rounded-xl ${
                                details.delivery_method === "pickup"
                                    ? "bg-blue-100 text-blue-600"
                                    : "bg-gray-200 text-gray-600"
                            }`}
                        >
                            {details.delivery_method === "pickup" ? (
                                <Truck size={22} />
                            ) : (
                                <Box size={22} />
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">
                                Metode Penyerahan
                            </p>
                            <p className="font-bold text-gray-800 text-base">
                                {details.delivery_method === "pickup"
                                    ? "Request Penjemputan (Pick Up)"
                                    : "Diantar Sendiri (Drop Off)"}
                            </p>
                            {details.delivery_method === "pickup" && (
                                <div className="mt-2">
                                    <div className="text-sm text-gray-600 flex items-start gap-2 bg-white p-2 rounded-lg border border-blue-100">
                                        <MapPin
                                            size={14}
                                            className="mt-0.5 text-blue-500 flex-shrink-0"
                                        />
                                        <span className="flex-1 leading-snug">
                                            {details.alamat_penjemputan}
                                        </span>
                                        <CopyButton
                                            text={details.alamat_penjemputan}
                                        />
                                    </div>
                                    <a
                                        href={getMapsLink(
                                            details.alamat_penjemputan
                                        )}
                                        target="_blank"
                                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 mt-1 hover:underline ml-1"
                                    >
                                        <ExternalLink size={10} /> Buka di Maps
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {details.item_photo_path && (
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold mb-3 flex items-center">
                            <ImageIcon
                                size={16}
                                className="mr-1 text-emerald-500"
                            />{" "}
                            Foto Barang User
                        </p>
                        <div
                            className="block w-full h-64 rounded-2xl overflow-hidden border border-gray-200 shadow-sm group relative cursor-pointer bg-gray-100"
                            onClick={() => setShowPhoto(true)}
                        >
                            <img
                                src={`/storage/${details.item_photo_path}`}
                                alt="Foto Barang"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                <span className="opacity-0 group-hover:opacity-100 text-white font-bold border-2 border-white px-5 py-2.5 rounded-full backdrop-blur-md flex items-center gap-2 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                    <Search size={18} /> Lihat Detail
                                </span>
                            </div>
                        </div>
                        <ImageModal
                            show={showPhoto}
                            onClose={() => setShowPhoto(false)}
                            src={`/storage/${details.item_photo_path}`}
                            title="Foto Barang User"
                        />
                    </div>
                )}
                {details.notes && (
                    <div className="bg-amber-50 p-5 rounded-2xl text-sm text-amber-900 border border-amber-100 flex gap-3">
                        <FileText className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-500" />
                        <div>
                            <span className="font-bold block mb-1 text-amber-700">
                                Catatan Tambahan:
                            </span>
                            <span className="italic font-medium">
                                "{details.notes}"
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default function Show({ auth, order, couriers }) {
    const { flash } = usePage().props;
    const details = order.user_form_details || {};
    const needsPickup = details.delivery_method === "pickup";
    const canAssignCourier =
        needsPickup &&
        [
            "awaiting_verification",
            "verified",
            "ready_for_pickup",
            "processing",
        ].includes(order.status);

    return (
        <AdminLayout user={auth.user} header={null}>
            <Head title={`Detail Order #${order.id}`} />
            <div className="min-h-screen bg-gray-50/50 pb-20 font-sans">
                <div className="bg-white/90 border-b border-gray-200 sticky top-0 z-30 backdrop-blur-lg px-4 md:px-8 py-4 shadow-sm transition-all">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center w-full md:w-auto">
                            <Link
                                href={route("admin.orders.index")}
                                className="p-2 mr-3 rounded-full hover:bg-gray-100 text-gray-500 transition-colors group"
                            >
                                <ArrowRight
                                    size={20}
                                    className="rotate-180 group-hover:-translate-x-1 transition-transform"
                                />
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
                            {details.phone && (
                                <a
                                    href={`https://wa.me/${details.phone
                                        .replace(/^0/, "62")
                                        .replace(/\D/g, "")}`}
                                    target="_blank"
                                    className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors border border-emerald-200"
                                    title="Hubungi via WhatsApp"
                                >
                                    <MessageCircle size={20} />
                                </a>
                            )}
                            <button
                                onClick={() => window.print()}
                                className="p-2.5 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200"
                                title="Cetak Halaman"
                            >
                                <Printer size={20} />
                            </button>
                            <div className="h-8 w-px bg-gray-300 mx-1"></div>
                            <span
                                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${
                                    order.status === "awaiting_verification"
                                        ? "bg-blue-50 text-blue-700 border-blue-200 animate-pulse"
                                        : order.status === "completed"
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        : "bg-gray-50 text-gray-700 border-gray-200"
                                }`}
                            >
                                {getStatusLabel(order.status)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Order Stepper dengan logika 'delivered' yang sudah diperbaiki */}
                <OrderStepper status={order.status} needsPickup={needsPickup} />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {flash.success && (
                        <div className="mb-8 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-4 rounded-2xl flex items-center shadow-sm animate-in slide-in-from-top-2">
                            <div className="w-8 h-8 bg-emerald-200 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                                <Check className="w-5 h-5 text-emerald-700" />
                            </div>
                            <p className="font-medium">{flash.success}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                        <div className="xl:col-span-7 space-y-6">
                            <OrderDetailsBox order={order} />
                            <TrackingHistoryBox order={order} />
                        </div>

                        <div className="xl:col-span-5 space-y-6">
                            {order.status === "awaiting_verification" && (
                                <PaymentVerificationBox order={order} />
                            )}
                            {canAssignCourier && (
                                <CourierAssignmentBox
                                    order={order}
                                    couriers={couriers}
                                />
                            )}
                            <StorageStatusBox order={order} />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
