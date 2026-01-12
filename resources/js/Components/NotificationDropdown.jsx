import React, { useState, useRef, useEffect } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import {
    Bell,
    Check,
    Wallet,
    Truck,
    Package,
    Info,
    ChevronRight,
    Clock,
} from "lucide-react";

// --- Helper: Ikon & Warna (Sama dengan halaman Index) ---
const getNotificationStyle = (type) => {
    switch (type) {
        case "payment_verified":
            return {
                icon: Wallet,
                bg: "bg-emerald-100",
                text: "text-emerald-600",
            };
        case "courier_assigned":
            return { icon: Truck, bg: "bg-blue-100", text: "text-blue-600" };
        case "order_update":
        case "order_placed":
            return {
                icon: Package,
                bg: "bg-amber-100",
                text: "text-amber-600",
            };
        default:
            return { icon: Info, bg: "bg-gray-100", text: "text-gray-500" };
    }
};

export default function NotificationDropdown() {
    const { auth } = usePage().props;
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Normalisasi Data
    const notificationData = auth.notifications || {};
    const notificationsList = Array.isArray(notificationData.latest)
        ? notificationData.latest
        : [];
    const unreadCount = notificationData.unread_count || 0;

    // Tutup dropdown saat klik di luar
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Action: Klik Notifikasi
    const handleNotificationClick = (id, link) => {
        setIsOpen(false);
        router.post(
            route("notifications.read", id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    if (link && link !== "#") router.visit(link);
                },
            }
        );
    };

    // Action: Baca Semua
    const markAllRead = () => {
        router.post(
            route("notifications.readAll"),
            {},
            { preserveScroll: true }
        );
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* --- TOMBOL LONCENG --- */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2.5 rounded-full transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-200 ${
                    isOpen
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                }`}
            >
                <Bell size={22} strokeWidth={2} />

                {/* Badge Merah (Pulse Animation) */}
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white items-center justify-center text-[9px] font-bold text-white">
                            {unreadCount > 9 ? "!" : unreadCount}
                        </span>
                    </span>
                )}
            </button>

            {/* --- DROPDOWN MENU --- */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-[360px] bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 z-50 overflow-hidden origin-top-right animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Header */}
                    <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
                        <div>
                            <h3 className="text-sm font-bold text-gray-900">
                                Notifikasi
                            </h3>
                            <p className="text-[10px] text-gray-500 font-medium">
                                Terbaru untuk Anda
                            </p>
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllRead}
                                className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                            >
                                <Check size={12} />
                                Baca Semua
                            </button>
                        )}
                    </div>

                    {/* List Content */}
                    <div className="max-h-[380px] overflow-y-auto custom-scrollbar">
                        {notificationsList.length > 0 ? (
                            <div className="py-2">
                                {notificationsList.map((notif) => {
                                    const isRead = !!notif.read_at;
                                    const style = getNotificationStyle(
                                        notif.data.type
                                    );
                                    const Icon = style.icon;

                                    return (
                                        <div
                                            key={notif.id}
                                            onClick={() =>
                                                handleNotificationClick(
                                                    notif.id,
                                                    notif.data.link
                                                )
                                            }
                                            className={`group px-5 py-3 cursor-pointer transition-all border-l-[3px] hover:bg-gray-50 flex gap-4 items-start ${
                                                !isRead
                                                    ? "border-blue-500 bg-blue-50/10"
                                                    : "border-transparent opacity-80 hover:opacity-100"
                                            }`}
                                        >
                                            {/* Icon Box */}
                                            <div
                                                className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                                                    !isRead
                                                        ? style.bg
                                                        : "bg-gray-100"
                                                } ${
                                                    !isRead
                                                        ? style.text
                                                        : "text-gray-400"
                                                }`}
                                            >
                                                <Icon
                                                    size={18}
                                                    strokeWidth={
                                                        isRead ? 2 : 2.5
                                                    }
                                                />
                                            </div>

                                            {/* Text */}
                                            <div className="flex-1 min-w-0 pt-0.5">
                                                <div className="flex justify-between items-start mb-0.5">
                                                    <p
                                                        className={`text-sm leading-none truncate pr-2 ${
                                                            !isRead
                                                                ? "font-bold text-gray-900"
                                                                : "font-semibold text-gray-600"
                                                        }`}
                                                    >
                                                        {notif.data.title}
                                                    </p>
                                                    {/* Dot Unread */}
                                                    {!isRead && (
                                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                                    )}
                                                </div>

                                                <p
                                                    className={`text-xs leading-relaxed line-clamp-2 ${
                                                        !isRead
                                                            ? "text-gray-700 font-medium"
                                                            : "text-gray-500"
                                                    }`}
                                                >
                                                    {notif.data.message}
                                                </p>

                                                <p className="text-[10px] text-gray-400 mt-1.5 flex items-center gap-1">
                                                    <Clock size={10} />
                                                    {new Date(
                                                        notif.created_at
                                                    ).toLocaleString("id-ID", {
                                                        day: "numeric",
                                                        month: "short",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            /* Empty State */
                            <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                    <Bell className="text-gray-300" size={24} />
                                </div>
                                <p className="text-sm font-bold text-gray-800">
                                    Sudah bersih!
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Belum ada notifikasi baru untuk saat ini.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <Link
                        href={
                            route().has("notifications.index")
                                ? route("notifications.index")
                                : "#"
                        }
                        onClick={() => setIsOpen(false)}
                        // [FIXED] Menghapus 'block' dan mempertahankan 'w-full flex'
                        className="w-full py-3 text-center text-xs font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 hover:text-blue-600 transition-colors border-t border-gray-100 flex items-center justify-center gap-1 group"
                    >
                        Lihat Semua Riwayat
                        <ChevronRight
                            size={12}
                            className="transition-transform group-hover:translate-x-1"
                        />
                    </Link>
                </div>
            )}
        </div>
    );
}
