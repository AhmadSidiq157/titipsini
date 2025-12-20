import React, { useState, useEffect } from "react";
import { useForm, Link, router } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import DangerButton from "@/Components/DangerButton";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import {
    Check,
    Copy,
    X,
    Clock,
    ShieldCheck,
    Truck,
    Box,
    PackageCheck,
    User,
    MessageCircle,
    Phone,
    Calendar,
    ArrowRight,
    MapPin,
    ExternalLink,
    ImageIcon,
    Search,
    FileText,
    AlertTriangle,
    Flag,
    Navigation,
    Building2,
    CheckCircle2,
} from "lucide-react";

// ==========================================
// 1. UTILITY FUNCTIONS
// ==========================================

export const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(number);
};

export const STATUS_LABELS = {
    pending: "Menunggu",
    awaiting_payment: "Menunggu Bayar",
    awaiting_verification: "Perlu Verifikasi",
    verified: "Terverifikasi",
    processing: "Sedang Diproses",
    ready_for_pickup: "Siap Dijemput",
    picked_up: "Sudah Dijemput",
    on_delivery: "Dalam Pengiriman",
    delivered: "Sampai Tujuan",
    completed: "Selesai",
    cancelled: "Dibatalkan",
    rejected: "Ditolak",
};

export const getStatusLabel = (status) => {
    return STATUS_LABELS[status] || status.replace(/_/g, " ");
};

export const getMapsLink = (lat, lng, address) => {
    if (lat && lng) {
        return `http://googleusercontent.com/maps.google.com/?q=${lat},${lng}`;
    }
    if (address) {
        return `http://googleusercontent.com/maps.google.com/?q=${encodeURIComponent(
            address
        )}`;
    }
    return "#";
};

// ==========================================
// 2. HELPER COMPONENTS
// ==========================================

export const CopyButton = ({ text, label = "Salin" }) => {
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
            {copied ? <Check size={12} /> : <Copy size={12} />}{" "}
            {copied ? "Tersalin" : ""}
        </button>
    );
};

export const ImageModal = ({ show, onClose, src, title }) => (
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

// ==========================================
// 3. MAIN UI COMPONENTS
// ==========================================

export const OrderStepper = ({ status, needsPickup }) => {
    const steps = [
        { key: "awaiting_payment", label: "Menunggu Bayar", icon: Clock },
        {
            key: "awaiting_verification",
            label: "Verifikasi",
            icon: ShieldCheck,
        },
        ...(needsPickup
            ? [{ key: "ready_for_pickup", label: "Penjemputan", icon: Truck }]
            : []),
        { key: "processing", label: "Dalam Proses", icon: Box },
        { key: "completed", label: "Selesai", icon: PackageCheck },
    ];
    let activeIndex = steps.findIndex((s) => s.key === status);
    if (status === "verified") activeIndex = 1;
    if (["picked_up", "on_delivery"].includes(status))
        activeIndex = needsPickup ? 2 : 1;
    if (status === "delivered") activeIndex = needsPickup ? 3 : 2;
    if (["cancelled", "rejected"].includes(status)) activeIndex = -1;

    return (
        <div className="w-full py-6 px-4 bg-white border-b border-gray-200 mb-6 overflow-x-auto">
            <div className="flex items-center justify-between min-w-[600px] max-w-4xl mx-auto relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10 rounded-full"></div>
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
                                    index === activeIndex
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

export const OrderDetailsBox = ({
    order,
    hasCoordinates,
    hasMovingCoordinates,
    isMovingService,
}) => {
    const details = order.user_form_details || {};
    const [showPhoto, setShowPhoto] = useState(false);
    const isPickup = details.delivery_method === "pickup";

    return (
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg shadow-gray-100 h-full">
            <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center pb-4 border-b border-gray-50">
                <FileText className="w-5 h-5 mr-3 text-emerald-500" /> Detail
                Informasi
            </h3>
            <div className="space-y-8">
                {/* User Info */}
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
                        {details.phone && (
                            <div className="flex gap-2 mt-2">
                                <a
                                    href={`https://wa.me/${details.phone
                                        .replace(/^0/, "62")
                                        .replace(/\D/g, "")}`}
                                    target="_blank"
                                    className="inline-flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg font-medium"
                                >
                                    <MessageCircle size={14} /> WhatsApp
                                </a>
                                <a
                                    href={`tel:${details.phone}`}
                                    className="inline-flex items-center gap-2 text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-medium"
                                >
                                    <Phone size={14} /> Panggil
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Paket Info */}
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
                            <span className="text-emerald-700 font-black text-lg bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                                {formatRupiah(order.final_amount)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* --- LOKASI --- */}
                {isMovingService ? (
                    <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <p className="text-xs font-bold text-blue-600 uppercase mb-2 flex items-center gap-1">
                                <MapPin size={12} /> Lokasi Asal (Jemput)
                            </p>
                            <p className="text-sm text-gray-800 leading-snug mb-3">
                                {details.alamat_penjemputan}
                            </p>
                            {details.origin_latitude && (
                                <a
                                    href={getMapsLink(
                                        details.origin_latitude,
                                        details.origin_longitude
                                    )}
                                    target="_blank"
                                    className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1"
                                >
                                    <Navigation size={10} /> Cek Koordinat Asal
                                </a>
                            )}
                        </div>
                        <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                            <p className="text-xs font-bold text-orange-600 uppercase mb-2 flex items-center gap-1">
                                <MapPin size={12} /> Lokasi Tujuan (Antar)
                            </p>
                            <p className="text-sm text-gray-800 leading-snug mb-3">
                                {details.alamat_tujuan}
                            </p>
                            {details.destination_latitude && (
                                <a
                                    href={getMapsLink(
                                        details.destination_latitude,
                                        details.destination_longitude
                                    )}
                                    target="_blank"
                                    className="text-xs font-bold text-orange-700 hover:underline flex items-center gap-1"
                                >
                                    <Navigation size={10} /> Cek Koordinat
                                    Tujuan
                                </a>
                            )}
                        </div>
                    </div>
                ) : (
                    details.delivery_method && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div
                                className={`p-4 rounded-xl border ${
                                    isPickup
                                        ? "bg-blue-50 border-blue-100"
                                        : "bg-gray-50 border-gray-100"
                                }`}
                            >
                                <p className="text-xs font-bold text-gray-500 uppercase mb-2">
                                    {isPickup
                                        ? "Lokasi Penjemputan"
                                        : "Lokasi Drop Off"}
                                </p>
                                {isPickup ? (
                                    <>
                                        <p className="text-sm text-gray-800 mb-2">
                                            {details.alamat_penjemputan}
                                        </p>
                                        {hasCoordinates && (
                                            <a
                                                href={getMapsLink(
                                                    details.latitude,
                                                    details.longitude
                                                )}
                                                target="_blank"
                                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-white rounded border border-blue-200 text-blue-600 text-xs font-bold hover:bg-blue-50"
                                            >
                                                <MapPin size={12} /> Buka di
                                                Maps
                                            </a>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-sm text-gray-500 italic">
                                        User akan mengantar sendiri.
                                    </p>
                                )}
                            </div>
                            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                <p className="text-xs font-bold text-emerald-600 uppercase mb-2 flex items-center gap-1">
                                    <Building2 size={12} /> Gudang Penyimpanan
                                </p>
                                <p className="font-bold text-gray-900 text-sm">
                                    {details.branch_name || "Cabang Utama"}
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                    {details.branch_address || "-"}
                                </p>
                            </div>
                        </div>
                    )
                )}

                {/* Masa Sewa & Detail Lain */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200/60 mt-4">
                    <div className="flex items-center gap-2 text-gray-500 mb-4">
                        <Calendar size={16} className="text-emerald-500" />
                        <span className="text-xs font-bold uppercase tracking-wide">
                            Rincian Waktu & Jarak
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-400 mb-1">Mulai</p>
                            <p className="font-bold text-gray-900 text-sm">
                                {details.start_date ||
                                    details.tanggal_pindahan ||
                                    "-"}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 mb-1">
                                Durasi / Jarak
                            </p>
                            <p className="font-bold text-gray-900 text-sm">
                                {details.duration_value
                                    ? `${details.duration_value} ${details.duration_unit}`
                                    : details.distance_km
                                    ? `${details.distance_km} KM`
                                    : "-"}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 mb-1">Armada</p>
                            <p className="font-bold text-gray-900 text-sm capitalize">
                                {details.vehicle_type || "-"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Foto Barang */}
                {details.item_photo_path && (
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold mb-3 flex items-center">
                            <ImageIcon
                                size={16}
                                className="mr-1 text-emerald-500"
                            />
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
                                <span className="opacity-0 group-hover:opacity-100 text-white font-bold border-2 border-white px-5 py-2.5 rounded-full backdrop-blur-md flex items-center gap-2 shadow-xl">
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

                {/* Catatan */}
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

export const PaymentVerificationBox = ({ order }) => {
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
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

    const confirmApprove = () => {
        router.post(
            route("admin.orders.approve", order.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => setShowApproveModal(false),
            }
        );
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
                                        alt="Bukti"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="text-white text-xs font-bold border border-white px-3 py-1 rounded-full bg-white/20 backdrop-blur-md">
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
                            <button
                                onClick={() => setShowApproveModal(true)}
                                className="flex-1 flex justify-center items-center px-4 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
                            >
                                <Check className="w-5 h-5 mr-2" /> Terima
                            </button>
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

                {/* --- MODAL KONFIRMASI TERIMA PEMBAYARAN (DIPERCANTIK) --- */}
                <Modal
                    show={showApproveModal}
                    onClose={() => setShowApproveModal(false)}
                    maxWidth="sm"
                >
                    <div className="p-6">
                        {/* 1. Ikon Visual Besar di Tengah */}
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 mb-6 animate-in zoom-in duration-300">
                            <CheckCircle2
                                className="h-8 w-8 text-emerald-600"
                                strokeWidth={2.5}
                            />
                        </div>

                        {/* 2. Judul & Deskripsi Center */}
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-gray-900 mb-2">
                                Terima Pembayaran?
                            </h2>
                            <p className="text-sm text-gray-500 leading-relaxed mb-6">
                                Pastikan dana sebesar{" "}
                                <span className="font-bold text-gray-800">
                                    {formatRupiah(order.final_amount)}
                                </span>{" "}
                                sudah benar-benar masuk ke mutasi rekening
                                perusahaan. Status akan berubah menjadi{" "}
                                <span className="text-emerald-600 font-bold">
                                    Verified
                                </span>
                                .
                            </p>
                        </div>

                        {/* 3. Tombol Aksi Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setShowApproveModal(false)}
                                className="w-full py-3 bg-white border border-gray-300 rounded-xl text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors"
                            >
                                Batal
                            </button>
                            <PrimaryButton
                                onClick={confirmApprove}
                                disabled={processing}
                                className="w-full justify-center py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-200 border-0"
                            >
                                {processing ? "Memproses..." : "Ya"}
                            </PrimaryButton>
                        </div>
                    </div>
                </Modal>

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
                            <InputLabel value="Alasan Penolakan" />
                            <textarea
                                value={data.rejection_reason}
                                onChange={(e) =>
                                    setData("rejection_reason", e.target.value)
                                }
                                className="w-full border-gray-300 rounded-xl mt-1 min-h-[100px]"
                                placeholder="Jelaskan alasan penolakan (misal: bukti buram, nominal tidak sesuai)..."
                                required
                            ></textarea>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowRejectModal(false)}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
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

export const CourierAssignmentBox = ({ order, couriers }) => {
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
                        <select
                            id="courier_id"
                            value={data.courier_id}
                            onChange={(e) =>
                                setData("courier_id", e.target.value)
                            }
                            className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-xl text-sm block p-3 pr-8 focus:ring-blue-500 focus:border-blue-500"
                            disabled={couriers.length === 0}
                        >
                            <option value="">-- Pilih Kurir Tersedia --</option>
                            {couriers.map((courier) => (
                                <option
                                    key={courier.id}
                                    value={courier.id}
                                    disabled={
                                        courier.courier_status !== "available"
                                    }
                                    className={
                                        courier.courier_status !== "available"
                                            ? "text-gray-400 bg-gray-50"
                                            : "font-bold text-gray-900"
                                    }
                                >
                                    {courier.name} —{" "}
                                    {courier.courier_status === "available"
                                        ? "Ready"
                                        : "Sibuk/Offline"}
                                </option>
                            ))}
                        </select>
                    </div>
                    <PrimaryButton
                        className="w-full justify-center rounded-xl py-3 bg-blue-600 hover:bg-blue-700 shadow-lg"
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

export const StorageStatusBox = ({ order }) => {
    const { post, processing } = useForm();
    const [showCompleteModal, setShowCompleteModal] = useState(false);

    const handleComplete = () => {
        post(route("admin.orders.complete", order.id), {
            onSuccess: () => setShowCompleteModal(false),
        });
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
            <>
                <div className="bg-white rounded-2xl p-1 border border-indigo-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500"></div>
                    <div className="p-5 pl-7">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <Box className="w-5 h-5 mr-2 text-indigo-500" />{" "}
                            Status Penyimpanan
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
                            onClick={() => setShowCompleteModal(true)}
                            disabled={processing}
                            className="w-full justify-center py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-sm shadow-lg"
                        >
                            <PackageCheck className="w-4 h-4 mr-2" /> Selesaikan
                            (Barang Diambil)
                        </PrimaryButton>
                    </div>
                </div>

                <Modal
                    show={showCompleteModal}
                    onClose={() => setShowCompleteModal(false)}
                >
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-indigo-100 rounded-full text-indigo-600">
                                <PackageCheck size={24} />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900">
                                Selesaikan Pesanan?
                            </h2>
                        </div>
                        <p className="text-sm text-gray-600 mb-6">
                            Pastikan barang sudah benar-benar dikembalikan ke
                            customer. Tindakan ini akan menutup transaksi dan
                            status akan berubah menjadi <b>Completed</b>.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowCompleteModal(false)}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                            >
                                Batal
                            </button>
                            <PrimaryButton
                                onClick={handleComplete}
                                disabled={processing}
                                className="bg-indigo-600 hover:bg-indigo-700"
                            >
                                {processing
                                    ? "Memproses..."
                                    : "Ya, Selesaikan Order"}
                            </PrimaryButton>
                        </div>
                    </div>
                </Modal>
            </>
        );
    return null;
};

export const TrackingHistoryBox = ({ order }) => {
    const trackings = order.trackings || [];
    const [selectedImage, setSelectedImage] = useState(null);
    if (trackings.length === 0) return null;
    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Flag className="w-5 h-5 mr-2 text-purple-500" /> Riwayat &
                Bukti Lapangan
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
                        <div className="flex-1 bg-gray-50 p-4 rounded-xl text-sm border border-gray-100 hover:border-purple-200 transition-colors">
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
