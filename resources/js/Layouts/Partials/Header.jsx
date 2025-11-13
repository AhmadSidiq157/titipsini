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
                                    <span className="font-semibold text-gray-800">
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
