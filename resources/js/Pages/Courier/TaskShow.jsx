import React, { useState, useEffect } from "react";
import CourierLayout from "@/Layouts/CourierLayout";
import { Head, useForm, router } from "@inertiajs/react";
import LiveMap from "@/Components/LiveMap";
import {
    Phone,
    MessageCircle,
    PackageCheck,
    CheckCircle2,
    Camera,
    AlertTriangle,
    User,
    Box,
    Truck,
    ChevronLeft,
    Calendar,
    Copy,
    Check,
    MapPin,
    Navigation, // Icon Baru untuk Navigasi
} from "lucide-react";
import Modal from "@/Components/Modal";
import axios from "axios";

// --- Helper Components ---

const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(number || 0);
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
            className="ml-2 p-1 rounded-md hover:bg-gray-100 transition-colors"
            title="Salin ID"
        >
            {copied ? (
                <Check size={14} className="text-emerald-600" />
            ) : (
                <Copy size={14} className="text-gray-400" />
            )}
        </button>
    );
};

// --- Main Component ---

export default function TaskShow({ auth, task }) {
    // 1. Destructuring Data & Parsing JSON
    const details = task.user_form_details || {};
    const client = task.user || {};

    // 2. Logic Tipe Layanan & Ikon
    const isPenitipan =
        !!details.branch_address ||
        (task.orderable_type && task.orderable_type.includes("Service"));
    const serviceLabel = isPenitipan ? "Layanan Penitipan" : "Jasa Pindahan";
    const ServiceIcon = isPenitipan ? Box : Truck;

    // 3. Logic Lokasi & Koordinat (INTI PERUBAHAN DI SINI)

    // A. Titik Jemput (Pickup / Origin)
    const pickupAddress =
        details.alamat_penjemputan ||
        details.pickup_address ||
        "Lokasi Jemput Tidak Tersedia";
    // Prioritas Koordinat: origin_latitude (Pindahan) -> latitude (Penitipan)
    const pickupLat = details.origin_latitude || details.latitude;
    const pickupLng = details.origin_longitude || details.longitude;

    // B. Titik Tujuan (Delivery / Destination)
    const deliveryAddress = isPenitipan
        ? `${details.branch_name || "Gudang"} - ${details.branch_address}` // Kalau titip, tujuannya Gudang
        : details.alamat_tujuan ||
          details.delivery_address ||
          "Tujuan Tidak Tersedia"; // Kalau pindahan, tujuannya rumah baru

    // Koordinat Tujuan (Khusus Pindahan)
    const deliveryLat = details.destination_latitude;
    const deliveryLng = details.destination_longitude;

    // Kontak & Catatan
    const clientPhone = details.telepon || details.phone || client.phone || "";
    const notes = details.notes || "-";

    // --- States ---
    const [showActionModal, setShowActionModal] = useState(false);
    const [gpsError, setGpsError] = useState(null);
    const [currentPos, setCurrentPos] = useState({
        lat: auth.user.latitude ? parseFloat(auth.user.latitude) : -6.2,
        lng: auth.user.longitude ? parseFloat(auth.user.longitude) : 106.816666,
    });

    const statusForm = useForm({
        status: task.status || "ready_for_pickup",
        evidence_photo: null,
        note: "",
    });

    // Logic Footer Visibility
    const isFooterVisible = [
        "ready_for_pickup",
        "picked_up",
        "on_delivery",
    ].includes(task.status);

    // --- Effects (GPS & Auto Reload) ---
    useEffect(() => {
        if (!isFooterVisible) return;

        const interval = setInterval(() => {
            router.reload({
                only: ["task"],
                preserveScroll: true,
                preserveState: true,
            });
        }, 10000);

        let geoId;
        if ("geolocation" in navigator) {
            geoId = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCurrentPos({ lat: latitude, lng: longitude });
                    axios
                        .post(route("courier.updateLocation"), {
                            lat: latitude,
                            lng: longitude,
                        })
                        .catch((err) => console.warn("GPS Update Failed", err));
                },
                (err) => setGpsError("Mohon aktifkan GPS."),
                { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
            );
        }

        return () => {
            clearInterval(interval);
            if (geoId) navigator.geolocation.clearWatch(geoId);
        };
    }, [task.status, isFooterVisible]);

    // --- Actions ---
    const openActionModal = (type) => {
        statusForm.setData(
            "status",
            type === "pickup" ? "picked_up" : "delivered"
        );
        setShowActionModal(true);
    };

    const submitAction = (e) => {
        e.preventDefault();
        statusForm.post(route("courier.tasks.updateStatus", task.id), {
            forceFormData: true,
            onSuccess: () => setShowActionModal(false),
        });
    };

    // --- Utils ---
    const getWaLink = () => {
        if (!clientPhone) return "#";
        let number = clientPhone.replace(/\D/g, "");
        if (number.startsWith("0")) number = "62" + number.slice(1);
        return `https://wa.me/${number}?text=${encodeURIComponent(
            `Halo ${client.name}, saya kurir Titipsini untuk pesanan #${task.id}.`
        )}`;
    };

    // [FUNGSI NAVIGASI PINTAR]
    // Kalau ada koordinat, pakai koordinat (Akurat). Kalau gak ada, pakai alamat teks.
    const getMapsLink = (lat, lng, address) => {
        if (lat && lng) {
            return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        }
        if (address) {
            return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                address
            )}`;
        }
        return "#";
    };

    const formattedDate = details.tanggal_pindahan
        ? new Date(details.tanggal_pindahan).toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
          })
        : details.start_date
        ? new Date(details.start_date).toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
          })
        : "Segera";

    // Status UI Config
    const getStatusConfig = () => {
        const s = task.status;
        if (s === "ready_for_pickup")
            return { color: "blue", label: "Perlu Dijemput" };
        if (["picked_up", "on_delivery"].includes(s))
            return { color: "orange", label: "Sedang Diantar" };
        if (["delivered", "completed"].includes(s))
            return { color: "emerald", label: "Selesai" };
        if (s === "cancelled") return { color: "red", label: "Dibatalkan" };
        return { color: "gray", label: "Info" };
    };

    const statusConfig = getStatusConfig();

    return (
        <CourierLayout user={auth.user} header="Detail Order">
            <Head title={`Tugas #${task.id}`} />

            <style>{`
                .leaflet-touch .leaflet-bar { border: none; box-shadow: 0 2px 5px rgba(0,0,0,0.1); margin-left: 10px; margin-top: 10px; }
                .leaflet-touch .leaflet-bar a { background: white; color: #333; border-radius: 8px; width: 32px; height: 32px; line-height: 32px; }
            `}</style>

            <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-900 relative">
                {/* 1. HEADER */}
                <div className="sticky top-0 z-40 flex-none h-16 px-4 bg-white/95 backdrop-blur-sm border-b border-gray-100 flex items-center justify-between shadow-sm">
                    <button
                        onClick={() => window.history.back()}
                        className="p-2 -ml-2 rounded-full hover:bg-gray-50 text-gray-800 transition-all"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div className="flex flex-col items-center">
                        <div className="flex items-center text-gray-900 font-bold text-base">
                            #{task.id} <CopyButton text={`#${task.id}`} />
                        </div>
                    </div>
                    <div className="w-8"></div>
                </div>

                {/* 2. MAIN CONTENT */}
                <div className={`flex-1 ${isFooterVisible ? "pb-32" : "pb-8"}`}>
                    {/* PETA UTAMA (Menampilkan Posisi Kurir & Tujuan) */}
                    <div className="w-full h-[38vh] bg-gray-200 relative border-b border-gray-200 shadow-sm z-0">
                        <LiveMap
                            courierLat={currentPos.lat}
                            courierLng={currentPos.lng}
                            // Tampilkan Marker Tujuan di Peta Mini jika ada koordinat
                            destinationLat={pickupLat}
                            destinationLng={pickupLng}
                            className="h-full w-full"
                        />
                        {gpsError && (
                            <div className="absolute top-4 left-4 right-4 bg-red-500/90 backdrop-blur text-white px-4 py-2 rounded-lg text-xs font-medium flex items-center shadow-md z-10">
                                <AlertTriangle size={14} className="mr-2" />{" "}
                                {gpsError}
                            </div>
                        )}
                    </div>

                    {/* DETAIL INFO */}
                    <div className="bg-white min-h-[50vh]">
                        {/* Status Strip */}
                        <div className="px-6 py-4 border-b border-gray-100 bg-white sticky top-16 z-30">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                                        Status Order
                                    </p>
                                    <h2
                                        className={`text-sm font-black uppercase tracking-wide text-${statusConfig.color}-600`}
                                    >
                                        {statusConfig.label}
                                    </h2>
                                </div>
                                <div
                                    className={`w-2.5 h-2.5 rounded-full bg-${
                                        statusConfig.color
                                    }-500 ${
                                        isFooterVisible ? "animate-pulse" : ""
                                    }`}
                                ></div>
                            </div>
                        </div>

                        <div className="px-6 pt-6 space-y-8">
                            {/* Client Info */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                            Pelanggan
                                        </p>
                                        <h3 className="text-base font-bold text-gray-900 leading-tight">
                                            {client.name}
                                        </h3>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <a
                                        href={getWaLink()}
                                        target="_blank"
                                        className="p-3 rounded-xl bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all border border-green-100"
                                    >
                                        <MessageCircle size={18} />
                                    </a>
                                    {clientPhone && (
                                        <a
                                            href={`tel:${clientPhone}`}
                                            className="p-3 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all border border-blue-100"
                                        >
                                            <Phone size={18} />
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Address Flow */}
                            <div>
                                <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-50">
                                    <ServiceIcon
                                        size={16}
                                        className="text-gray-900"
                                    />
                                    <h4 className="font-bold text-sm text-gray-900">
                                        {serviceLabel}
                                    </h4>
                                </div>

                                <div className="relative border-l-2 border-dashed border-gray-200 ml-2.5 pl-8 space-y-10">
                                    {/* 1. LOKASI JEMPUT (ASAL) */}
                                    <div className="relative">
                                        <span className="absolute -left-[39px] top-0 w-5 h-5 bg-blue-50 border-2 border-blue-500 rounded-full z-10"></span>
                                        <div>
                                            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">
                                                Lokasi Jemput (Asal)
                                            </p>
                                            <p className="text-sm text-gray-800 font-medium leading-relaxed mb-3">
                                                {pickupAddress}
                                            </p>

                                            {/* Tombol Navigasi Cerdas */}
                                            <a
                                                href={getMapsLink(
                                                    pickupLat,
                                                    pickupLng,
                                                    pickupAddress
                                                )}
                                                target="_blank"
                                                className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
                                            >
                                                <Navigation
                                                    size={14}
                                                    className="mr-2"
                                                />{" "}
                                                Navigasi ke Asal
                                            </a>
                                        </div>
                                    </div>

                                    {/* 2. LOKASI TUJUAN */}
                                    <div className="relative">
                                        <span className="absolute -left-[39px] top-0 w-5 h-5 bg-orange-50 border-2 border-orange-500 rounded-full z-10"></span>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">
                                                    Tujuan
                                                </p>
                                                {isPenitipan && (
                                                    <span className="text-[9px] px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded font-bold border border-orange-200">
                                                        GUDANG
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-800 font-medium leading-relaxed mb-3">
                                                {deliveryAddress}
                                            </p>

                                            {/* Tombol Navigasi ke Tujuan (Hanya Muncul jika Pindahan atau memang mau ke Gudang) */}
                                            <a
                                                href={getMapsLink(
                                                    deliveryLat,
                                                    deliveryLng,
                                                    deliveryAddress
                                                )}
                                                target="_blank"
                                                className="inline-flex items-center px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50 transition-colors"
                                            >
                                                <MapPin
                                                    size={14}
                                                    className="mr-2"
                                                />{" "}
                                                Lihat di Peta
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Grid Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                        Jadwal
                                    </p>
                                    <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                                        <Calendar
                                            size={14}
                                            className="text-gray-400"
                                        />{" "}
                                        {formattedDate}
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                        Total Biaya
                                    </p>
                                    <div className="text-sm font-black text-emerald-600">
                                        {formatRupiah(task.final_amount)}
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            {notes && notes !== "-" && (
                                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1">
                                        Catatan Tambahan
                                    </p>
                                    <p className="text-xs text-gray-700 italic leading-relaxed">
                                        "{notes}"
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 3. FOOTER ACTION */}
                {isFooterVisible && (
                    <div className="fixed bottom-0 left-0 right-0 p-4 pb-6 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50">
                        <div className="max-w-md mx-auto w-full">
                            {task.status === "ready_for_pickup" && (
                                <button
                                    onClick={() => openActionModal("pickup")}
                                    className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl shadow-lg shadow-gray-200 hover:bg-black transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <PackageCheck size={18} /> Konfirmasi Jemput
                                </button>
                            )}
                            {["picked_up", "on_delivery"].includes(
                                task.status
                            ) && (
                                <button
                                    onClick={() => openActionModal("deliver")}
                                    className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <CheckCircle2 size={18} /> Selesaikan
                                    Pesanan
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* --- MODAL --- */}
                <Modal
                    show={showActionModal}
                    onClose={() => setShowActionModal(false)}
                >
                    <div className="p-6 bg-white rounded-2xl">
                        <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-900 border border-gray-100">
                                <Camera size={24} />
                            </div>
                            <h2 className="text-lg font-black text-gray-900">
                                Upload Bukti
                            </h2>
                            <p className="text-gray-400 text-xs mt-1">
                                Ambil foto di lokasi (wajib).
                            </p>
                        </div>

                        <form onSubmit={submitAction} className="space-y-4">
                            <label className="block w-full aspect-video rounded-xl overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors relative group">
                                {statusForm.data.evidence_photo ? (
                                    <img
                                        src={URL.createObjectURL(
                                            statusForm.data.evidence_photo
                                        )}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 group-hover:text-gray-500 transition-colors">
                                        <Camera size={32} className="mb-2" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">
                                            Ketuk Kamera
                                        </span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    capture="environment"
                                    onChange={(e) =>
                                        statusForm.setData(
                                            "evidence_photo",
                                            e.target.files[0]
                                        )
                                    }
                                />
                            </label>

                            <textarea
                                className="w-full border-gray-200 bg-gray-50 rounded-xl text-sm p-4 focus:ring-2 focus:ring-gray-900 outline-none resize-none transition-all"
                                rows="2"
                                value={statusForm.data.note}
                                onChange={(e) =>
                                    statusForm.setData("note", e.target.value)
                                }
                                placeholder="Catatan tambahan (opsional)..."
                            ></textarea>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowActionModal(false)}
                                    className="py-3 bg-white border border-gray-200 text-gray-900 font-bold rounded-xl hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={
                                        statusForm.processing ||
                                        !statusForm.data.evidence_photo
                                    }
                                    className="py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black disabled:opacity-50 shadow-lg"
                                >
                                    {statusForm.processing
                                        ? "Mengirim..."
                                        : "Kirim"}
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal>
            </div>
        </CourierLayout>
    );
}
