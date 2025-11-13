import React, { useState, useEffect, useRef } from "react";
import { Link, usePage, router } from "@inertiajs/react";

export default function Header() {
    const { auth } = usePage().props;
    const [menuOpen, setMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

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

    return (
        <header className="bg-white shadow-sm sticky top-0 z-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    {/* LOGO */}
                    <Link href="/" className="text-2xl font-bold text-gray-800">
                        Titipsini<span className="text-green-500">.com</span>
                    </Link>

                    {/* NAVIGASI */}
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
                    <div className="relative" ref={dropdownRef}>
                        {auth?.user ? (
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-md hover:bg-gray-200 transition"
                                >
<<<<<<< HEAD
                                    <span className="font-semibold text-gray-800">
=======
                                    <button
                                        onClick={() =>
                                            setAccountDropdownOpen(
                                                (prev) => !prev
                                            )
                                        }
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-gray-700 font-semibold text-sm rounded-md hover:bg-gray-50 transition"
                                    >
                                        <User className="w-4 h-4 mr-2" />
                                        {auth.user.name}{" "}
                                        {/* Nampilin nama user */}
                                        <ChevronDown
                                            size={16}
                                            className={`ml-1 transition-transform duration-200 ${
                                                isAccountDropdownOpen
                                                    ? "rotate-180"
                                                    : ""
                                            }`}
                                        />
                                    </button>
                                    {/* Dropdown Menu untuk User Login */}
                                    {isAccountDropdownOpen && (
                                        //
                                        // [PERBAIKAN 1]: z-10 diubah jadi z-50
                                        //
                                        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border">
                                            <Link
                                                href={route("profile.edit")}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Profile
                                            </Link>
                                            <Link
                                                href={route("order.index")}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                History Pesanan
                                            </Link>
                                            <div className="border-t my-1"></div>
                                            <Link
                                                href={route("logout")}
                                                method="post"
                                                as="button"
                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                            >
                                                Log Out
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                //
                                // --- [BAGIAN INI TAMPIL JIKA BELUM LOGIN] ---
                                //
                                <div
                                    className="relative"
                                    ref={accountDropdownRef}
                                >
                                    <button
                                        onClick={() =>
                                            setAccountDropdownOpen(
                                                (prev) => !prev
                                            )
                                        }
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-semibold text-sm rounded-md hover:bg-gray-50 transition"
                                    >
                                        <User className="w-4 h-4 mr-2" />
                                        Akun
                                        <ChevronDown
                                            size={16}
                                            className={`ml-1 transition-transform duration-200 ${
                                                isAccountDropdownOpen
                                                    ? "rotate-180"
                                                    : ""
                                            }`}
                                        />
                                    </button>
                                    {/* Dropdown Menu untuk Tamu */}
                                    {isAccountDropdownOpen && (
                                        //
                                        // [PERBAIKAN 2]: z-10 diubah jadi z-50
                                        //
                                        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border">
                                            <Link
                                                href={route("login")}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Login
                                            </Link>
                                            <Link
                                                href={route("register")}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Register
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* */}
                        <div className="md:hidden flex items-center space-x-4">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-gray-600"
                            >
                                {isMenuOpen ? (
                                    <X size={24} />
                                ) : (
                                    <Menu size={24} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- Dropdown Menu untuk Mobile --- */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-gray-100">
                        {/* Link Navigasi Mobile */}
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                                        url === link.href
                                            ? "text-green-700 bg-green-50"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Link Akun Mobile */}
                        <div className="border-t border-gray-200 pt-4 pb-3">
                            {auth.user ? (
                                // --- JIKA SUDAH LOGIN (MOBILE) ---
                                <div className="px-5">
                                    <div className="font-medium text-base text-gray-800">
>>>>>>> 689ba71cd09014093199aaee3074cb74009c056f
                                        {auth.user.name}
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

                                {/* === DROPDOWN MODERN === */}
                                {menuOpen && (
                                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 z-50 transform origin-top-right transition-all duration-200 ease-out animate-dropdownShow">
                                        <Link
                                            href={route("profile.edit")}
                                            className="flex items-center gap-2 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-t-xl transition-all"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-4 h-4 text-gray-500"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M5.121 17.804A8 8 0 1118.364 4.56 8 8 0 015.12 17.804z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M15 11a3 3 0 11-6 0 3 3 0z"
                                                />
                                            </svg>
                                            Profil
                                        </Link>

                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2 w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50 rounded-b-xl transition-all"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-4 h-4 text-red-500"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5"
                                                />
                                            </svg>
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center space-x-4">
                                <Link
                                    href={route("login")}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-semibold text-sm rounded-md hover:bg-gray-50 transition"
                                >
                                    Login
                                </Link>
                                <Link
                                    href={route("register")}
                                    className="inline-flex items-center px-4 py-2 bg-green-500 text-white font-semibold text-sm rounded-md hover:bg-green-600 transition"
                                >
                                    Daftar
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
