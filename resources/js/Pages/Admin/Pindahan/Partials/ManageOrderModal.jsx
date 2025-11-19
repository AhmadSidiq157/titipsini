import React, { useState, useEffect } from "react";
import Modal from "@/Components/Modal";
import { Link, useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import DangerButton from "@/Components/DangerButton";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import LiveMap from "@/Components/LiveMap"; // Pastikan komponen ini ada
import axios from "axios"; // Wajib untuk tracking live
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
} from "lucide-react";

// Helper function
const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number || 0);
};

// --- 1. KOTAK LIVE TRACKING (Real-time Polling) ---
const TrackingMonitorBox = ({ order }) => {
    if (!order.courier) return null;

    // State awal kosong dulu
    const [courierPos, setCourierPos] = useState({ lat: null, lng: null });
    const [loading, setLoading] = useState(true);

    const fetchLocation = () => {
        axios
            .get(route("admin.pindahan.courier-location", order.courier.id))
            .then((res) => {
                console.log("📍 Admin menerima lokasi:", res.data); // Debugging di Console
                if (res.data.lat && res.data.lng) {
                    setCourierPos({
                        lat: parseFloat(res.data.lat),
                        lng: parseFloat(res.data.lng),
                    });
                }
            })
            .catch((err) => console.error("Gagal tracking:", err))
            .finally(() => setLoading(false));
    };

    // 1. Ambil data LANGSUNG saat komponen muncul (Mount)
    useEffect(() => {
        fetchLocation();

        // 2. Lalu update setiap 5 detik
        const interval = setInterval(fetchLocation, 5000);
        return () => clearInterval(interval);
    }, [order.courier.id]);

    // Cek apakah status order aktif
    const isLive = ["on_delivery", "picked_up", "ready_for_pickup"].includes(
        order.status
    );

    return (
        <div className="bg-white rounded-2xl p-1 shadow-sm border border-blue-100 mb-6">
            <div className="p-4 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <MapIcon className="w-5 h-5 mr-2 text-blue-500" />
                    Monitor Posisi Kurir
                </h3>
                {isLive && (
                    <span className="text-xs text-green-600 font-bold animate-pulse">
                        ● LIVE
                    </span>
                )}
            </div>

            <div className="rounded-xl overflow-hidden border border-gray-100">
                {/* SELALU RENDER LiveMap, biarkan LiveMap yang menangani data kosong */}
                <LiveMap
                    courierLat={courierPos.lat}
                    courierLng={courierPos.lng}
                />
            </div>

            <div className="text-xs text-gray-400 mt-2 px-4 pb-2 text-center">
                {loading
                    ? "Sedang menghubungkan..."
                    : courierPos.lat
                    ? "Lokasi terkini diterima."
                    : "Menunggu kurir mengirim lokasi..."}
            </div>
        </div>
    );
};

// --- 2. KOTAK DETAIL PESANAN (Timeline Visual) ---
const OrderDetailsBox = ({ order }) => {
    const details = order.user_form_details;
    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-gray-400" />
                Detail Pesanan
            </h3>

            <div className="space-y-6">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
                        <User size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">
                            Info Klien
                        </p>
                        <p className="font-bold text-gray-900">
                            {order.user.name}{" "}
                            <span className="text-sm font-normal text-gray-500">
                                ({order.user.email})
                            </span>
                        </p>
                        <p className="text-sm text-gray-600">
                            {details.telepon}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
                        <Calendar size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">
                            Tanggal Pindahan
                        </p>
                        <p className="font-bold text-gray-900">
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
                <div className="relative pl-4 py-1 border-l-2 border-dashed border-gray-200 ml-4 my-2">
                    <div className="mb-6 relative">
                        <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-red-500 ring-4 ring-white"></div>
                        <p className="text-xs text-red-500 uppercase font-bold mb-1">
                            Alamat Penjemputan
                        </p>
                        <p className="text-sm text-gray-800 font-medium leading-snug">
                            {details.alamat_penjemputan}
                        </p>
                    </div>
                    <div className="relative">
                        <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-green-500 ring-4 ring-white"></div>
                        <p className="text-xs text-green-500 uppercase font-bold mb-1">
                            Alamat Tujuan
                        </p>
                        <p className="text-sm text-gray-800 font-medium leading-snug">
                            {details.alamat_tujuan}
                        </p>
                    </div>
                </div>

                {details.notes && (
                    <div className="bg-yellow-50 p-4 rounded-xl text-sm text-yellow-800 italic border border-yellow-100">
                        <span className="font-bold not-italic">Catatan:</span> "
                        {details.notes}"
                    </div>
                )}
            </div>
        </div>
    );
};

// --- 3. KOTAK VERIFIKASI PEMBAYARAN ---
const PaymentVerificationBox = ({ order }) => {
    const [showRejectModal, setShowRejectModal] = useState(false);
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

    return (
        <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-sm relative overflow-hidden mb-6">
            <div className="absolute top-0 left-0 w-1 h-full bg-orange-400"></div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <ShieldCheck className="w-5 h-5 mr-2 text-orange-500" />
                Verifikasi Pembayaran
            </h3>

            {order.payment ? (
                <div className="space-y-4">
                    <div className="group relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                        <a
                            href={`/storage/${order.payment.payment_proof_path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                        >
                            <img
                                src={`/storage/${order.payment.payment_proof_path}`}
                                alt="Bukti Pembayaran"
                                className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                <span className="opacity-0 group-hover:opacity-100 bg-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                    Lihat
                                </span>
                            </div>
                        </a>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href={route("admin.pindahan.approve", order.id)}
                            method="post"
                            as="button"
                            className="flex-1 inline-flex justify-center items-center px-4 py-2 bg-green-600 text-white rounded-lg font-bold text-sm hover:bg-green-700 transition-colors"
                            onBefore={() => confirm("Setujui pembayaran ini?")}
                            preserveScroll
                            only={["orders", "flash"]}
                        >
                            <Check className="w-4 h-4 mr-2" /> Terima
                        </Link>
                        <button
                            onClick={() => setShowRejectModal(true)}
                            className="flex-1 inline-flex justify-center items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg font-bold text-sm hover:bg-red-100 transition-colors"
                        >
                            <X className="w-4 h-4 mr-2" /> Tolak
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p>Menunggu upload bukti...</p>
                </div>
            )}

            <Modal
                show={showRejectModal}
                onClose={() => setShowRejectModal(false)}
            >
                <form onSubmit={submitReject} className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Tolak Pembayaran
                    </h2>
                    <textarea
                        value={data.rejection_reason}
                        onChange={(e) =>
                            setData("rejection_reason", e.target.value)
                        }
                        className="w-full border-gray-300 rounded-xl"
                        rows="3"
                        placeholder="Alasan..."
                    ></textarea>
                    <InputError
                        message={errors.rejection_reason}
                        className="mt-2"
                    />
                    <div className="mt-4 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setShowRejectModal(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            Batal
                        </button>
                        <DangerButton disabled={processing}>Tolak</DangerButton>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

// --- 4. KOTAK TUGASKAN KURIR ---
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
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Truck className="w-5 h-5 mr-2 text-gray-400" />
                Tugaskan Kurir
            </h3>
            {order.courier && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-100 text-blue-800 rounded-xl flex items-center justify-between">
                    <span className="text-sm font-medium">
                        Saat ini: <b>{order.courier.name}</b>
                    </span>
                </div>
            )}
            <form onSubmit={submit}>
                <InputLabel
                    htmlFor="courier_id"
                    value={order.courier ? "Ganti Kurir" : "Pilih Kurir"}
                    className="mb-1"
                />
                <div className="flex gap-2">
                    <div className="flex-1">
                        <select
                            id="courier_id"
                            name="courier_id"
                            value={data.courier_id}
                            onChange={(e) =>
                                setData("courier_id", e.target.value)
                            }
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                            disabled={couriers.length === 0}
                        >
                            <option value="">-- Pilih --</option>
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
                                            info.disabled ? "text-gray-400" : ""
                                        }
                                    >
                                        {courier.name} {info.label}
                                    </option>
                                );
                            })}
                        </select>
                        <InputError
                            message={errors.courier_id}
                            className="mt-1"
                        />
                    </div>
                    <PrimaryButton className="rounded-xl" disabled={processing}>
                        {processing ? "..." : "Simpan"}
                    </PrimaryButton>
                </div>
            </form>
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
        <Modal show={show} onClose={onClose} maxWidth="5xl">
            <div className="p-6 bg-gray-50 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-extrabold text-gray-900">
                            Kelola Pesanan #{order.id}
                        </h2>
                        <p className="text-gray-500">
                            Paket: {order.orderable.name}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-white rounded-full hover:bg-gray-200 transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* KIRI: 7 Kolom */}
                    <div className="lg:col-span-7 space-y-6">
                        {showMap && <TrackingMonitorBox order={order} />}
                        <OrderDetailsBox order={order} />
                    </div>

                    {/* KANAN: 5 Kolom */}
                    <div className="lg:col-span-5 space-y-6">
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
                            <div className="bg-green-50 p-4 rounded-xl border border-green-200 text-green-800 font-bold text-center">
                                ✅ Pesanan Selesai
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
}
