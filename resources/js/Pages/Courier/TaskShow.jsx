import React, { useState, useEffect } from "react";
import CourierLayout from "@/Layouts/CourierLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import LiveMap from "@/Components/LiveMap";
import {
    Navigation,
    Phone,
    MessageCircle,
    PackageCheck,
    CheckCircle2,
    MapPin,
    Camera,
    AlertTriangle,
    User,
    ArrowRight,
    Box,
    Truck,
    Building2,
    ChevronLeft,
    Calendar,
    Shield,
} from "lucide-react";
import Modal from "@/Components/Modal";
import InputLabel from "@/Components/InputLabel";
import axios from "axios";

const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number || 0);
};

export default function TaskShow({ auth, task }) {
    const { flash, settings } = usePage().props;

    // --- 1. DATA PREPARATION & SMART DETECTION ---
    // [PERBAIKAN] Menggunakan nama variabel 'details' agar konsisten dengan JSX
    const details = task.user_form_details || {};
    const client = task.user || {};
    const orderable = task.orderable || {};

    // Deteksi Jenis Layanan (Penitipan vs Pindahan)
    const isPenitipan =
        !!details.branch_address || task.orderable_type?.includes("Service");

    // Label & Icon Dinamis
    const serviceLabel = isPenitipan ? "Layanan Penitipan" : "Jasa Pindahan";
    const ServiceIcon = isPenitipan ? Box : Truck;

    // Logika Alamat
    const pickupAddress =
        details.alamat_penjemputan ||
        details.pickup_address ||
        "Lokasi Jemput Tidak Tersedia";
    const deliveryAddress = isPenitipan
        ? `${details.branch_name || "Gudang"} - ${details.branch_address}`
        : details.alamat_tujuan ||
          details.delivery_address ||
          "Tujuan Tidak Tersedia";

    const clientPhone = details.telepon || details.phone || client.phone || "";
    const notes = details.notes || "-";

    // State
    const [showActionModal, setShowActionModal] = useState(false);
    const [actionType, setActionType] = useState(null);
    const [gpsError, setGpsError] = useState(null);
    const [currentPos, setCurrentPos] = useState({
        lat: auth.user.latitude ? parseFloat(auth.user.latitude) : -6.2,
        lng: auth.user.longitude ? parseFloat(auth.user.longitude) : 106.816666,
    });

    // Forms
    const statusForm = useForm({
        status: task.status || "ready_for_pickup",
        evidence_photo: null,
        note: "",
    });

    // --- 2. GPS TRACKING LOGIC ---
    useEffect(() => {
        const isActive = [
            "ready_for_pickup",
            "picked_up",
            "on_delivery",
        ].includes(task.status);
        if (!isActive || !("geolocation" in navigator)) return;

        const geoId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCurrentPos({ lat: latitude, lng: longitude });
                axios
                    .post(route("courier.updateLocation"), {
                        lat: latitude,
                        lng: longitude,
                    })
                    .catch((err) => console.warn("GPS Silent Fail", err));
            },
            (err) => setGpsError("Aktifkan GPS agar admin bisa memantau."),
            { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
        );

        return () => navigator.geolocation.clearWatch(geoId);
    }, [task.status]);

    // --- 3. HANDLERS ---
    const openActionModal = (type) => {
        setActionType(type);
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
            onSuccess: () => {
                setShowActionModal(false);
                statusForm.reset();
            },
        });
    };

    // --- 4. LINKS ---
    const getWaLink = () => {
        if (!clientPhone) return "#";
        let number = clientPhone.replace(/\D/g, "");
        if (number.startsWith("0")) number = "62" + number.slice(1);
        return `https://wa.me/${number}?text=${encodeURIComponent(
            `Halo ${client.name}, saya kurir Titipsini untuk pesanan #${task.id} (${serviceLabel}).`
        )}`;
    };

    const getMapsLink = (address) => {
        if (!address || address.includes("Tidak Tersedia")) return "#";
        const cleanAddress = address.split(" - ").pop();
        return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
            cleanAddress
        )}`;
    };

    const formattedDate = details.tanggal_pindahan
        ? new Date(details.tanggal_pindahan).toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
          })
        : "Segera";

    // --- 5. STATUS BANNER LOGIC ---
    const getStatusConfig = () => {
        if (task.status === "ready_for_pickup")
            return {
                bg: "bg-blue-600",
                text: "Jemput Paket",
                sub: "Menuju lokasi penjemputan",
                icon: Navigation,
            };
        if (["picked_up", "on_delivery"].includes(task.status))
            return {
                bg: "bg-orange-500",
                text: "Mengantar",
                sub: "Menuju lokasi tujuan",
                icon: Truck,
            };
        if (["delivered", "completed"].includes(task.status))
            return {
                bg: "bg-emerald-600",
                text: "Selesai",
                sub: "Tugas berakhir",
                icon: CheckCircle2,
            };
        if (task.status === "cancelled")
            return {
                bg: "bg-red-600",
                text: "Dibatalkan",
                sub: "Pesanan batal",
                icon: Shield,
            };
        return { bg: "bg-gray-600", text: "Info", sub: "...", icon: Box };
    };
    const statusConfig = getStatusConfig();
    const StatusIcon = statusConfig.icon;

    return (
        <CourierLayout user={auth.user} header={`Tugas #${task.id}`}>
            <Head title={`Tugas #${task.id}`} />

            <div className="relative min-h-screen bg-gray-100 pb-32 font-sans">
                {/* --- MAP HEADER (IMMERSIVE) --- */}
                <div className="fixed top-0 left-0 w-full h-[45vh] z-0">
                    <LiveMap
                        courierLat={currentPos.lat}
                        courierLng={currentPos.lng}
                        className="h-full w-full"
                    />
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-100 via-gray-100/90 to-transparent pointer-events-none"></div>

                    <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-20">
                        <a
                            href={route("courier.dashboard")}
                            className="p-2.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white shadow-lg active:scale-90 transition-transform"
                        >
                            <ChevronLeft size={24} />
                        </a>
                        <div className="flex flex-col items-end">
                            <div className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 mb-2">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                    Order ID
                                </span>
                                <span className="font-black text-gray-900 text-sm">
                                    #{task.id}
                                </span>
                            </div>
                            <div
                                className={`px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider shadow-lg backdrop-blur-md flex items-center gap-1.5 ${
                                    isPenitipan
                                        ? "bg-emerald-500 text-white"
                                        : "bg-blue-500 text-white"
                                }`}
                            >
                                <ServiceIcon
                                    size={12}
                                    fill="currentColor"
                                    className="opacity-80"
                                />
                                {serviceLabel}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- DRAGGABLE PANEL --- */}
                <div className="relative z-10 mt-[36vh] bg-gray-100 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.15)] min-h-[64vh] px-5 pt-3 pb-24 overflow-hidden">
                    <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6 mt-2"></div>

                    <div
                        className={`${statusConfig.bg} text-white p-5 rounded-3xl shadow-lg shadow-gray-400/50 mb-6 flex justify-between items-center relative overflow-hidden group`}
                    >
                        <div className="relative z-10">
                            <h3 className="font-black text-2xl tracking-tight">
                                {statusConfig.text}
                            </h3>
                            <p className="text-white/80 text-sm font-medium mt-0.5">
                                {statusConfig.sub}
                            </p>
                        </div>
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/10 relative z-10">
                            <StatusIcon
                                className="animate-pulse text-white"
                                size={24}
                            />
                        </div>
                        <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mb-10 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                    </div>

                    {gpsError && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl text-xs font-bold flex items-center mb-6 animate-bounce">
                            <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />{" "}
                            {gpsError}
                        </div>
                    )}

                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-200 space-y-8 mb-6">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                                    <User size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                                        Pelanggan
                                    </p>
                                    <h3 className="text-lg font-bold text-gray-900 leading-none">
                                        {client.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1 truncate max-w-[150px]">
                                        {orderable.name || "Paket Custom"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <a
                                    href={getWaLink()}
                                    target="_blank"
                                    className="w-10 h-10 rounded-xl bg-green-50 text-green-600 border border-green-100 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all shadow-sm active:scale-90"
                                >
                                    <MessageCircle size={20} />
                                </a>
                                {clientPhone && (
                                    <a
                                        href={`tel:${clientPhone}`}
                                        className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-90"
                                    >
                                        <Phone size={20} />
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="relative pl-2 space-y-8">
                            <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-blue-300 to-orange-300"></div>

                            <div className="relative pl-8">
                                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-blue-50 border-[3px] border-white shadow-md flex items-center justify-center z-10 ring-1 ring-blue-200">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-extrabold text-blue-500 uppercase mb-1 tracking-wide">
                                        Lokasi Jemput
                                    </p>
                                    <p className="text-sm font-bold text-gray-800 leading-snug line-clamp-2 mb-2">
                                        {pickupAddress}
                                    </p>
                                    <a
                                        href={getMapsLink(pickupAddress)}
                                        target="_blank"
                                        className="inline-flex items-center text-[10px] font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100"
                                    >
                                        <Navigation
                                            size={10}
                                            className="mr-1.5"
                                        />{" "}
                                        Navigasi
                                    </a>
                                </div>
                            </div>

                            <div className="relative pl-8">
                                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-orange-50 border-[3px] border-white shadow-md flex items-center justify-center z-10 ring-1 ring-orange-200">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-[10px] font-extrabold text-orange-500 uppercase tracking-wide">
                                            {isPenitipan
                                                ? "Lokasi Gudang"
                                                : "Lokasi Tujuan"}
                                        </p>
                                        {isPenitipan && (
                                            <Building2
                                                size={12}
                                                className="text-orange-500"
                                            />
                                        )}
                                    </div>
                                    <p className="text-sm font-bold text-gray-800 leading-snug line-clamp-2 mb-2">
                                        {deliveryAddress}
                                    </p>
                                    <a
                                        href={getMapsLink(deliveryAddress)}
                                        target="_blank"
                                        className="inline-flex items-center text-[10px] font-bold text-orange-700 bg-orange-50 px-3 py-1.5 rounded-lg hover:bg-orange-100 transition-colors border border-orange-100"
                                    >
                                        <Navigation
                                            size={10}
                                            className="mr-1.5"
                                        />{" "}
                                        Navigasi
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                            <div className="bg-gray-50 p-3 rounded-xl">
                                <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">
                                    Jadwal
                                </p>
                                <p className="text-xs font-bold text-gray-700 flex items-center gap-1">
                                    <Calendar size={12} />
                                    {formattedDate}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-xl">
                                <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">
                                    Total Biaya
                                </p>
                                <p className="text-xs font-black text-emerald-600 flex items-center gap-1">
                                    {formatRupiah(task.final_amount)}
                                </p>
                            </div>
                        </div>

                        {notes && notes !== "Tidak ada catatan" && (
                            <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-sm text-amber-900 italic relative">
                                <span className="font-bold not-italic block text-[10px] uppercase text-amber-600 mb-1">
                                    Catatan Customer:
                                </span>
                                "{notes}"
                            </div>
                        )}
                    </div>
                </div>

                <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-gray-200 p-4 pb-6 shadow-[0_-5px_30px_rgba(0,0,0,0.08)] z-30">
                    <div className="max-w-md mx-auto">
                        {task.status === "ready_for_pickup" && (
                            <button
                                onClick={() => openActionModal("pickup")}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 active:scale-95 text-white font-black rounded-2xl shadow-xl shadow-blue-500/30 flex items-center justify-center gap-3 text-lg transition-all"
                            >
                                <PackageCheck size={24} /> KONFIRMASI JEMPUT
                            </button>
                        )}

                        {["picked_up", "on_delivery"].includes(task.status) && (
                            <button
                                onClick={() => openActionModal("deliver")}
                                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 active:scale-95 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-3 text-lg transition-all"
                            >
                                <CheckCircle2 size={24} /> SELESAIKAN PESANAN
                            </button>
                        )}

                        {["delivered", "completed"].includes(task.status) && (
                            <div className="text-center p-3 bg-emerald-50 rounded-2xl text-emerald-700 font-bold flex justify-center items-center gap-2 border border-emerald-100">
                                <CheckCircle2 size={20} /> Tugas Selesai
                            </div>
                        )}
                    </div>
                </div>

                <Modal
                    show={showActionModal}
                    onClose={() => setShowActionModal(false)}
                >
                    <div className="p-6 bg-white">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 shadow-sm">
                                <Camera size={32} className="text-gray-400" />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                                {actionType === "pickup"
                                    ? "Bukti Penjemputan"
                                    : "Bukti Pengantaran"}
                            </h2>
                            <p className="text-gray-500 text-sm mt-1 font-medium">
                                Foto barang sebagai bukti sah.
                            </p>
                        </div>

                        <form onSubmit={submitAction} className="space-y-5">
                            <label className="block w-full aspect-video border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors relative overflow-hidden group">
                                {statusForm.data.evidence_photo ? (
                                    <img
                                        src={URL.createObjectURL(
                                            statusForm.data.evidence_photo
                                        )}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-400 group-hover:text-gray-600">
                                        <Camera className="mb-2 w-8 h-8 opacity-50" />
                                        <span className="text-xs font-bold uppercase tracking-wider">
                                            Buka Kamera
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
                            {statusForm.errors.evidence_photo && (
                                <p className="text-red-500 text-xs text-center font-bold bg-red-50 p-2 rounded-lg">
                                    {statusForm.errors.evidence_photo}
                                </p>
                            )}

                            <textarea
                                className="w-full border-gray-200 bg-gray-50 rounded-xl text-sm p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
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
                                    className="py-3.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={statusForm.processing}
                                    className="py-3.5 bg-black text-white font-bold rounded-xl hover:bg-gray-800 shadow-lg disabled:opacity-50 transition-all"
                                >
                                    {statusForm.processing
                                        ? "Mengirim..."
                                        : "Kirim Bukti"}
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal>
            </div>
        </CourierLayout>
    );
}
