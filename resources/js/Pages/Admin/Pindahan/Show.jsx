import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import DangerButton from "@/Components/DangerButton";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import LiveMap from "@/Components/LiveMap";
import axios from "axios";
import {
    Check,
    X,
    Truck,
    User,
    MapPin,
    Calendar,
    FileText,
    Map as MapIcon,
    ShieldCheck,
    AlertCircle,
    Clock,
    Phone,
    Maximize2,
    Search,
    Navigation,
    Flag,
    ImageIcon,
    CheckCircle2,
    ArrowLeft,
    ExternalLink,
    MessageCircle,
    Copy,
    Printer,
} from "lucide-react";

// --- Helper Functions ---

const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number || 0);
};

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

const ImageModal = ({ show, onClose, src, title }) =>
    show && (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="relative max-w-4xl w-full max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
                >
                    <X size={32} />
                </button>
                <img
                    src={src}
                    alt={title}
                    className="w-full h-full object-contain rounded-lg shadow-2xl"
                />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm backdrop-blur-md border border-white/10">
                    {title}
                </div>
            </div>
        </div>
    );

// --- 1. STATUS STEPPER (Timeline) ---
const OrderStepper = ({ status }) => {
    const steps = [
        { key: "awaiting_payment", label: "Menunggu Bayar", icon: Clock },
        {
            key: "awaiting_verification",
            label: "Verifikasi",
            icon: ShieldCheck,
        },
        { key: "ready_for_pickup", label: "Penjemputan", icon: Truck },
        { key: "on_delivery", label: "Dalam Perjalanan", icon: MapIcon },
        { key: "delivered", label: "Sampai Tujuan", icon: MapPin },
        { key: "completed", label: "Selesai", icon: CheckCircle2 },
    ];

    let activeIndex = steps.findIndex((s) => s.key === status);

    // Normalisasi Index untuk status yang tumpang tindih
    if (status === "verified" || status === "processing") activeIndex = 2; // Masuk tahap penjemputan
    if (status === "picked_up") activeIndex = 3; // Sedang jalan

    if (activeIndex === -1 && ["cancelled", "rejected"].includes(status))
        activeIndex = -1;

    return (
        <div className="w-full py-6 px-4 bg-white border-b border-gray-200 mb-6 overflow-x-auto">
            <div className="flex items-center justify-between min-w-[700px] max-w-5xl mx-auto relative">
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

// --- 2. KOTAK LIVE TRACKING ---
const TrackingMonitorBox = ({ order }) => {
    const [courierPos, setCourierPos] = useState({ lat: null, lng: null });
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(null);

    const fetchLocation = () => {
        if (!order.courier) return;
        axios
            .get(route("admin.pindahan.courier-location", order.courier.id))
            .then((res) => {
                if (res.data.lat && res.data.lng) {
                    setCourierPos({
                        lat: parseFloat(res.data.lat),
                        lng: parseFloat(res.data.lng),
                    });
                    setLastUpdate(res.data.updated_at);
                }
            })
            .catch((err) => console.error("Gagal tracking:", err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchLocation();
        const interval = setInterval(fetchLocation, 10000);
        return () => clearInterval(interval);
    }, [order.courier?.id]);

    const isLive = ["on_delivery", "picked_up", "ready_for_pickup"].includes(
        order.status
    );

    return (
        <div className="bg-white rounded-2xl border border-indigo-100 shadow-lg shadow-indigo-500/5 overflow-hidden mb-6 relative">
            <div className="p-4 bg-gradient-to-r from-indigo-600 to-blue-600 flex justify-between items-center text-white">
                <h3 className="text-sm font-bold flex items-center uppercase tracking-wider">
                    <MapIcon className="w-4 h-4 mr-2" /> GPS Monitor
                </h3>
                {isLive ? (
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-[10px] font-bold">LIVE</span>
                    </div>
                ) : (
                    <span className="text-[10px] bg-gray-500/50 px-2 py-1 rounded text-gray-200">
                        OFFLINE
                    </span>
                )}
            </div>
            <div className="relative h-96 bg-gray-100">
                {courierPos.lat ? (
                    <LiveMap
                        courierLat={courierPos.lat}
                        courierLng={courierPos.lng}
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                        <Navigation className="w-10 h-10 mb-2 opacity-20" />
                        <p className="text-sm font-medium">
                            {loading
                                ? "Menghubungkan Satelit..."
                                : "Menunggu Sinyal Kurir..."}
                        </p>
                    </div>
                )}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-lg border border-gray-200 text-xs z-10">
                    <p className="font-bold text-gray-800 mb-0.5">
                        Posisi Terkini
                    </p>
                    <p className="text-gray-500 font-mono">
                        {courierPos.lat
                            ? `${courierPos.lat}, ${courierPos.lng}`
                            : "Tidak diketahui"}
                    </p>
                    {lastUpdate && (
                        <p className="text-[10px] text-indigo-600 mt-1 font-bold flex items-center gap-1">
                            <Clock size={10} /> {lastUpdate}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- 3. KOTAK DETAIL PESANAN ---
const OrderDetailsBox = ({ order }) => {
    const details = order.user_form_details || {};

    return (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm h-full">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center pb-4 border-b border-gray-100">
                <FileText className="w-5 h-5 mr-2 text-indigo-500" /> Detail
                Pindahan
            </h3>

            <div className="space-y-8">
                {/* Klien */}
                <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 border border-indigo-100 flex-shrink-0">
                        <User size={24} />
                    </div>
                    <div className="flex-1">
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">
                            Klien
                        </p>
                        <div className="flex items-center gap-2">
                            <p className="font-bold text-gray-900 text-lg">
                                {order.user.name}
                            </p>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">
                            {order.user.email}
                        </p>
                        {details.telepon && (
                            <a
                                href={`https://wa.me/${details.telepon
                                    .replace(/\D/g, "")
                                    .replace(/^0/, "62")}`}
                                target="_blank"
                                className="inline-flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors"
                            >
                                <MessageCircle size={14} /> {details.telepon}
                            </a>
                        )}
                    </div>
                </div>

                {/* Jadwal */}
                <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100 flex-shrink-0">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">
                            Jadwal Pindahan
                        </p>
                        <p className="font-bold text-gray-900 text-lg">
                            {new Date(
                                details.tanggal_pindahan
                            ).toLocaleDateString("id-ID", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </p>
                    </div>
                </div>

                {/* Visual Rute */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 relative overflow-hidden">
                    {/* Connector Line */}
                    <div className="absolute left-[33px] top-10 bottom-10 w-0.5 border-l-2 border-dashed border-gray-300 z-0"></div>

                    <div className="relative z-10 mb-8 flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-white border-4 border-blue-500 shadow-sm flex-shrink-0 flex items-center justify-center z-10">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-blue-500 font-bold uppercase mb-1">
                                Lokasi Penjemputan (Asal)
                            </p>
                            <p className="text-sm font-medium text-gray-800 leading-relaxed">
                                {details.alamat_penjemputan}
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-white border-4 border-green-500 shadow-sm flex-shrink-0 flex items-center justify-center z-10">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-green-500 font-bold uppercase mb-1">
                                Lokasi Tujuan
                            </p>
                            <p className="text-sm font-medium text-gray-800 leading-relaxed">
                                {details.alamat_tujuan}
                            </p>
                        </div>
                    </div>
                </div>

                {details.notes && (
                    <div className="bg-amber-50 p-5 rounded-2xl text-sm text-amber-800 border border-amber-100 flex gap-3">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 opacity-60 mt-0.5" />
                        <div>
                            <span className="font-bold block mb-1 text-amber-900 uppercase text-xs">
                                Catatan Tambahan:
                            </span>
                            <span className="italic">"{details.notes}"</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- 4. KOTAK RIWAYAT TRACKING ---
const TrackingHistoryBox = ({ order }) => {
    const trackings = order.trackings || [];
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Flag className="w-5 h-5 mr-2 text-purple-500" />
                Riwayat & Bukti Lapangan
            </h3>

            <div className="space-y-8 relative pl-2 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                <div className="absolute left-[15px] top-3 bottom-3 w-0.5 bg-gray-200"></div>

                {trackings.length > 0 ? (
                    trackings.map((log, index) => (
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
                            <div className="flex-1 bg-gray-50 p-4 rounded-xl text-sm border border-gray-100 hover:border-purple-200 hover:bg-purple-50/30 transition-colors">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold text-gray-800">
                                        {log.status}
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-medium">
                                        {new Date(
                                            log.created_at
                                        ).toLocaleString("id-ID")}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-2 leading-relaxed">
                                    {log.description}
                                </p>

                                {log.evidence_photo_path && (
                                    <button
                                        onClick={() =>
                                            setSelectedImage(
                                                `/storage/${log.evidence_photo_path}`
                                            )
                                        }
                                        className="mt-2 inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:text-purple-600 hover:border-purple-300 shadow-sm transition-all"
                                    >
                                        <ImageIcon size={14} /> Lihat Foto Bukti
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-400 text-sm italic bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        Belum ada riwayat tracking.
                    </div>
                )}
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

// --- 5. KOTAK VERIFIKASI PEMBAYARAN ---
const PaymentVerificationBox = ({ order }) => {
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showImage, setShowImage] = useState(false);
    const { data, setData, post, processing, reset } = useForm({
        rejection_reason: "",
    });

    const submitReject = (e) => {
        e.preventDefault();
        post(route("admin.pindahan.reject", order.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowRejectModal(false);
                reset();
            },
        });
    };

    const proofPath = order.payment
        ? `/storage/${order.payment.payment_proof_path}`
        : null;

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
                        <div
                            className="group relative h-48 w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-100 cursor-pointer"
                            onClick={() => setShowImage(true)}
                        >
                            <img
                                src={proofPath}
                                alt="Bukti"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="bg-white/90 backdrop-blur text-gray-800 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
                                    <Maximize2 size={16} /> Perbesar
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Link
                                href={route("admin.pindahan.approve", order.id)}
                                method="post"
                                as="button"
                                className="flex-1 inline-flex justify-center items-center px-4 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 transform hover:-translate-y-0.5"
                                onBefore={() =>
                                    confirm("Setujui pembayaran ini?")
                                }
                                preserveScroll
                            >
                                <Check className="w-4 h-4 mr-2" /> Terima
                            </Link>
                            <button
                                onClick={() => setShowRejectModal(true)}
                                className="flex-1 inline-flex justify-center items-center px-4 py-3 bg-white border border-red-200 text-red-600 rounded-xl font-bold text-sm hover:bg-red-50 transition-colors"
                            >
                                <X className="w-4 h-4 mr-2" /> Tolak
                            </button>
                        </div>
                        <ImageModal
                            show={showImage}
                            onClose={() => setShowImage(false)}
                            src={proofPath}
                            title="Bukti Pembayaran"
                        />
                    </div>
                ) : (
                    <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <Clock className="w-8 h-8 mb-2 mx-auto opacity-50" />
                        <p className="text-sm">Menunggu upload bukti...</p>
                    </div>
                )}

                <Modal
                    show={showRejectModal}
                    onClose={() => setShowRejectModal(false)}
                >
                    <form onSubmit={submitReject} className="p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <AlertCircle className="text-red-500" /> Tolak
                            Pembayaran
                        </h2>
                        <textarea
                            value={data.rejection_reason}
                            onChange={(e) =>
                                setData("rejection_reason", e.target.value)
                            }
                            className="w-full border-gray-300 rounded-xl text-sm focus:ring-red-500 p-3"
                            rows="3"
                            placeholder="Alasan penolakan..."
                        ></textarea>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowRejectModal(false)}
                                className="px-4 py-2 bg-gray-100 rounded-lg font-bold text-gray-600"
                            >
                                Batal
                            </button>
                            <DangerButton
                                disabled={processing}
                                className="rounded-lg"
                            >
                                Tolak
                            </DangerButton>
                        </div>
                    </form>
                </Modal>
            </div>
        </div>
    );
};

// --- 5. KOTAK TUGASKAN KURIR ---
const AssignCourierBox = ({ order, couriers }) => {
    const { data, setData, post, processing, errors } = useForm({
        courier_id: order.courier_id || "",
    });
    useEffect(() => {
        setData("courier_id", order.courier_id || "");
    }, [order]);
    const submit = (e) => {
        e.preventDefault();
        post(route("admin.pindahan.assignCourier", order.id), {
            preserveScroll: true,
        });
    };

    return (
        <div className="bg-white rounded-2xl p-1 border border-blue-100 shadow-lg shadow-blue-500/5 relative overflow-hidden mb-6 group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500 group-hover:w-2 transition-all"></div>
            <div className="p-5 pl-7">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Truck className="w-5 h-5 mr-2 text-blue-500" /> Tugaskan
                    Armada
                </h3>
                {order.courier ? (
                    <div className="mb-5 p-4 bg-gradient-to-br from-blue-50 to-white border border-blue-100 text-blue-800 rounded-xl flex items-center justify-between">
                        <div>
                            <p className="text-[10px] text-blue-500 uppercase font-bold tracking-wider mb-1">
                                Armada Saat Ini
                            </p>
                            <p className="font-bold text-lg">
                                {order.courier.name}
                            </p>
                        </div>
                        <div className="bg-white p-2 rounded-full shadow-sm border border-blue-50">
                            <User className="w-5 h-5 text-blue-500" />
                        </div>
                    </div>
                ) : (
                    <div className="mb-5 p-3 bg-amber-50 text-amber-800 text-sm rounded-xl border border-amber-100 flex gap-2 items-start">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <p>Pesanan lunas. Segera tugaskan kurir.</p>
                    </div>
                )}
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <InputLabel
                            htmlFor="courier_id"
                            value="Pilih Driver"
                            className="text-xs uppercase text-gray-500 mb-1"
                        />
                        <div className="relative">
                            <select
                                id="courier_id"
                                value={data.courier_id}
                                onChange={(e) =>
                                    setData("courier_id", e.target.value)
                                }
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 appearance-none"
                                disabled={couriers.length === 0}
                            >
                                <option value="">-- Pilih Driver --</option>
                                {couriers.map((courier) => (
                                    <option
                                        key={courier.id}
                                        value={courier.id}
                                        className="font-bold text-gray-900"
                                    >
                                        {courier.name} —{" "}
                                        {courier.courier_status === "available"
                                            ? "🟢 Ready"
                                            : "🔴 Sibuk"}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <InputError
                            message={errors.courier_id}
                            className="mt-1"
                        />
                    </div>
                    <PrimaryButton
                        className="w-full justify-center rounded-xl py-3 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
                        disabled={processing || !data.courier_id}
                    >
                        {processing
                            ? "Menyimpan..."
                            : order.courier
                            ? "Ganti Armada"
                            : "Tugaskan Sekarang"}
                    </PrimaryButton>
                </form>
            </div>
        </div>
    );
};

// --- 6. KOTAK PENYELESAIAN ---
const CompletionBox = ({ order }) => {
    const { post, processing } = useForm();
    const handleComplete = () => {
        if (confirm("Yakin pesanan selesai?"))
            post(route("admin.pindahan.complete", order.id), {
                preserveScroll: true,
            });
    };
    return (
        <div className="bg-white rounded-2xl p-1 border border-green-100 shadow-lg shadow-green-500/10 relative overflow-hidden mb-6 group animate-in slide-in-from-bottom-2">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500 group-hover:w-2 transition-all"></div>
            <div className="p-6 pl-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-full text-green-600">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-gray-900">
                            Konfirmasi Selesai
                        </h3>
                        <p className="text-xs text-gray-500">
                            Barang sudah diterima pelanggan.
                        </p>
                    </div>
                </div>
                <PrimaryButton
                    onClick={handleComplete}
                    disabled={processing}
                    className="w-full justify-center py-3.5 bg-green-600 hover:bg-green-700 rounded-xl text-sm font-bold shadow-lg shadow-green-200 transform hover:-translate-y-0.5 transition-all"
                >
                    {processing ? "Memproses..." : "✅ Tandai Pesanan Selesai"}
                </PrimaryButton>
            </div>
        </div>
    );
};

// --- KOMPONEN UTAMA (PAGE) ---
export default function Show({ auth, order, couriers }) {
    const { flash } = usePage().props;
    const showMap =
        order.courier &&
        ["picked_up", "on_delivery", "ready_for_pickup", "delivered"].includes(
            order.status
        );

    return (
        <AdminLayout user={auth.user} header={null}>
            <Head title={`Detail Pindahan #${order.id}`} />

            <div className="min-h-screen bg-gray-50/50 pb-20 font-sans">
                {/* Sticky Header */}
                <div className="px-8 py-4 bg-white border-b border-gray-200 sticky top-0 z-30 flex justify-between items-center shadow-sm backdrop-blur-md bg-white/90">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route("admin.pindahan.index")}
                            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                                    Pindahan #{order.id}
                                </h2>
                                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-700 border border-gray-200">
                                    {order.status.replace(/_/g, " ")}
                                </span>
                            </div>
                            <p className="text-gray-500 text-sm font-medium mt-0.5">
                                Paket: {order.orderable.name}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right mr-4 hidden md:block">
                            <p className="text-xs text-gray-400 font-bold uppercase">
                                Total Biaya
                            </p>
                            <p className="text-lg font-black text-emerald-600">
                                {formatRupiah(order.final_amount)}
                            </p>
                        </div>
                        <button
                            onClick={() => window.print()}
                            className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            <Printer size={20} />
                        </button>
                    </div>
                </div>

                {/* Stepper Timeline */}
                <OrderStepper status={order.status} />

                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {flash.success && (
                        <div className="mb-8 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-4 rounded-2xl flex items-center shadow-sm animate-in slide-in-from-top-2">
                            <CheckCircle2 className="w-5 h-5 mr-2" />{" "}
                            <span className="font-medium">{flash.success}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                        {/* --- KOLOM KIRI (7/12): Peta & Detail --- */}
                        <div className="xl:col-span-7 space-y-8">
                            {/* Map hanya muncul jika ada kurir aktif */}
                            {showMap && <TrackingMonitorBox order={order} />}
                            <OrderDetailsBox order={order} />
                        </div>

                        {/* --- KOLOM KANAN (5/12): Aksi & Riwayat --- */}
                        <div className="xl:col-span-5 space-y-8 sticky top-24">
                            {/* 1. Verifikasi Pembayaran */}
                            {order.status === "awaiting_verification" && (
                                <PaymentVerificationBox order={order} />
                            )}

                            {/* 2. Penugasan Kurir */}
                            {[
                                "processing",
                                "ready_for_pickup",
                                "picked_up",
                                "on_delivery",
                            ].includes(order.status) && (
                                <AssignCourierBox
                                    order={order}
                                    couriers={couriers}
                                />
                            )}

                            {/* 3. Konfirmasi Selesai */}
                            {order.status === "delivered" && (
                                <CompletionBox order={order} />
                            )}

                            {/* 4. Status Selesai */}
                            {order.status === "completed" && (
                                <div className="bg-emerald-50 p-10 rounded-3xl border border-emerald-200 text-center shadow-sm">
                                    <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                        <Check size={48} strokeWidth={3} />
                                    </div>
                                    <h3 className="text-2xl font-black text-emerald-800 mb-2">
                                        Pesanan Selesai
                                    </h3>
                                    <p className="text-emerald-600">
                                        Proses pindahan telah sukses.
                                    </p>
                                </div>
                            )}

                            {/* 5. Riwayat Tracking (Dipindah ke Kanan) */}
                            <TrackingHistoryBox order={order} />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
