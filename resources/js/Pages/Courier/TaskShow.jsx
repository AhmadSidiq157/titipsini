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
    Box,
    Truck,
    ShieldAlert,
} from "lucide-react";
import axios from "axios";
import LiveMap from "@/Components/LiveMap";

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
    // [UPDATE] Ambil 'settings' dari props global
    const { flash, settings } = usePage().props;

    // --- SETUP KONTAK ADMIN (Dari Settings) ---
    const adminPhone = settings.contact_phone
        ? settings.contact_phone.replace(/\D/g, "")
        : "";
    // Ganti 0 dengan 62
    const adminWaTarget = adminPhone.startsWith("0")
        ? "62" + adminPhone.slice(1)
        : adminPhone;

    const adminWaLink = `https://wa.me/${adminWaTarget}?text=${encodeURIComponent(
        `Halo Admin, saya Kurir ${auth.user.name}. Saya butuh bantuan untuk Order #${task.id}.`
    )}`;

    // Form Update Status Utama
    const { data, setData, patch, processing, errors } = useForm({
        status: task.status || "ready_for_pickup",
    });

    // Form Tambah Catatan Tracking
    const trackingForm = useForm({
        note: "",
    });

    // --- LOGIKA GPS LIVE TRACKING ---
    useEffect(() => {
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
            }, 10000);

            return () => clearInterval(intervalId);
        }
    }, [task.status]);

    // State Lokal Peta (Visual)
    const [currentPos, setCurrentPos] = useState({
        lat: auth.user.latitude ? parseFloat(auth.user.latitude) : null,
        lng: auth.user.longitude ? parseFloat(auth.user.longitude) : null,
    });

    // Update state peta jika GPS berubah
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                setCurrentPos({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            });
        }
    }, []);

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
    const isPenitipanPickup =
        !isPindahan && details.delivery_method === "pickup";
    const trackings = task.trackings || [];

    // --- Helper Links (Untuk Klien) ---
    const getClientWaLink = (phoneNumber) => {
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
                {/* HEADER */}
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
                        {/* --- KOLOM KIRI --- */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* LIVE MAP COMPONENT */}
                            {(isPindahan || isPenitipanPickup) && (
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
                                    <LiveMap
                                        courierLat={currentPos.lat}
                                        courierLng={currentPos.lng}
                                    />
                                </div>
                            )}

                            {/* KARTU KLIEN (Hubungi Klien) */}
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
                                            href={getClientWaLink(
                                                details.telepon
                                            )}
                                            target="_blank"
                                            rel="noopener noreferrer"
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
                                        />{" "}
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
                            ) : isPenitipanPickup ? (
                                <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full opacity-50"></div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <Truck
                                            size={20}
                                            className="text-blue-500"
                                        />{" "}
                                        Tugas Penjemputan
                                    </h3>
                                    <div className="relative flex gap-6 group items-start">
                                        <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-blue-500 border-4 border-white shadow-lg flex items-center justify-center text-white">
                                            <MapPin size={24} />
                                        </div>
                                        <div className="flex-grow pt-1">
                                            <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">
                                                Lokasi Jemput
                                            </p>
                                            <p className="text-gray-900 text-xl font-bold leading-snug mb-2">
                                                {client.address ||
                                                    "Alamat sesuai profil klien"}
                                            </p>
                                            <a
                                                href={getMapsLink(
                                                    client.address
                                                )}
                                                target="_blank"
                                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg shadow-md hover:bg-blue-700 transition"
                                            >
                                                <MapPin
                                                    size={16}
                                                    className="mr-2"
                                                />{" "}
                                                Buka Google Maps
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
                                    <Box
                                        size={48}
                                        className="mx-auto text-gray-300 mb-4"
                                    />
                                    <h4 className="text-lg font-bold text-gray-700">
                                        Layanan Standar
                                    </h4>
                                </div>
                            )}

                            {/* TRACKING TIMELINE */}
                            <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                                    <Flag className="w-5 h-5 mr-2 text-purple-500" />{" "}
                                    Timeline
                                </h3>
                                <form
                                    onSubmit={submitTracking}
                                    className="mb-8 flex gap-2"
                                >
                                    <input
                                        type="text"
                                        className="flex-1 border-gray-200 rounded-xl text-sm bg-gray-50"
                                        placeholder="Catatan (cth: Macet)..."
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
                                        className="bg-gray-900 text-white p-3 rounded-xl"
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
                                                    className={`relative z-10 w-7 h-7 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${
                                                        index === 0
                                                            ? "bg-green-500 text-white"
                                                            : "bg-gray-200 text-gray-500"
                                                    }`}
                                                >
                                                    <Clock size={12} />
                                                </div>
                                                <div className="flex-1 bg-gray-50 p-3 rounded-xl text-sm">
                                                    <p>{log.description}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 text-sm italic pl-6">
                                            Belum ada histori.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* DETAIL LAIN */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <p className="text-xs font-bold uppercase text-gray-400 mb-1">
                                        Tanggal Jadwal
                                    </p>
                                    <p className="text-lg font-semibold text-gray-800">
                                        {formattedDate}
                                    </p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <p className="text-xs font-bold uppercase text-gray-400 mb-1">
                                        Catatan
                                    </p>
                                    <p className="text-gray-800 italic">
                                        "{details.notes || "-"}"
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* --- KOLOM KANAN: AKSI --- */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24 space-y-6">
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-4">
                                        Update Status
                                    </h3>
                                    <form
                                        onSubmit={submitStatus}
                                        className="space-y-4"
                                    >
                                        <select
                                            value={data.status}
                                            onChange={(e) =>
                                                setData(
                                                    "status",
                                                    e.target.value
                                                )
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

                                {/* [MODIFIKASI] Tombol Hubungi Admin (Dynamic WA) */}
                                <div className="bg-red-50 rounded-2xl p-6 border border-red-100 text-center">
                                    <p className="text-sm text-red-800 font-medium mb-3 flex justify-center items-center">
                                        <ShieldAlert className="w-4 h-4 mr-2" />{" "}
                                        Butuh Bantuan Darurat?
                                    </p>
                                    <a
                                        href={adminWaLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full py-2.5 bg-white border border-red-200 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors"
                                    >
                                        Hubungi Admin
                                    </a>
                                </div>

                                {details.item_photo_path && (
                                    <div className="pt-6 border-t border-gray-100">
                                        <p className="text-xs font-bold text-gray-400 uppercase mb-2">
                                            Foto Barang
                                        </p>
                                        <img
                                            src={`/storage/${details.item_photo_path}`}
                                            alt="Barang"
                                            className="w-full rounded-xl border"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CourierLayout>
    );
}
