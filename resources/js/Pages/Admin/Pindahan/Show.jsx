import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import DangerButton from "@/Components/DangerButton";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import LiveMap from "@/Components/LiveMap";
import Modal from "@/Components/Modal";
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
    Navigation,
    Flag,
    ImageIcon,
    CheckCircle2,
    ArrowLeft,
    MessageCircle,
    Copy,
    Maximize2,
} from "lucide-react";

// --- Helper Functions ---
const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number || 0);
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

// --- 1. STATUS STEPPER ---
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
    if (status === "verified" || status === "processing") activeIndex = 2;
    if (status === "picked_up") activeIndex = 3;
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
                                <step.icon size={18} />
                            </div>
                            <span
                                className={`text-xs font-bold whitespace-nowrap transition-colors ${
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

// --- 2. KOTAK LIVE TRACKING KURIR (BERGERAK SENDIRI) ---
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
                    setLastUpdate(new Date().toLocaleTimeString("id-ID"));
                }
            })
            .catch((err) => console.error("Tracking error:", err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchLocation();
        const interval = setInterval(fetchLocation, 10000);
        return () => clearInterval(interval);
    }, [order.courier?.id]);

    return (
        <div className="bg-white rounded-2xl border border-indigo-100 shadow-lg overflow-hidden mb-6 relative">
            <div className="p-4 bg-indigo-600 text-white flex justify-between items-center">
                <h3 className="font-bold flex items-center gap-2">
                    <Truck size={18} /> Posisi Kurir (Live)
                </h3>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-[10px] bg-white/20 px-2 py-1 rounded">
                        Update: {lastUpdate || "Menunggu..."}
                    </span>
                </div>
            </div>
            <div className="relative h-80 bg-gray-100">
                {courierPos.lat ? (
                    <LiveMap
                        courierLat={courierPos.lat}
                        courierLng={courierPos.lng}
                        isTracking={true}
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                        <Truck className="w-12 h-12 mb-2 opacity-20 animate-pulse" />
                        <p className="text-sm">
                            Menunggu sinyal GPS dari kurir...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- 3. KOTAK LOKASI PENJEMPUTAN (STATIS/TUJUAN) ---
const PickupLocationBox = ({ order }) => {
    const details = order.user_form_details || {};
    const [location, setLocation] = useState({
        lat: details.latitude ? parseFloat(details.latitude) : null,
        lng: details.longitude ? parseFloat(details.longitude) : null,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!location.lat && details.alamat_penjemputan) {
            setLoading(true);
            axios
                .get(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                        details.alamat_penjemputan
                    )}`
                )
                .then((res) => {
                    if (res.data && res.data.length > 0) {
                        setLocation({
                            lat: parseFloat(res.data[0].lat),
                            lng: parseFloat(res.data[0].lon),
                        });
                    }
                })
                .finally(() => setLoading(false));
        }
    }, [details.alamat_penjemputan]);

    return (
        <div className="bg-white rounded-2xl border border-red-100 shadow-lg shadow-red-500/5 overflow-hidden mb-6 relative">
            <div className="p-4 bg-gradient-to-r from-red-500 to-pink-600 flex justify-between items-center text-white">
                <h3 className="text-sm font-bold flex items-center uppercase tracking-wider">
                    <MapIcon className="w-4 h-4 mr-2" /> Lokasi Penjemputan
                </h3>
            </div>
            <div className="relative h-64 bg-gray-100">
                {location.lat ? (
                    <LiveMap
                        lat={location.lat}
                        lng={location.lng}
                        isTracking={false}
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                        <Navigation className="w-10 h-10 mb-2 opacity-20" />
                        <p className="text-sm font-medium">
                            {loading ? "Mencari lokasi..." : "Menunggu data..."}
                        </p>
                    </div>
                )}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-lg border border-gray-200 text-xs z-10 max-w-xs">
                    <p className="font-bold text-gray-800 mb-0.5">Alamat:</p>
                    <p className="text-gray-600 line-clamp-1">
                        {details.alamat_penjemputan}
                    </p>
                </div>
            </div>
        </div>
    );
};

// --- 4. KOTAK DETAIL ---
const OrderDetailsBox = ({ order }) => {
    const details = order.user_form_details || {};
    return (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm h-full">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center pb-4 border-b border-gray-100">
                <FileText className="w-5 h-5 mr-2 text-indigo-500" /> Detail
                Pindahan
            </h3>
            <div className="space-y-8">
                <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 border border-indigo-100 flex-shrink-0">
                        <User size={24} />
                    </div>
                    <div className="flex-1">
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">
                            Klien
                        </p>
                        <p className="font-bold text-gray-900 text-lg">
                            {order.user.name}
                        </p>
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
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 relative overflow-hidden">
                    <div className="absolute left-[33px] top-10 bottom-10 w-0.5 border-l-2 border-dashed border-gray-300 z-0"></div>
                    <div className="relative z-10 mb-8 flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-white border-4 border-blue-500 shadow-sm flex-shrink-0 flex items-center justify-center z-10">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-blue-500 font-bold uppercase mb-1">
                                Asal
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
                                Tujuan
                            </p>
                            <p className="text-sm font-medium text-gray-800 leading-relaxed">
                                {details.alamat_tujuan}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 5. RIWAYAT TRACKING ---
const TrackingHistoryBox = ({ order }) => {
    const trackings = order.trackings || [];
    const [selectedImage, setSelectedImage] = useState(null);
    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Flag className="w-5 h-5 mr-2 text-purple-500" /> Riwayat &
                Bukti
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
                                        <ImageIcon size={14} /> Lihat Foto
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
                title="Bukti Lapangan"
            />
        </div>
    );
};

// --- 6. ACTIONS ---
const PaymentVerificationBox = ({ order }) => {
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showImage, setShowImage] = useState(false);
    const { data, setData, post, processing, reset } = useForm({
        rejection_reason: "",
    });
    const submitReject = (e) => {
        e.preventDefault();
        post(route("admin.pindahan.reject", order.id), {
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
        <div className="bg-white rounded-2xl p-5 border border-orange-100 shadow-sm mb-6">
            <h3 className="font-bold text-gray-900 mb-2">
                Verifikasi Pembayaran
            </h3>
            {order.payment ? (
                <>
                    <div
                        className="h-32 bg-gray-100 rounded-lg overflow-hidden mb-3 cursor-pointer"
                        onClick={() => setShowImage(true)}
                    >
                        <img
                            src={proofPath}
                            className="w-full h-full object-cover"
                            alt="Bukti"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href={route("admin.pindahan.approve", order.id)}
                            method="post"
                            as="button"
                            className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold text-center"
                        >
                            Terima
                        </Link>
                        <button
                            onClick={() => setShowRejectModal(true)}
                            className="flex-1 bg-white border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-bold"
                        >
                            Tolak
                        </button>
                    </div>
                    <ImageModal
                        show={showImage}
                        onClose={() => setShowImage(false)}
                        src={proofPath}
                        title="Bukti Transfer"
                    />
                </>
            ) : (
                <p className="text-sm text-gray-500">Menunggu bukti...</p>
            )}
            <Modal
                show={showRejectModal}
                onClose={() => setShowRejectModal(false)}
            >
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <AlertCircle className="text-red-500" /> Tolak
                        Pembayaran
                    </h2>
                    <textarea
                        value={data.rejection_reason}
                        onChange={(e) =>
                            setData("rejection_reason", e.target.value)
                        }
                        className="w-full border-gray-300 rounded-xl mb-4"
                        placeholder="Alasan..."
                        rows="3"
                    ></textarea>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setShowRejectModal(false)}
                            className="px-4 py-2 bg-gray-100 rounded-lg font-bold text-gray-600"
                        >
                            Batal
                        </button>
                        <DangerButton
                            onClick={submitReject}
                            disabled={processing}
                            className="rounded-lg"
                        >
                            Tolak
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

const AssignCourierBox = ({ order, couriers }) => {
    const { data, setData, post, processing, errors } = useForm({
        courier_id: order.courier_id || "",
    });
    useEffect(() => {
        setData("courier_id", order.courier_id || "");
    }, [order]);
    const submit = (e) => {
        e.preventDefault();
        post(route("admin.pindahan.assignCourier", order.id));
    };

    return (
        <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-sm mb-6">
            <h3 className="font-bold text-gray-900 mb-2">Tugaskan Kurir</h3>
            <form onSubmit={submit}>
                <select
                    value={data.courier_id}
                    onChange={(e) => setData("courier_id", e.target.value)}
                    className="w-full border-gray-300 rounded-lg mb-3 text-sm"
                >
                    <option value="">-- Pilih Kurir --</option>
                    {couriers.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name} ({c.courier_status})
                        </option>
                    ))}
                </select>
                <PrimaryButton
                    disabled={processing}
                    className="w-full justify-center"
                >
                    Simpan Penugasan
                </PrimaryButton>
            </form>
        </div>
    );
};

const CompletionBox = ({ order }) => {
    const { post, processing } = useForm();
    const [confirming, setConfirming] = useState(false);
    const handleComplete = () => {
        post(route("admin.pindahan.complete", order.id), {
            onSuccess: () => setConfirming(false),
        });
    };

    return (
        <>
            <div className="bg-white rounded-2xl p-1 border border-green-100 shadow-lg shadow-green-500/10 mb-6">
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
                        onClick={() => setConfirming(true)}
                        disabled={processing}
                        className="w-full justify-center py-3.5 bg-green-600 hover:bg-green-700 rounded-xl text-sm font-bold shadow-lg shadow-green-200"
                    >
                        ✅ Tandai Pesanan Selesai
                    </PrimaryButton>
                </div>
            </div>
            <Modal show={confirming} onClose={() => setConfirming(false)}>
                <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 animate-in zoom-in">
                        <CheckCircle2 size={40} strokeWidth={3} />
                    </div>
                    <h2 className="text-xl font-black text-gray-900 mb-2">
                        Selesaikan Pesanan?
                    </h2>
                    <p className="text-gray-500 text-sm mb-6">
                        Status akan berubah menjadi <b>"Completed"</b>.
                    </p>
                    <div className="flex justify-center gap-3">
                        <button
                            onClick={() => setConfirming(false)}
                            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl"
                        >
                            Batal
                        </button>
                        <PrimaryButton
                            onClick={handleComplete}
                            disabled={processing}
                            className="px-5 py-2.5 bg-green-600 hover:bg-green-700 rounded-xl shadow-lg shadow-green-200"
                        >
                            Ya, Selesai
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>
        </>
    );
};

// --- PAGE UTAMA ---
export default function Show({ auth, order, couriers }) {
    const { flash } = usePage().props;
    // Tampilkan Peta Kurir HANYA jika status sedang jalan
    const showCourierMap =
        order.courier &&
        ["picked_up", "on_delivery", "ready_for_pickup"].includes(order.status);

    return (
        <AdminLayout user={auth.user} header={null}>
            <Head title={`Detail Pindahan #${order.id}`} />
            <div className="min-h-screen bg-gray-50/50 pb-20 font-sans">
                <div className="px-8 py-4 bg-white border-b border-gray-200 sticky top-0 z-30 flex justify-between items-center shadow-sm">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route("admin.pindahan.index")}
                            className="p-2 rounded-full hover:bg-gray-100"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900">
                                Pindahan #{order.id}
                            </h2>
                            <div className="flex gap-2 text-sm text-gray-500">
                                <span>Status: {order.status}</span>
                                <span className="font-bold text-emerald-600">
                                    Total: {formatRupiah(order.final_amount)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <OrderStepper status={order.status} />
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {flash.success && (
                        <div className="mb-8 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-4 rounded-2xl flex items-center">
                            <CheckCircle2 className="w-5 h-5 mr-2" />{" "}
                            {flash.success}
                        </div>
                    )}
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                        <div className="xl:col-span-7 space-y-8">
                            {showCourierMap && (
                                <TrackingMonitorBox order={order} />
                            )}
                            <PickupLocationBox order={order} />
                            <OrderDetailsBox order={order} />
                        </div>
                        <div className="xl:col-span-5 space-y-8 sticky top-24">
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
                            {order.status === "delivered" && (
                                <CompletionBox order={order} />
                            )}
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
                            <TrackingHistoryBox order={order} />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
