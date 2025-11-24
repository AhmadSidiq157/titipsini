import React, { useState, useEffect } from "react";
import Modal from "@/Components/Modal";
import { Link, useForm } from "@inertiajs/react";
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
} from "lucide-react";

// Helper function
const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number || 0);
};

// --- Helper: Image Modal (Lightbox) ---
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

// --- 1. KOTAK LIVE TRACKING ---
const TrackingMonitorBox = ({ order }) => {
    if (!order.courier) return null;

    const [courierPos, setCourierPos] = useState({ lat: null, lng: null });
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(null);

    const fetchLocation = () => {
        axios
            .get(route("admin.pindahan.courier-location", order.courier.id))
            .then((res) => {
                if (res.data.lat && res.data.lng) {
                    setCourierPos({
                        lat: parseFloat(res.data.lat),
                        lng: parseFloat(res.data.lng),
                    });
                    setLastUpdate(res.data.last_update);
                }
            })
            .catch((err) => console.error("Gagal tracking:", err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchLocation();
        const interval = setInterval(fetchLocation, 5000);
        return () => clearInterval(interval);
    }, [order.courier.id]);

    const isLive = ["on_delivery", "picked_up", "ready_for_pickup"].includes(
        order.status
    );

    return (
        <div className="bg-white rounded-2xl border border-indigo-100 shadow-lg shadow-indigo-500/5 overflow-hidden mb-6 relative">
            {/* Header Monitor */}
            <div className="p-4 bg-gradient-to-r from-indigo-600 to-blue-600 flex justify-between items-center text-white">
                <h3 className="text-sm font-bold flex items-center uppercase tracking-wider">
                    <MapIcon className="w-4 h-4 mr-2" />
                    GPS Monitor
                </h3>
                {isLive ? (
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-[10px] font-bold">
                            LIVE TRACKING
                        </span>
                    </div>
                ) : (
                    <span className="text-[10px] bg-gray-500/50 px-2 py-1 rounded text-gray-200">
                        OFFLINE
                    </span>
                )}
            </div>

            {/* Map Container */}
            <div className="relative h-72 bg-gray-100">
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

                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-3 py-2 rounded-lg shadow-sm border border-gray-200 text-xs">
                    <p className="font-bold text-gray-800">Posisi Terkini</p>
                    <p className="text-gray-500">
                        {courierPos.lat
                            ? `${courierPos.lat}, ${courierPos.lng}`
                            : "Tidak diketahui"}
                    </p>
                    {lastUpdate && (
                        <p className="text-[10px] text-indigo-500 mt-1">
                            Update: {lastUpdate}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- 2. KOTAK DETAIL PESANAN ---
const OrderDetailsBox = ({ order }) => {
    const details = order.user_form_details;
    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center pb-4 border-b border-gray-50">
                <FileText className="w-5 h-5 mr-2 text-indigo-500" />
                Detail Pindahan
            </h3>

            <div className="space-y-6">
                {/* Info Klien */}
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 border border-indigo-100">
                        <User size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                            Klien
                        </p>
                        <p className="font-bold text-gray-900 text-base">
                            {order.user.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                                {order.user.email}
                            </span>
                            <a
                                href={`tel:${details.telepon}`}
                                className="flex items-center gap-1 text-xs text-indigo-600 font-bold hover:underline"
                            >
                                <Phone size={10} /> {details.telepon}
                            </a>
                        </div>
                    </div>
                </div>

                {/* Tanggal */}
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100">
                        <Calendar size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                            Jadwal Pindahan
                        </p>
                        <p className="font-bold text-gray-900 text-base">
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

                {/* Visual Timeline Rute */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 relative overflow-hidden">
                    <div className="absolute left-[29px] top-10 bottom-10 w-0.5 border-l-2 border-dashed border-gray-300 z-0"></div>

                    {/* Asal */}
                    <div className="relative z-10 mb-6">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-white border-4 border-blue-500 shadow-sm flex-shrink-0 mt-0.5"></div>
                            <div>
                                <p className="text-[10px] text-blue-500 uppercase font-bold mb-0.5">
                                    Lokasi Penjemputan (Asal)
                                </p>
                                <p className="text-sm font-medium text-gray-800 leading-snug">
                                    {details.alamat_penjemputan}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Tujuan */}
                    <div className="relative z-10">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-white border-4 border-green-500 shadow-sm flex-shrink-0 mt-0.5"></div>
                            <div>
                                <p className="text-[10px] text-green-500 uppercase font-bold mb-0.5">
                                    Lokasi Tujuan
                                </p>
                                <p className="text-sm font-medium text-gray-800 leading-snug">
                                    {details.alamat_tujuan}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {details.notes && (
                    <div className="bg-yellow-50 p-4 rounded-xl text-sm text-yellow-800 border border-yellow-100 flex gap-3">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 opacity-50" />
                        <div>
                            <span className="font-bold block mb-1 text-yellow-900">
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

// --- 3. [BARU] KOTAK RIWAYAT TRACKING & BUKTI ---
const TrackingHistoryBox = ({ order }) => {
    const trackings = order.trackings || [];
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Flag className="w-5 h-5 mr-2 text-purple-500" />
                Riwayat & Bukti Lapangan
            </h3>

            <div className="space-y-6 relative pl-2">
                <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gray-200"></div>

                {trackings.length > 0 ? (
                    trackings.map((log, index) => (
                        <div
                            key={log.id}
                            className="relative flex gap-4 items-start group"
                        >
                            {/* Dot Indicator */}
                            <div
                                className={`relative z-10 w-7 h-7 rounded-full border-2 border-white shadow-sm flex items-center justify-center flex-shrink-0 ${
                                    index === 0
                                        ? "bg-purple-600 text-white"
                                        : "bg-gray-200 text-gray-500"
                                }`}
                            >
                                <Clock size={12} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 bg-gray-50 p-4 rounded-xl text-sm border border-gray-100 hover:border-purple-200 hover:bg-purple-50/50 transition-colors">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold text-gray-800">
                                        {log.status}
                                    </span>
                                    <span className="text-[10px] text-gray-400">
                                        {new Date(
                                            log.created_at
                                        ).toLocaleString("id-ID")}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-2">
                                    {log.description}
                                </p>

                                {/* Tampilkan Tombol Bukti Jika Ada */}
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
                    ))
                ) : (
                    <div className="text-center py-4 text-gray-400 text-sm italic">
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

// --- 4. KOTAK VERIFIKASI PEMBAYARAN ---
const PaymentVerificationBox = ({ order }) => {
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showImage, setShowImage] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        rejection_reason: "",
    });

    const submitReject = (e) => {
        e.preventDefault();
        post(route("admin.pindahan.reject", order.id), {
            only: ["orders", "flash"],
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
                    <ShieldCheck className="w-5 h-5 mr-2 text-orange-500" />
                    Verifikasi Pembayaran
                </h3>
                {order.payment ? (
                    <div className="space-y-4">
                        <div
                            className="group relative h-40 w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-100 cursor-pointer"
                            onClick={() => setShowImage(true)}
                        >
                            <img
                                src={proofPath}
                                alt="Bukti"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="bg-white/90 backdrop-blur text-gray-800 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1">
                                    <Maximize2 size={14} /> Perbesar
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Link
                                href={route("admin.pindahan.approve", order.id)}
                                method="post"
                                as="button"
                                className="flex-1 inline-flex justify-center items-center px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 transform hover:-translate-y-0.5"
                                onBefore={() =>
                                    confirm("Setujui pembayaran ini?")
                                }
                                preserveScroll
                                only={["orders", "flash"]}
                            >
                                <Check className="w-4 h-4 mr-2" /> Terima
                            </Link>
                            <button
                                onClick={() => setShowRejectModal(true)}
                                className="flex-1 inline-flex justify-center items-center px-4 py-2.5 bg-white border border-red-200 text-red-600 rounded-xl font-bold text-sm hover:bg-red-50 transition-colors"
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
                    <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex flex-col items-center">
                        <Clock className="w-8 h-8 mb-2 opacity-50" />
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
                            className="w-full border-gray-300 rounded-xl text-sm focus:ring-red-500 focus:border-red-500"
                            rows="3"
                            placeholder="Alasan..."
                        ></textarea>
                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setShowRejectModal(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
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
            only: ["orders", "flash"],
            preserveScroll: true,
        });
    };
    const getStatusInfo = (status) => {
        switch (status) {
            case "available":
                return { label: "🟢 Tersedia", disabled: false };
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
                    <Truck className="w-5 h-5 mr-2 text-blue-500" />
                    Tugaskan Armada
                </h3>
                {order.courier ? (
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-100 text-blue-800 rounded-xl flex items-center justify-between">
                        <div>
                            <p className="text-[10px] text-blue-500 uppercase font-bold tracking-wider mb-1">
                                Armada Saat Ini
                            </p>
                            <p className="font-bold text-lg">
                                {order.courier.name}
                            </p>
                        </div>
                        <div className="bg-white p-2 rounded-full shadow-sm">
                            <User className="w-5 h-5 text-blue-500" />
                        </div>
                    </div>
                ) : (
                    <div className="mb-4 p-3 bg-amber-50 text-amber-800 text-sm rounded-xl border border-amber-100 flex gap-2 items-start">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <p>Pesanan lunas. Segera tugaskan kurir.</p>
                    </div>
                )}
                <form onSubmit={submit} className="space-y-3">
                    <div>
                        <InputLabel
                            htmlFor="courier_id"
                            value="Pilih Driver"
                            className="text-xs uppercase text-gray-500 mb-1"
                        />
                        <select
                            id="courier_id"
                            value={data.courier_id}
                            onChange={(e) =>
                                setData("courier_id", e.target.value)
                            }
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3"
                            disabled={couriers.length === 0}
                        >
                            <option value="">-- Pilih Driver --</option>
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
                                                ? "text-gray-400"
                                                : "font-bold"
                                        }
                                    >
                                        {courier.name} — {info.label}
                                    </option>
                                );
                            })}
                        </select>
                        <InputError
                            message={errors.courier_id}
                            className="mt-1"
                        />
                    </div>
                    <PrimaryButton
                        className="w-full justify-center rounded-xl py-3 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
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

// --- KOMPONEN UTAMA ---
export default function ManageOrderModal({ show, onClose, order, couriers }) {
    if (!order) return null;
    const showMap =
        order.courier &&
        ["picked_up", "on_delivery", "ready_for_pickup"].includes(order.status);

    return (
        <Modal show={show} onClose={onClose} maxWidth="7xl">
            <div className="bg-gray-50/50 min-h-[80vh] flex flex-col">
                <div className="px-8 py-5 bg-white border-b border-gray-200 sticky top-0 z-20 flex justify-between items-center shadow-sm">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-black text-gray-900">
                                Order #{order.id}
                            </h2>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                    order.status === "processing"
                                        ? "bg-pink-100 text-pink-700 border border-pink-200"
                                        : "bg-gray-100 text-gray-700 border border-gray-200"
                                }`}
                            >
                                {order.status.replace(/_/g, " ")}
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm font-medium mt-1">
                            Paket: {order.orderable.name}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition text-gray-500 hover:text-gray-800"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto flex-1">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-7 space-y-8">
                            {showMap && <TrackingMonitorBox order={order} />}
                            <OrderDetailsBox order={order} />
                            {/* TAMBAHKAN COMPONENT HISTORY DI SINI */}
                            <TrackingHistoryBox order={order} />
                        </div>

                        <div className="lg:col-span-5 space-y-8">
                            {order.status === "awaiting_verification" && (
                                <PaymentVerificationBox order={order} />
                            )}
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
                            {order.status === "completed" && (
                                <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-200 text-center shadow-sm">
                                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                                        <Check size={40} strokeWidth={3} />
                                    </div>
                                    <h3 className="text-xl font-black text-emerald-800 mb-1">
                                        Pesanan Selesai
                                    </h3>
                                    <p className="text-emerald-600">
                                        Seluruh proses pindahan telah rampung.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
