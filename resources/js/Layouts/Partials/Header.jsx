import React, { useState, useEffect, useRef } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import {
    User,
    LogOut,
    History,
    LayoutDashboard,
    Truck,
    Menu,
    X,
    ChevronRight,
} from "lucide-react";

// Helper (tidak berubah)
const hasRole = (user, roleName) => {
    if (!user || !user.roles) return false;
    return user.roles.some((role) => role.name === roleName);
};
const isClient = (user) => {
    if (!user) return false;
    if (!user.roles || user.roles.length === 0) {
        return true;
    }
    return !hasRole(user, "admin") && !hasRole(user, "kurir");
};

export default function Header() {
    const { auth } = usePage().props;
    const { url } = usePage();
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    const user = auth?.user;
    const userIsClient = isClient(user);
    const userIsAdmin = hasRole(user, "admin");
    const userIsCourier = hasRole(user, "kurir");

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route("logout"));
    };

    // Tutup dropdown jika klik di luar
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Tutup menu mobile saat navigasi
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [url]);

    // Helper function untuk class link aktif (Desktop & Mobile terpisah)
    const getLinkClass = (path, isMobile = false) => {
        const isActive = path === "/" ? url === "/" : url.startsWith(path);

        if (isMobile) {
            // Style Mobile: Minimalis Rounded (Modern)
            return isActive
                ? "flex items-center justify-between px-4 py-3 text-sm font-bold text-green-700 bg-green-50 rounded-xl transition-colors"
                : "flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors";
        }

        // Style Desktop: Simple Text (Asli Anda)
        return isActive
            ? "text-green-600 font-medium"
            : "text-gray-600 font-medium hover:text-green-600 transition-colors";
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50 font-sans">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    {/* LOGO */}
                    <Link
                        href="/"
                        className="text-2xl font-bold text-gray-800 flex-shrink-0"
                    >
                        Titipsini<span className="text-green-500">.com</span>
                    </Link>

                    {/* --- DESKTOP NAVIGATION (ASLI ANDA) --- */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link href="/" className={getLinkClass("/")}>
                            Beranda
                        </Link>
                        <Link
                            href="/layanan"
                            className={getLinkClass("/layanan")}
                        >
                            Pindahan
                        </Link>
                        <Link
                            href="/tentang-kami"
                            className={getLinkClass("/tentang-kami")}
                        >
                            Tentang Kami
                        </Link>
                        <Link
                            href="/contact"
                            className={getLinkClass("/contact")}
                        >
                            Kontak
                        </Link>
                    </nav>

                    {/* --- DESKTOP USER MENU (ASLI ANDA) --- */}
                    <div className="hidden md:block" ref={dropdownRef}>
                        {!user && (
                            <div className="flex items-center space-x-2">
                                <Link
                                    href={route("login")}
                                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 font-semibold text-sm rounded-md hover:bg-gray-50 transition whitespace-nowrap"
                                >
                                    Login
                                </Link>
                                <Link
                                    href={route("register")}
                                    className="inline-flex items-center px-3 py-2 bg-green-500 text-white font-semibold text-sm rounded-md hover:bg-green-600 transition whitespace-nowrap"
                                >
                                    Daftar
                                </Link>
                            </div>
                        )}

                        {user && (
                            <div className="relative flex items-center space-x-2">
                                <button
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-md transition ${
                                        userIsAdmin || userIsCourier
                                            ? "bg-red-100 hover:bg-red-200"
                                            : "bg-gray-100 hover:bg-gray-200"
                                    }`}
                                >
                                    <span
                                        className={`font-semibold truncate max-w-[100px] ${
                                            userIsAdmin || userIsCourier
                                                ? "text-red-800"
                                                : "text-gray-800"
                                        }`}
                                    >
                                        {user.name}
                                    </span>
                                    <svg
                                        className={`w-4 h-4 transform transition-transform duration-200 ${
                                            menuOpen ? "rotate-180" : ""
                                        } ${
                                            userIsAdmin || userIsCourier
                                                ? "text-red-600"
                                                : "text-gray-600"
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>

                                {menuOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 transform origin-top-right transition-all duration-200 ease-out animate-dropdownShow">
                                        {userIsAdmin || userIsCourier ? (
                                            <Link
                                                href={route("dashboard")}
                                                className="flex items-center gap-2 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-t-xl transition-all"
                                            >
                                                {userIsAdmin ? (
                                                    <LayoutDashboard className="w-4 h-4 text-gray-500" />
                                                ) : (
                                                    <Truck className="w-4 h-4 text-gray-500" />
                                                )}
                                                Kembali ke Dashboard
                                            </Link>
                                        ) : (
                                            <>
                                                <Link
                                                    href={route("profile.edit")}
                                                    className="flex items-center gap-2 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-t-xl transition-all"
                                                >
                                                    <User className="w-4 h-4 text-gray-500" />{" "}
                                                    Profil Saya
                                                </Link>
                                                <Link
                                                    href={route(
                                                        "history.index"
                                                    )}
                                                    className="flex items-center gap-2 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-all"
                                                >
                                                    <History className="w-4 h-4 text-gray-500" />{" "}
                                                    Riwayat Pesanan
                                                </Link>
                                            </>
                                        )}
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2 w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50 rounded-b-xl transition-all"
                                        >
                                            <LogOut className="w-4 h-4 text-red-500" />{" "}
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* --- MOBILE MENU BUTTON --- */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* --- MOBILE MENU OVERLAY (MODERN & TERPISAH) --- */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-xl border-t border-gray-100 animate-in slide-in-from-top-5 duration-200 z-40">
                    <div className="p-4 space-y-6">
                        {/* 1. Navigasi Utama */}
                        <div className="space-y-1">
                            <Link href="/" className={getLinkClass("/", true)}>
                                <span>Beranda</span>
                                <ChevronRight className="w-4 h-4 opacity-50" />
                            </Link>
                            <Link
                                href="/layanan"
                                className={getLinkClass("/layanan", true)}
                            >
                                <span>Pindahan</span>
                                <ChevronRight className="w-4 h-4 opacity-50" />
                            </Link>
                            <Link
                                href="/tentang-kami"
                                className={getLinkClass("/tentang-kami", true)}
                            >
                                <span>Tentang Kami</span>
                                <ChevronRight className="w-4 h-4 opacity-50" />
                            </Link>
                            <Link
                                href="/contact"
                                className={getLinkClass("/contact", true)}
                            >
                                <span>Kontak</span>
                                <ChevronRight className="w-4 h-4 opacity-50" />
                            </Link>
                        </div>

                        {/* 2. User Section (Dipisah Garis) */}
                        <div className="pt-4 border-t border-gray-100">
                            {user ? (
                                <>
                                    {/* User Info */}
                                    <div className="flex items-center gap-3 mb-4 px-2">
                                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-gray-900 truncate">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>

                                    {/* User Actions Grid */}
                                    <div className="grid grid-cols-2 gap-3">
                                        {userIsAdmin || userIsCourier ? (
                                            <Link
                                                href={route("dashboard")}
                                                className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition border border-gray-100"
                                            >
                                                <LayoutDashboard className="w-4 h-4" />
                                                Dashboard
                                            </Link>
                                        ) : (
                                            <>
                                                <Link
                                                    href={route("profile.edit")}
                                                    className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition border border-gray-100"
                                                >
                                                    <User className="w-4 h-4" />
                                                    Profil
                                                </Link>
                                                <Link
                                                    href={route(
                                                        "history.index"
                                                    )}
                                                    className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition border border-gray-100"
                                                >
                                                    <History className="w-4 h-4" />
                                                    Riwayat
                                                </Link>
                                            </>
                                        )}
                                        <button
                                            onClick={handleLogout}
                                            className="col-span-2 flex items-center justify-center gap-2 p-3 bg-red-50 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-100 transition border border-red-100"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Keluar
                                        </button>
                                    </div>
                                </>
                            ) : (
                                /* Guest Actions */
                                <div className="grid grid-cols-2 gap-3">
                                    <Link
                                        href={route("login")}
                                        className="flex justify-center py-3 px-4 border border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition text-center"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={route("register")}
                                        className="flex justify-center py-3 px-4 bg-green-600 rounded-xl text-sm font-bold text-white hover:bg-green-700 transition text-center shadow-sm"
                                    >
                                        Daftar
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
