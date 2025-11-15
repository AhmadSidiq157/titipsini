import React, { useState, useEffect, useRef } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { User, LogOut, History, LayoutDashboard, Truck } from "lucide-react";

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
    const [menuOpen, setMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    const user = auth?.user;
    const userIsClient = isClient(user);
    const userIsAdmin = hasRole(user, "admin");
    const userIsCourier = hasRole(user, "kurir");

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route("logout"));
    };

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

    return (
        <header className="bg-white shadow-sm sticky top-0 z-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    {/* LOGO */}
                    <Link href="/" className="text-2xl font-bold text-gray-800">
                        Titipsini<span className="text-green-500">.com</span>
                    </Link>

                    {/* NAVIGASI (Hanya Desktop) */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link
                            href="/"
                            className="transition-colors font-medium text-gray-600 hover:text-green-600"
                        >
                            Beranda
                        </Link>
                        <Link
                            href="/layanan"
                            className="transition-colors font-medium text-gray-600 hover:text-green-600"
                        >
                            Pindahan
                        </Link>
                        <Link
                            href="/tentang-kami"
                            className="transition-colors font-medium text-gray-600 hover:text-green-600"
                        >
                            Tentang Kami
                        </Link>
                        <Link
                            href="/contact"
                            className="transition-colors font-medium text-gray-600 hover:text-green-600"
                        >
                            Kontak
                        </Link>
                    </nav>

                    {/* AKUN / LOGIN */}
                    {/* [PERBAIKAN] 'ref' dipindah ke 'div' terluar agar 'relative' tidak diperlukan */}
                    <div ref={dropdownRef}>
                        {!user && (
                            // --- 1. TAMPILAN TAMU (GUEST) ---
                            <div className="flex items-center space-x-2 flex-nowrap">
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

                        {userIsClient && (
                            // --- 2. TAMPILAN KLIEN ---
                            // [PERBAIKAN] Tambahkan 'relative' di sini
                            <div className="relative flex items-center space-x-2">
                                <button
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-md hover:bg-gray-200 transition"
                                >
                                    <span className="font-semibold text-gray-800 truncate max-w-[100px]">
                                        {user.name}
                                    </span>
                                    <svg
                                        className={`w-4 h-4 text-gray-600 transform transition-transform duration-200 ${
                                            menuOpen ? "rotate-180" : ""
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
                                    // [PERBAIKAN] Ganti 'mt-3' menjadi 'top-full mt-2'
                                    // 'top-full' berarti "mulai SETELAH tinggi parent"
                                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 transform origin-top-right transition-all duration-200 ease-out animate-dropdownShow">
                                        <Link
                                            href={route("profile.edit")}
                                            className="flex items-center gap-2 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-t-xl transition-all"
                                        >
                                            <User className="w-4 h-4 text-gray-500" />
                                            Profil Saya
                                        </Link>
                                        <Link
                                            href={route("history.index")}
                                            className="flex items-center gap-2 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-all"
                                        >
                                            <History className="w-4 h-4 text-gray-500" />
                                            Riwayat Pesanan
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2 w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50 rounded-b-xl transition-all"
                                        >
                                            <LogOut className="w-4 h-4 text-red-500" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {(userIsAdmin || userIsCourier) && (
                            // --- 3. TAMPILAN ADMIN / KURIR (Jika nyasar) ---
                            // [PERBAIKAN] Tambahkan 'relative' di sini
                            <div className="relative flex items-center space-x-2">
                                <button
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    className="flex items-center space-x-2 bg-red-100 px-3 py-2 rounded-md hover:bg-red-200 transition"
                                >
                                    <span className="font-semibold text-red-800 truncate max-w-[100px]">
                                        {user.name}
                                    </span>
                                    <svg
                                        className={`w-4 h-4 text-red-600 transform transition-transform duration-200 ${
                                            menuOpen ? "rotate-180" : ""
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
                                    // [PERBAIKAN] Ganti 'mt-3' menjadi 'top-full mt-2'
                                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 transform origin-top-right transition-all duration-200 ease-out animate-dropdownShow">
                                        <Link
                                            href={route("dashboard")} // Link "Kembali ke Dashboard"
                                            className="flex items-center gap-2 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-t-xl transition-all"
                                        >
                                            {userIsAdmin ? (
                                                <LayoutDashboard className="w-4 h-4 text-gray-500" />
                                            ) : (
                                                <Truck className="w-4 h-4 text-gray-500" />
                                            )}
                                            Kembali ke Dashboard
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2 w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50 rounded-b-xl transition-all"
                                        >
                                            <LogOut className="w-4 h-4 text-red-500" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
