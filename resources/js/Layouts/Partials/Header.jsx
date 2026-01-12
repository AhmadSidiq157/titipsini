import React, { useState, useEffect, useRef } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import {
    User,
    LogOut,
    History,
    LayoutDashboard,
    Menu,
    X,
    ChevronRight,
    ChevronDown,
    LogIn,
    UserPlus,
    Home,
    Package,
    Truck,
    Grid,
    Bell, // Pastikan Bell diimport
} from "lucide-react";

// Helper Role
const hasRole = (user, roleName) => {
    if (!user || !user.roles) return false;
    return user.roles.some((role) => role.name === roleName);
};

export default function Header() {
    const { auth } = usePage().props;
    const { url } = usePage();

    // State untuk Menu User & Mobile
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // State untuk Dropdown Notifikasi
    const [notifOpen, setNotifOpen] = useState(false);

    // Refs untuk mendeteksi klik di luar komponen
    const dropdownRef = useRef(null);
    const notifRef = useRef(null);

    const user = auth?.user;
    const userIsAdmin = hasRole(user, "admin");
    const userIsCourier = hasRole(user, "kurir");

    // --- DATA NOTIFIKASI DARI MIDDLEWARE ---
    const notificationsData = auth?.notifications;
    // Ambil jumlah badge merah (default 0)
    const unreadCount = notificationsData?.unread_count || 0;
    // Ambil list notifikasi (default array kosong)
    const notificationList = notificationsData?.latest || [];

    // Handle Logout
    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route("logout"));
    };

    // Klik di luar dropdown untuk menutup (Desktop)
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Tutup User Menu
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setMenuOpen(false);
            }
            // Tutup Notifikasi Menu
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setNotifOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Tutup mobile menu & notifikasi saat ganti halaman
    useEffect(() => {
        setMobileMenuOpen(false);
        setNotifOpen(false);
    }, [url]);

    // Helper Class Link Aktif (Desktop)
    const getLinkClass = (path) => {
        const isActive = path === "/" ? url === "/" : url.startsWith(path);
        return isActive
            ? "text-green-600 font-semibold"
            : "text-gray-600 font-medium hover:text-green-600 transition-colors";
    };

    // Helper Class Link Aktif (Mobile/Tablet Bottom Bar)
    const getBottomNavClass = (path) => {
        const isActive = path === "/" ? url === "/" : url.startsWith(path);
        return isActive
            ? "text-green-600"
            : "text-gray-400 hover:text-gray-600";
    };

    return (
        <>
            {/* =======================
                1. HEADER ATAS (Sticky)
               ======================= */}
            <header className="bg-white shadow-sm sticky top-0 z-40 font-sans border-b border-gray-100">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* LOGO */}
                        <Link
                            href={route("home")}
                            className="flex items-center gap-1 z-50 group"
                        >
                            <span className="text-2xl font-bold text-gray-800 tracking-tight group-hover:text-green-700 transition-colors">
                                Titipsini
                            </span>
                            <span className="text-2xl font-bold text-green-500 group-hover:text-green-600 transition-colors">
                                .com
                            </span>
                        </Link>

                        {/* --- DESKTOP NAVIGATION (Tengah) --- */}
                        <nav className="hidden lg:flex items-center space-x-8">
                            <Link
                                href={route("home")}
                                className={getLinkClass("/")}
                            >
                                Beranda
                            </Link>
                            <Link
                                href={route("penitipan.index")}
                                className={getLinkClass("/penitipan")}
                            >
                                Penitipan
                            </Link>
                            <Link
                                href={route("pindahan.index")}
                                className={getLinkClass("/pindahan")}
                            >
                                Pindahan
                            </Link>
                            <Link
                                href={route("about")}
                                className={getLinkClass("/tentang-kami")}
                            >
                                Tentang Kami
                            </Link>
                            <Link
                                href={route("contact.show")}
                                className={getLinkClass("/contact")}
                            >
                                Kontak
                            </Link>
                        </nav>

                        {/* --- RIGHT SECTION (Login/User) --- */}
                        <div className="flex items-center gap-2 lg:gap-4">
                            {/* [MOBILE ONLY] LONCENG MOBILE (Link Langsung) */}
                            {user && (
                                <div className="lg:hidden">
                                    <Link
                                        href={route("notifications.index")}
                                        className="relative p-2 text-gray-500 hover:text-green-600 transition-colors flex items-center justify-center"
                                    >
                                        <Bell size={24} />
                                        {unreadCount > 0 && (
                                            <span className="absolute top-1.5 right-2 flex h-2.5 w-2.5">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-white"></span>
                                            </span>
                                        )}
                                    </Link>
                                </div>
                            )}

                            {/* --- DESKTOP SECTION --- */}
                            <div className="hidden lg:flex items-center gap-4">
                                {!user ? (
                                    <div className="flex items-center gap-3">
                                        <Link
                                            href={route("login")}
                                            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-semibold text-sm rounded-lg hover:bg-gray-50 hover:text-green-600 transition-all"
                                        >
                                            <LogIn className="w-4 h-4 mr-2" />{" "}
                                            Masuk
                                        </Link>
                                        <Link
                                            href={route("register")}
                                            className="flex items-center px-4 py-2 bg-green-600 text-white font-semibold text-sm rounded-lg hover:bg-green-700 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5"
                                        >
                                            <UserPlus className="w-4 h-4 mr-2" />{" "}
                                            Daftar
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-4">
                                        {/* =======================================
                                            [DESKTOP] NOTIFIKASI DROPDOWN
                                           ======================================= */}
                                        <div
                                            className="relative"
                                            ref={notifRef}
                                        >
                                            <button
                                                onClick={() =>
                                                    setNotifOpen(!notifOpen)
                                                }
                                                className="relative p-2 text-gray-600 hover:text-green-600 hover:bg-gray-50 rounded-full transition-all focus:outline-none"
                                            >
                                                <Bell className="w-6 h-6" />
                                                {unreadCount > 0 && (
                                                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                                                        {unreadCount}
                                                    </span>
                                                )}
                                            </button>

                                            {notifOpen && (
                                                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 overflow-hidden z-50 border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                                                    <div className="px-4 py-3 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                                                        <h3 className="text-sm font-bold text-gray-800">
                                                            Notifikasi
                                                        </h3>
                                                        <Link
                                                            href={route(
                                                                "notifications.index"
                                                            )}
                                                            className="text-xs text-green-600 hover:underline font-medium"
                                                        >
                                                            Lihat Semua
                                                        </Link>
                                                    </div>
                                                    <div className="max-h-64 overflow-y-auto">
                                                        {notificationList.length ===
                                                        0 ? (
                                                            <div className="p-6 text-center">
                                                                <div className="bg-gray-50 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                                                                    <Bell className="w-5 h-5 text-gray-400" />
                                                                </div>
                                                                <p className="text-xs text-gray-500">
                                                                    Belum ada
                                                                    notifikasi
                                                                    baru.
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            notificationList.map(
                                                                (notif) => (
                                                                    <Link
                                                                        key={
                                                                            notif.id
                                                                        }
                                                                        href={route(
                                                                            "notifications.index"
                                                                        )}
                                                                        className={`block px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${
                                                                            !notif.read_at
                                                                                ? "bg-blue-50/30"
                                                                                : ""
                                                                        }`}
                                                                    >
                                                                        <div className="flex justify-between items-start">
                                                                            <p
                                                                                className={`text-sm text-gray-800 line-clamp-1 ${
                                                                                    !notif.read_at
                                                                                        ? "font-bold"
                                                                                        : "font-semibold"
                                                                                }`}
                                                                            >
                                                                                {notif
                                                                                    .data
                                                                                    .title ||
                                                                                    "Info Terbaru"}
                                                                            </p>
                                                                            {!notif.read_at && (
                                                                                <span className="w-2 h-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></span>
                                                                            )}
                                                                        </div>
                                                                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                                                            {
                                                                                notif
                                                                                    .data
                                                                                    .message
                                                                            }
                                                                        </p>
                                                                        <p className="text-[10px] text-gray-400 mt-1">
                                                                            {new Date(
                                                                                notif.created_at
                                                                            ).toLocaleDateString(
                                                                                "id-ID",
                                                                                {
                                                                                    day: "numeric",
                                                                                    month: "short",
                                                                                    hour: "2-digit",
                                                                                    minute: "2-digit",
                                                                                }
                                                                            )}
                                                                        </p>
                                                                    </Link>
                                                                )
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* =======================================
                                            [DESKTOP] USER DROPDOWN
                                           ======================================= */}
                                        <div
                                            className="relative"
                                            ref={dropdownRef}
                                        >
                                            <button
                                                onClick={() =>
                                                    setMenuOpen(!menuOpen)
                                                }
                                                className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-50 transition-all focus:outline-none text-gray-700"
                                            >
                                                <span className="text-sm font-bold max-w-[150px] truncate">
                                                    Hi, {user.name}
                                                </span>
                                                <ChevronDown
                                                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                                                        menuOpen
                                                            ? "rotate-180"
                                                            : ""
                                                    }`}
                                                />
                                            </button>

                                            {menuOpen && (
                                                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 py-2 transform origin-top-right transition-all duration-200 z-50">
                                                    <div className="px-4 py-3 border-b border-gray-100 mb-1">
                                                        <p className="text-sm font-bold text-gray-800 truncate">
                                                            {user.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500 truncate">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                    <div className="py-1">
                                                        {(userIsAdmin ||
                                                            userIsCourier) && (
                                                            <Link
                                                                href={route(
                                                                    userIsCourier
                                                                        ? "courier.dashboard"
                                                                        : "admin.dashboard"
                                                                )}
                                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600"
                                                            >
                                                                <LayoutDashboard className="w-4 h-4 mr-3" />{" "}
                                                                Dashboard
                                                            </Link>
                                                        )}
                                                        <Link
                                                            href={route(
                                                                "profile.edit"
                                                            )}
                                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600"
                                                        >
                                                            <User className="w-4 h-4 mr-3" />{" "}
                                                            Profil Saya
                                                        </Link>
                                                        <Link
                                                            href={route(
                                                                "history.index"
                                                            )}
                                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600"
                                                        >
                                                            <History className="w-4 h-4 mr-3" />{" "}
                                                            Riwayat Pesanan
                                                        </Link>
                                                        <div className="border-t border-gray-100 mt-1 pt-1">
                                                            <button
                                                                onClick={
                                                                    handleLogout
                                                                }
                                                                className="flex w-full items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                            >
                                                                <LogOut className="w-4 h-4 mr-3" />{" "}
                                                                Keluar
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* ==============================================
                2. MOBILE & TABLET BOTTOM NAVIGATION (Footbar)
               ============================================== */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe">
                <Link
                    href={route("home")}
                    className={`flex flex-col items-center justify-center w-full ${getBottomNavClass(
                        "/"
                    )}`}
                >
                    <Home size={22} />
                    <span className="text-[10px] font-medium mt-1">
                        Beranda
                    </span>
                </Link>

                <Link
                    href={route("penitipan.index")}
                    className={`flex flex-col items-center justify-center w-full ${getBottomNavClass(
                        "/penitipan"
                    )}`}
                >
                    <Package size={22} />
                    <span className="text-[10px] font-medium mt-1">
                        Penitipan
                    </span>
                </Link>

                <Link
                    href={route("pindahan.index")}
                    className={`flex flex-col items-center justify-center w-full ${getBottomNavClass(
                        "/pindahan"
                    )}`}
                >
                    <Truck size={22} />
                    <span className="text-[10px] font-medium mt-1">
                        Pindahan
                    </span>
                </Link>

                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className={`flex flex-col items-center justify-center w-full ${
                        mobileMenuOpen
                            ? "text-green-600"
                            : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                    {mobileMenuOpen ? <X size={22} /> : <Grid size={22} />}
                    <span className="text-[10px] font-medium mt-1">
                        {mobileMenuOpen ? "Tutup" : "Lainnya"}
                    </span>
                </button>
            </div>

            {/* ==========================================
                3. MOBILE & TABLET MENU OVERLAY (Drawer)
               ========================================== */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 top-16 bottom-[60px] bg-white z-30 overflow-y-auto animate-in slide-in-from-bottom-10 fade-in duration-300">
                    <div className="p-5 space-y-6">
                        {/* Profile Section di Menu Overlay */}
                        {user ? (
                            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 relative">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-xl">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-base font-bold text-gray-900 truncate">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <Link
                                        href={route("profile.edit")}
                                        className="flex items-center justify-center gap-2 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700"
                                    >
                                        <User size={16} /> Profil
                                    </Link>
                                    <Link
                                        href={route("history.index")}
                                        className="flex items-center justify-center gap-2 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700"
                                    >
                                        <History size={16} /> Riwayat
                                    </Link>
                                </div>
                                {(userIsAdmin || userIsCourier) && (
                                    <Link
                                        href={route(
                                            userIsCourier
                                                ? "courier.dashboard"
                                                : "admin.dashboard"
                                        )}
                                        className="mt-3 flex items-center justify-center gap-2 py-2 w-full bg-blue-50 text-blue-700 rounded-lg text-sm font-bold"
                                    >
                                        <LayoutDashboard size={16} /> Akses
                                        Dashboard
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="bg-green-50 rounded-2xl p-6 text-center">
                                <h3 className="text-lg font-bold text-gray-800 mb-2">
                                    Selamat Datang!
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Masuk atau daftar untuk menikmati layanan
                                    penuh.
                                </p>
                                <div className="flex gap-3">
                                    <Link
                                        href={route("login")}
                                        className="flex-1 py-2.5 bg-white text-green-700 font-bold rounded-xl shadow-sm border border-green-200"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={route("register")}
                                        className="flex-1 py-2.5 bg-green-600 text-white font-bold rounded-xl shadow-md"
                                    >
                                        Daftar
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Link Tambahan */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                Menu Lainnya
                            </h4>
                            <div className="space-y-1">
                                <Link
                                    href={route("about")}
                                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors text-gray-700"
                                >
                                    <span className="font-medium">
                                        Tentang Kami
                                    </span>
                                    <ChevronRight
                                        size={16}
                                        className="text-gray-400"
                                    />
                                </Link>
                                <Link
                                    href={route("contact.show")}
                                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors text-gray-700"
                                >
                                    <span className="font-medium">
                                        Hubungi Kontak
                                    </span>
                                    <ChevronRight
                                        size={16}
                                        className="text-gray-400"
                                    />
                                </Link>
                            </div>
                        </div>

                        {/* Tombol Logout (Mobile/Tablet) */}
                        {user && (
                            <button
                                onClick={handleLogout}
                                className="w-full py-3 flex items-center justify-center gap-2 text-red-600 bg-red-50 rounded-xl font-bold mt-4"
                            >
                                <LogOut size={18} /> Keluar Aplikasi
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
