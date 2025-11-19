import React, { useState, useEffect } from "react";
import CourierLayout from "../../Layouts/CourierLayout";
import InputError from "../../Components/InputError";
import InputLabel from "../../Components/InputLabel";
import PrimaryButton from "../../Components/PrimaryButton";
import { Head, useForm, usePage } from "@inertiajs/react";
import {
    Phone,
    MessageCircle,
    MapPin,
    User,
    Calendar,
    FileText,
    Navigation,
    Package,
    ChevronRight,
    ArrowRight,
    Clock,
    Flag,
    Send,
    Map as MapIcon,
} from "lucide-react";
import axios from "axios";
// Import Komponen Peta
import LiveMap from "@/Components/LiveMap";

// Daftar status
const statusOptions = [
    { value: "ready_for_pickup", label: "🚀 Siap Diambil (Menuju Lokasi)" },
    { value: "picked_up", label: "📦 Barang Sudah Diambil" },
    { value: "on_delivery", label: "🚚 Dalam Pengantaran" },
    { value: "delivered", label: "🏁 Sudah Sampai Tujuan" },
    { value: "completed", label: "✅ Selesai" },
    { value: "cancelled", label: "❌ Dibatalkan" },
];

const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number || 0);
};

export default function TaskShow({ auth, task }) {
    const { flash } = usePage().props;

    // --- State Lokal untuk Peta Instan ---
    const [currentPos, setCurrentPos] = useState({
        lat: auth.user.latitude ? parseFloat(auth.user.latitude) : null,
        lng: auth.user.longitude ? parseFloat(auth.user.longitude) : null,
    });

    // --- Form Data ---
    // 1. Form Update Status Utama
    const { data, setData, patch, processing, errors } = useForm({
        status: task.status || "ready_for_pickup",
    });

    // 2. Form Tambah Catatan Tracking
    const trackingForm = useForm({
        note: "",
    });

    // --- [LOGIKA GPS LIVE TRACKING] ---
    useEffect(() => {
        // Hanya jalankan GPS jika status aktif
        const isActive = [
            "ready_for_pickup",
            "picked_up",
            "on_delivery",
        ].includes(task.status);

        if (isActive && "geolocation" in navigator) {
            const intervalId = setInterval(() => {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;

                        // 1. Update tampilan peta lokal (Instan)
                        setCurrentPos({ lat: latitude, lng: longitude });

                        // 2. Kirim ke server (Background)
                        axios
                            .post(route("courier.updateLocation"), {
                                lat: latitude,
                                lng: longitude,
                            })
                            .catch((err) =>
                                console.error("Gagal update lokasi", err)
                            );
                    },
                    (err) => console.error("GPS Error", err),
                    { enableHighAccuracy: true }
                );
            }, 5000); // Update setiap 5 detik agar smooth

            return () => clearInterval(intervalId);
        }
    }, [task.status]);

    // --- Handlers ---

    // [PERBAIKAN PENTING] Nama fungsi submit status
    const submitStatus = (e) => {
        e.preventDefault();
        patch(route("courier.tasks.updateStatus", task.id), {
            preserveScroll: true,
        });
    };

    const submitTracking = (e) => {
        e.preventDefault();
        trackingForm.post(route("courier.tasks.addTracking", task.id), {
            preserveScroll: true,
            onSuccess: () => trackingForm.reset(),
        });
    };

    // --- Ekstrak Data ---
    const details = task.user_form_details || {};
    const orderable = task.orderable || {};
    const client = task.user || {};
    const isPindahan = !!details.alamat_penjemputan;
    const trackings = task.trackings || [];

    // --- Helper Links ---
    const getWaLink = (phoneNumber) => {
        if (!phoneNumber) return "#";
        let cleanNumber = phoneNumber.replace(/\D/g, "");
        if (cleanNumber.startsWith("0"))
            cleanNumber = "62" + cleanNumber.slice(1);
        return `https://wa.me/${cleanNumber}?text=Halo kak ${client.name}, saya kurir dari Titipsini untuk pesanan #${task.id}...`;
    };

    const getMapsLink = (address) => {
        if (!address) return "#";
        return `https://maps.app.goo.gl/sSCst5QEQocFgLVy7{encodeURIComponent(address)}`;
    };

    const formattedDate = details.tanggal_pindahan
        ? new Date(details.tanggal_pindahan).toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : "Segera";

    return (
        <CourierLayout user={auth.user}>
            <Head title={`Tugas #${task.id}`} />

            <div className="min-h-screen bg-gray-50/50 pb-20">
                {/* --- HEADER --- */}
                <div className="bg-white border-b border-gray-100 sticky top-0 z-10 bg-opacity-80 backdrop-blur-md">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                                Order #{task.id}
                            </h2>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                                {orderable.name || "Layanan Umum"}
                            </p>
                        </div>
                        <div
                            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm
                            ${
                                task.status === "completed"
                                    ? "bg-green-100 text-green-700"
                                    : task.status === "cancelled"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-blue-50 text-blue-700 border border-blue-100"
                            }`}
                        >
                            {task.status.replace("_", " ")}
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* --- KOLOM KIRI: DETAIL PENGIRIMAN --- */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* [BARU] LIVE MAP COMPONENT */}
                            {isPindahan && (
                                <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
                                    <div className="p-4 pb-0 mb-4">
                                        <h3 className="text-lg font-bold text-gray-900 flex items-center">
                                            <MapIcon className="w-5 h-5 mr-2 text-blue-500" />
                                            Live Tracking
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            Lokasi Anda (Kurir) diperbarui
                                            otomatis saat aktif.
                                        </p>
                                    </div>

                                    {/* Peta menggunakan State Lokal 'currentPos' */}
                                    <LiveMap
                                        courierLat={currentPos.lat}
                                        courierLng={currentPos.lng}
                                    />
                                </div>
                            )}

                            {/* KARTU KLIEN */}
                            <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>

                                <div className="relative flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-50 flex items-center justify-center text-green-600 shadow-sm">
                                            <User size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800">
                                                {client.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 font-medium">
                                                Pelanggan
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <a
                                            href={`tel:${details.telepon}`}
                                            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm hover:shadow-md"
                                        >
                                            <Phone size={18} />
                                        </a>
                                        <a
                                            href={getWaLink(details.telepon)}
                                            target="_blank"
                                            className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 hover:bg-green-500 hover:text-white transition-all shadow-sm hover:shadow-md"
                                        >
                                            <MessageCircle size={18} />
                                        </a>
                                    </div>
                                </div>
                                <div className="mt-6 p-4 bg-gray-50/80 rounded-2xl border border-gray-100 flex items-center gap-3">
                                    <Phone
                                        size={16}
                                        className="text-gray-400"
                                    />
                                    <span className="text-gray-700 font-semibold text-lg tracking-wide">
                                        {details.telepon || "-"}
                                    </span>
                                </div>
                            </div>

                            {/* RUTE PERJALANAN */}
                            {isPindahan ? (
                                <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                                    <h3 className="text-lg font-bold text-gray-800 mb-8 flex items-center gap-2">
                                        <Navigation
                                            size={20}
                                            className="text-blue-500"
                                        />
                                        Rute Perjalanan
                                    </h3>

                                    <div className="relative pl-4">
                                        <div className="absolute left-[1.65rem] top-4 bottom-8 w-0.5 bg-gradient-to-b from-blue-400 to-green-400 border-l-2 border-dashed border-gray-300"></div>

                                        <div className="relative flex gap-6 mb-10 group">
                                            <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-blue-50 border-4 border-white shadow-md flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-300">
                                                <Package size={20} />
                                            </div>
                                            <div className="flex-grow pt-1">
                                                <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">
                                                    Titik Penjemputan
                                                </p>
                                                <p className="text-gray-800 text-lg font-medium leading-snug">
                                                    {details.alamat_penjemputan}
                                                </p>
                                                <a
                                                    href={getMapsLink(
                                                        details.alamat_penjemputan
                                                    )}
                                                    target="_blank"
                                                    className="inline-flex items-center mt-3 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-4 py-2 rounded-lg"
                                                >
                                                    <MapPin
                                                        size={14}
                                                        className="mr-2"
                                                    />{" "}
                                                    Navigasi ke Lokasi
                                                </a>
                                            </div>
                                        </div>

                                        <div className="relative flex gap-6 group">
                                            <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-green-50 border-4 border-white shadow-md flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform duration-300">
                                                <MapPin size={20} />
                                            </div>
                                            <div className="flex-grow pt-1">
                                                <p className="text-xs font-bold text-green-500 uppercase tracking-wider mb-1">
                                                    Titik Tujuan
                                                </p>
                                                <p className="text-gray-800 text-lg font-medium leading-snug">
                                                    {details.alamat_tujuan}
                                                </p>
                                                <a
                                                    href={getMapsLink(
                                                        details.alamat_tujuan
                                                    )}
                                                    target="_blank"
                                                    className="inline-flex items-center mt-3 text-sm font-semibold text-green-600 hover:text-green-800 transition-colors bg-green-50 px-4 py-2 rounded-lg"
                                                >
                                                    <MapPin
                                                        size={14}
                                                        className="mr-2"
                                                    />{" "}
                                                    Navigasi ke Tujuan
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
                                    <p className="text-gray-500">
                                        Ini adalah layanan penitipan standar.
                                        Lihat detail di bawah.
                                    </p>
                                </div>
                            )}

                            {/* TRACKING TIMELINE */}
                            <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                                    <Flag className="w-5 h-5 mr-2 text-purple-500" />
                                    Tracking & Catatan Perjalanan
                                </h3>

                                {/* Form Catatan Manual */}
                                <form
                                    onSubmit={submitTracking}
                                    className="mb-8 flex gap-2"
                                >
                                    <input
                                        type="text"
                                        className="flex-1 border-gray-200 rounded-xl text-sm focus:ring-green-500 focus:border-green-500 bg-gray-50"
                                        placeholder="Tulis catatan (cth: Macet, Isi Bensin, Sampai lokasi)..."
                                        value={trackingForm.data.note}
                                        onChange={(e) =>
                                            trackingForm.setData(
                                                "note",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <button
                                        disabled={
                                            trackingForm.processing ||
                                            !trackingForm.data.note
                                        }
                                        className="bg-gray-900 text-white p-3 rounded-xl hover:bg-gray-800 disabled:opacity-50"
                                    >
                                        <Send size={18} />
                                    </button>
                                </form>

                                <div className="space-y-6 relative pl-2">
                                    <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gray-200"></div>
                                    {trackings.length > 0 ? (
                                        trackings.map((log, index) => (
                                            <div
                                                key={log.id}
                                                className="relative flex gap-4 items-start"
                                            >
                                                <div
                                                    className={`relative z-10 w-7 h-7 rounded-full border-2 border-white shadow-sm flex items-center justify-center
                                                ${
                                                    index === 0
                                                        ? "bg-green-500 text-white"
                                                        : "bg-gray-200 text-gray-500"
                                                }`}
                                                >
                                                    <Clock size={12} />
                                                </div>
                                                <div className="flex-1 bg-gray-50 p-3 rounded-xl rounded-tl-none text-sm border border-gray-100">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span
                                                            className={`font-bold text-xs uppercase tracking-wide px-2 py-0.5 rounded-full 
                                                        ${
                                                            log.status ===
                                                            "Info Kurir"
                                                                ? "bg-blue-100 text-blue-700"
                                                                : "bg-green-100 text-green-700"
                                                        }`}
                                                        >
                                                            {log.status}
                                                        </span>
                                                        <span className="text-xs text-gray-400">
                                                            {new Date(
                                                                log.created_at
                                                            ).toLocaleString(
                                                                "id-ID",
                                                                {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                    day: "numeric",
                                                                    month: "short",
                                                                }
                                                            )}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-700">
                                                        {log.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-sm italic pl-8">
                                            Belum ada riwayat perjalanan.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* 4. DETAIL LAINNYA */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-2 text-gray-400">
                                        <Calendar size={18} />
                                        <span className="text-xs font-bold uppercase tracking-wider">
                                            Tanggal Jadwal
                                        </span>
                                    </div>
                                    <p className="text-lg font-semibold text-gray-800">
                                        {formattedDate}
                                    </p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-2 text-gray-400">
                                        <FileText size={18} />
                                        <span className="text-xs font-bold uppercase tracking-wider">
                                            Catatan
                                        </span>
                                    </div>
                                    <p className="text-gray-800 italic">
                                        "
                                        {details.notes ||
                                            "Tidak ada catatan khusus"}
                                        "
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* --- KOLOM KANAN: PANEL AKSI --- */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24">
                                <h3 className="font-bold text-gray-900 mb-4">
                                    Update Status
                                </h3>

                                {flash.success && (
                                    <div className="mb-4 p-3 bg-green-100 text-green-700 text-sm rounded-md">
                                        {flash.success}
                                    </div>
                                )}

                                {/* [PERBAIKAN] Form ini sekarang memanggil 'submitStatus' */}
                                <form
                                    onSubmit={submitStatus}
                                    className="space-y-4"
                                >
                                    <select
                                        value={data.status}
                                        onChange={(e) =>
                                            setData("status", e.target.value)
                                        }
                                        className="w-full border-gray-200 rounded-xl text-sm"
                                    >
                                        {statusOptions.map((opt) => (
                                            <option
                                                key={opt.value}
                                                value={opt.value}
                                            >
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                    <PrimaryButton
                                        className="w-full justify-center py-3"
                                        disabled={processing}
                                    >
                                        Update Status
                                    </PrimaryButton>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CourierLayout>
    );
}
