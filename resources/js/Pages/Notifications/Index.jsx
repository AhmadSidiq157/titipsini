import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import {
    ArrowLeft,
    CheckCheck,
    Wallet,
    Truck,
    Package,
    Bell,
    ChevronRight,
    Sparkles,
    Calendar,
    Clock,
} from "lucide-react";

// --- Helper: Cek Role User ---
const hasRole = (user, roleName) => {
    if (!user || !user.roles) return false;
    return user.roles.some((role) => role.name === roleName);
};

// --- 1. Helper: Grouping ---
const groupNotificationsByDate = (notifications) => {
    const groups = {
        "Baru Saja": [],
        "Hari Ini": [],
        Kemarin: [],
        "Minggu Ini": [],
        "Riwayat Lama": [],
    };

    notifications.forEach((notif) => {
        const date = new Date(notif.created_at);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffHours <= 2) groups["Baru Saja"].push(notif);
        else if (diffDays <= 1) groups["Hari Ini"].push(notif);
        else if (diffDays <= 2) groups["Kemarin"].push(notif);
        else if (diffDays <= 7) groups["Minggu Ini"].push(notif);
        else groups["Riwayat Lama"].push(notif);
    });

    return Object.fromEntries(
        Object.entries(groups).filter(([_, v]) => v.length > 0)
    );
};

// --- 2. Helper: Ikon & Warna Dinamis (Sesuai Permintaan) ---
const getNotificationStyle = (type) => {
    switch (type) {
        case "payment_verified":
            return {
                icon: Wallet,
                theme: "emerald",
                bgIcon: "bg-emerald-100",
                textIcon: "text-emerald-600",
                bgUnread: "bg-emerald-50/40",
                border: "border-emerald-200",
            };
        case "courier_assigned":
            return {
                icon: Truck,
                theme: "sky",
                bgIcon: "bg-sky-100",
                textIcon: "text-sky-600",
                bgUnread: "bg-sky-50/40",
                border: "border-sky-200",
            };
        case "order_update":
        case "order_placed":
            return {
                icon: Package,
                theme: "amber",
                bgIcon: "bg-amber-100",
                textIcon: "text-amber-600",
                bgUnread: "bg-amber-50/40",
                border: "border-amber-200",
            };
        default:
            return {
                icon: Bell,
                theme: "gray",
                bgIcon: "bg-gray-100",
                textIcon: "text-gray-600",
                bgUnread: "bg-white",
                border: "border-gray-200",
            };
    }
};

export default function NotificationIndex({ auth, notifications }) {
    const groupedNotifications = groupNotificationsByDate(notifications.data);
    const hasNotifications = notifications.data.length > 0;
    const hasUnread = notifications.data.some((n) => !n.read_at);

    // --- LOGIKA TOMBOL KEMBALI DINAMIS ---
    const user = auth.user;
    let backRoute = route("home");

    if (hasRole(user, "admin")) {
        backRoute = route("admin.dashboard");
    } else if (hasRole(user, "kurir")) {
        backRoute = route("courier.dashboard");
    }

    // --- Actions ---
    const markAllRead = () =>
        router.post(
            route("notifications.readAll"),
            {},
            { preserveScroll: true }
        );

    const handleNotificationClick = (notification) => {
        if (!notification.read_at) {
            router.post(
                route("notifications.read", notification.id),
                {},
                {
                    onSuccess: () => {
                        if (notification.data.link)
                            router.visit(notification.data.link);
                    },
                }
            );
        } else if (notification.data.link) {
            router.visit(notification.data.link);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FB] font-sans text-gray-800 pb-20">
            <Head title="Notifikasi" />

            {/* --- HEADER FULL WIDTH (Sticky & Glass) --- */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Tombol Kembali dengan Route Dinamis */}
                        <Link
                            href={backRoute}
                            className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                            <ArrowLeft size={22} />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                                Notifikasi
                                {hasUnread && (
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                    </span>
                                )}
                            </h1>
                        </div>
                    </div>

                    {hasUnread && (
                        <button
                            onClick={markAllRead}
                            className="group flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-full text-xs font-bold hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm"
                        >
                            <CheckCheck
                                size={14}
                                className="text-emerald-500"
                            />
                            <span>Tandai Semua Dibaca</span>
                        </button>
                    )}
                </div>
            </div>

            {/* --- CONTENT AREA (FULL WIDTH CONTAINER) --- */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
                {hasNotifications ? (
                    Object.entries(groupedNotifications).map(
                        ([label, items]) => (
                            <div
                                key={label}
                                className="animate-in fade-in slide-in-from-bottom-4 duration-700"
                            >
                                {/* Label Tanggal dengan Garis */}
                                <div className="flex items-center gap-4 mb-5">
                                    <span
                                        className={`text-sm font-bold uppercase tracking-widest px-3 py-1 rounded-lg flex items-center gap-2 
                                    ${
                                        label === "Baru Saja"
                                            ? "bg-blue-100 text-blue-600"
                                            : "bg-gray-100 text-gray-500"
                                    }`}
                                    >
                                        {label === "Baru Saja" ? (
                                            <Sparkles size={14} />
                                        ) : (
                                            <Calendar size={14} />
                                        )}
                                        {label}
                                    </span>
                                    <div className="h-px flex-1 bg-gray-200"></div>
                                </div>

                                {/* List Notifikasi */}
                                <div className="grid grid-cols-1 gap-3">
                                    {items.map((notification) => {
                                        const isRead = !!notification.read_at;
                                        const style = getNotificationStyle(
                                            notification.data.type
                                        );
                                        const Icon = style.icon;

                                        return (
                                            <div
                                                key={notification.id}
                                                onClick={() =>
                                                    handleNotificationClick(
                                                        notification
                                                    )
                                                }
                                                className={`group relative flex items-center gap-5 p-5 rounded-2xl transition-all cursor-pointer border
                                                ${
                                                    !isRead
                                                        ? `${style.bgUnread} ${style.border} shadow-sm hover:shadow-md`
                                                        : "bg-white border-transparent hover:bg-gray-50 hover:border-gray-200"
                                                }
                                            `}
                                            >
                                                {/* ICON BOX */}
                                                <div
                                                    className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105
                                                ${
                                                    !isRead
                                                        ? style.bgIcon
                                                        : "bg-gray-100"
                                                } 
                                                ${
                                                    !isRead
                                                        ? style.textIcon
                                                        : "text-gray-400"
                                                }`}
                                                >
                                                    <Icon
                                                        size={26}
                                                        strokeWidth={
                                                            !isRead ? 2.5 : 2
                                                        }
                                                    />
                                                </div>

                                                {/* TEXT CONTENT */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <h3
                                                            className={`text-base truncate pr-4 ${
                                                                !isRead
                                                                    ? "font-bold text-gray-900"
                                                                    : "font-medium text-gray-700"
                                                            }`}
                                                        >
                                                            {
                                                                notification
                                                                    .data.title
                                                            }
                                                        </h3>
                                                        {/* Time Stamp */}
                                                        <span className="flex-shrink-0 text-xs text-gray-400 flex items-center gap-1 bg-white/60 px-2 py-1 rounded-md">
                                                            <Clock size={12} />
                                                            {new Date(
                                                                notification.created_at
                                                            ).toLocaleTimeString(
                                                                "id-ID",
                                                                {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                }
                                                            )}
                                                        </span>
                                                    </div>
                                                    <p
                                                        className={`text-sm leading-relaxed ${
                                                            !isRead
                                                                ? "text-gray-800"
                                                                : "text-gray-500"
                                                        }`}
                                                    >
                                                        {
                                                            notification.data
                                                                .message
                                                        }
                                                    </p>
                                                </div>

                                                {/* Right Chevron & Status Indicator */}
                                                <div className="flex items-center justify-center pl-2">
                                                    {!isRead ? (
                                                        <div
                                                            className={`w-3 h-3 rounded-full shadow-sm ring-2 ring-white animate-pulse ${style.textIcon.replace(
                                                                "text",
                                                                "bg"
                                                            )}`}
                                                        ></div>
                                                    ) : (
                                                        <ChevronRight
                                                            size={20}
                                                            className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )
                    )
                ) : (
                    /* --- EMPTY STATE (Full Screen Center) --- */
                    <div className="flex flex-col items-center justify-center h-[70vh]">
                        <div className="w-32 h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                            <Bell className="text-gray-300 w-14 h-14" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                            Semua Bersih!
                        </h3>
                        <p className="text-gray-500 max-w-md text-center leading-relaxed">
                            Belum ada notifikasi baru untuk Anda saat ini. Kami
                            akan memberi tahu Anda jika ada update pesanan.
                        </p>

                        {/* Tombol Kembali (Empty State) dengan Route Dinamis */}
                        <Link
                            href={backRoute}
                            className="mt-8 px-8 py-3 bg-gray-900 text-white rounded-full text-sm font-bold shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all transform hover:-translate-y-1"
                        >
                            Kembali ke Beranda
                        </Link>
                    </div>
                )}

                {/* --- PAGINATION (Minimalist) --- */}
                {notifications.links && notifications.links.length > 3 && (
                    <div className="flex justify-center gap-2 pt-8 border-t border-gray-200/60">
                        {notifications.links.map((link, key) =>
                            link.url ? (
                                <Link
                                    key={key}
                                    href={link.url}
                                    className={`h-10 px-4 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                                        link.active
                                            ? "bg-gray-900 text-white shadow-md"
                                            : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                                    }`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ) : (
                                <span
                                    key={key}
                                    className="h-10 px-4 flex items-center justify-center rounded-lg text-sm text-gray-300 bg-gray-50 border border-gray-100 cursor-not-allowed"
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
