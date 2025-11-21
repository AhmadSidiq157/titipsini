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
} from "lucide-react";

// Helper Role
const hasRole = (user, roleName) => {
    if (!user || !user.roles) return false;
    return user.roles.some((role) => role.name === roleName);
};

export default function Header() {
    const { auth } = usePage().props;
    const { url } = usePage();
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    const user = auth?.user;
    const userIsAdmin = hasRole(user, "admin");
    const userIsCourier = hasRole(user, "kurir");

    // Handle Logout
    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route("logout"));
    };

    // Klik di luar dropdown untuk menutup
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

    // Tutup mobile menu saat ganti halaman
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [url]);

    // Helper Class Link Aktif
    const getLinkClass = (path, isMobile = false) => {
        const isActive = path === "/" ? url === "/" : url.startsWith(path);

        if (isMobile) {
            return isActive
                ? "flex items-center justify-between px-4 py-3 text-sm font-bold text-green-700 bg-green-50 rounded-xl transition-colors"
                : "flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors";
        }

        return isActive
            ? "text-green-600 font-semibold"
            : "text-gray-600 font-medium hover:text-green-600 transition-colors";
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50 font-sans">
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

                    {/* --- DESKTOP NAVIGATION --- */}
                    <nav className="hidden md:flex items-center space-x-8">
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
                        {/* [FIX] Gunakan pindahan.index */}
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

                    {/* --- DESKTOP RIGHT SECTION (AKUN) --- */}
                    <div className="hidden md:block">
                        {!user ? (
                            // JIKA BELUM LOGIN
                            <div className="flex items-center gap-3">
                                <Link
                                    href={route("login")}
                                    className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-semibold text-sm rounded-lg hover:bg-gray-50 hover:text-green-600 transition-all"
                                >
                                    <LogIn className="w-4 h-4 mr-2" />
                                    Masuk
                                </Link>
                                <Link
                                    href={route("register")}
                                    className="flex items-center px-4 py-2 bg-green-600 text-white font-semibold text-sm rounded-lg hover:bg-green-700 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5"
                                >
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    Daftar
                                </Link>
                            </div>
                        ) : (
                            // JIKA SUDAH LOGIN (DROPDOWN TANPA AVATAR)
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-50 transition-all focus:outline-none text-gray-700"
                                >
                                    <span className="text-sm font-bold max-w-[150px] truncate">
                                        Hi, {user.name}
                                    </span>
                                    <ChevronDown
                                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                                            menuOpen ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>

                                {/* Dropdown Content */}
                                {menuOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 py-2 transform origin-top-right transition-all duration-200 z-50">
                                        {/* Header Dropdown */}
                                        <div className="px-4 py-3 border-b border-gray-100 mb-1">
                                            <p className="text-sm font-bold text-gray-800 truncate">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {user.email}
                                            </p>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="py-1">
                                            {(userIsAdmin || userIsCourier) && (
                                                <Link
                                                    href={route(
                                                        userIsCourier
                                                            ? "courier.dashboard"
                                                            : "admin.dashboard"
                                                    )}
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600"
                                                >
                                                    <LayoutDashboard className="w-4 h-4 mr-3" />
                                                    Dashboard
                                                </Link>
                                            )}

                                            <Link
                                                href={route("profile.edit")}
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600"
                                            >
                                                <User className="w-4 h-4 mr-3" />
                                                Profil Saya
                                            </Link>

                                            <Link
                                                href={route("history.index")}
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600"
                                            >
                                                <History className="w-4 h-4 mr-3" />
                                                Riwayat Pesanan
                                            </Link>
                                        </div>

                                        {/* Logout */}
                                        <div className="border-t border-gray-100 mt-1 pt-1">
                                            <button
                                                onClick={handleLogout}
                                                className="flex w-full items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <LogOut className="w-4 h-4 mr-3" />
                                                Keluar
                                            </button>
                                        </div>
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

            {/* --- MOBILE MENU OVERLAY --- */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-xl border-t border-gray-100 animate-in slide-in-from-top-5 duration-200 z-40 h-screen bg-opacity-95 backdrop-blur-sm">
                    <div className="p-4 space-y-6 bg-white h-full overflow-y-auto pb-20">
                        {/* Mobile Navigation Links */}
                        <div className="space-y-1">
                            <Link
                                href={route("home")}
                                className={getLinkClass("/", true)}
                            >
                                <span>Beranda</span>
                                <ChevronRight className="w-4 h-4 opacity-50" />
                            </Link>
                            <Link
                                href={route("penitipan.index")}
                                className={getLinkClass("/penitipan", true)}
                            >
                                <span>Penitipan</span>
                                <ChevronRight className="w-4 h-4 opacity-50" />
                            </Link>

                            <Link
                                href={route("pindahan.index")}
                                className={getLinkClass("/pindahan", true)}
                            >
                                <span>Pindahan</span>
                                <ChevronRight className="w-4 h-4 opacity-50" />
                            </Link>
                            <Link
                                href={route("about")}
                                className={getLinkClass("/tentang-kami", true)}
                            >
                                <span>Tentang Kami</span>
                                <ChevronRight className="w-4 h-4 opacity-50" />
                            </Link>
                            <Link
                                href={route("contact.show")}
                                className={getLinkClass("/contact", true)}
                            >
                                <span>Kontak</span>
                                <ChevronRight className="w-4 h-4 opacity-50" />
                            </Link>
                        </div>

                        {/* Mobile Account Section */}
                        <div className="pt-4 border-t border-gray-100">
                            {user ? (
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="mb-4">
                                        <p className="text-sm font-bold text-gray-900 truncate">
                                            Hi, {user.name}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {user.email}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        {(userIsAdmin || userIsCourier) && (
                                            <Link
                                                href={route(
                                                    userIsCourier
                                                        ? "courier.dashboard"
                                                        : "admin.dashboard"
                                                )}
                                                className="flex items-center w-full p-3 bg-white rounded-lg text-sm font-medium text-gray-700 border border-gray-200"
                                            >
                                                <LayoutDashboard className="w-4 h-4 mr-3 text-gray-500" />
                                                Dashboard
                                            </Link>
                                        )}
                                        <Link
                                            href={route("profile.edit")}
                                            className="flex items-center w-full p-3 bg-white rounded-lg text-sm font-medium text-gray-700 border border-gray-200"
                                        >
                                            <User className="w-4 h-4 mr-3 text-gray-500" />
                                            Profil Saya
                                        </Link>
                                        <Link
                                            href={route("history.index")}
                                            className="flex items-center w-full p-3 bg-white rounded-lg text-sm font-medium text-gray-700 border border-gray-200"
                                        >
                                            <History className="w-4 h-4 mr-3 text-gray-500" />
                                            Riwayat Pesanan
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full p-3 bg-red-50 rounded-lg text-sm font-medium text-red-600 border border-red-100"
                                        >
                                            <LogOut className="w-4 h-4 mr-3" />
                                            Keluar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    <Link
                                        href={route("login")}
                                        className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition"
                                    >
                                        <LogIn className="w-4 h-4" />
                                        Masuk
                                    </Link>
                                    <Link
                                        href={route("register")}
                                        className="flex items-center justify-center gap-2 py-3 px-4 bg-green-600 rounded-xl text-sm font-bold text-white hover:bg-green-700 transition shadow-sm"
                                    >
                                        <UserPlus className="w-4 h-4" />
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
