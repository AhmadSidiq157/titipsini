import React, { useState, useEffect, useRef } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Menu, X, ChevronDown, User } from "lucide-react";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [isAccountDropdownOpen, setAccountDropdownOpen] = useState(false);

    const navDropdownRef = useRef(null);
    const accountDropdownRef = useRef(null);

    const {
        url,
        props: { auth, settings },
    } = usePage();

    const navLinks = [
        { label: "Beranda", href: "/" },
        { label: "Pindahan", href: "/layanan" },
        { label: "Tentang Kami", href: "/tentang-kami" },
        { label: "Kontak", href: "/contact" },
    ];

    const handleDropdownToggle = (label) => {
        setOpenDropdown(openDropdown === label ? null : label);
    };

    // Efek untuk menutup dropdown saat user mengklik di luar areanya
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                navDropdownRef.current &&
                !navDropdownRef.current.contains(event.target)
            ) {
                setOpenDropdown(null);
            }
            if (
                accountDropdownRef.current &&
                !accountDropdownRef.current.contains(event.target)
            ) {
                setAccountDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [navDropdownRef, accountDropdownRef]);

    return (
        <>
            <header className="bg-white shadow-sm sticky top-0 z-40">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        {/* */}
                        <Link href="/">
                            {settings.site_logo ? (
                                <img
                                    src={`/storage/${settings.site_logo}`}
                                    alt="Logo Titipsini.com"
                                    className="h-12 w-auto"
                                />
                            ) : (
                                <span className="text-2xl font-bold">
                                    Titipsini
                                    <span className="text-green-500">.com</span>
                                </span>
                            )}
                        </Link>

                        {/* */}
                        <nav
                            className="hidden md:flex items-center space-x-8"
                            ref={navDropdownRef}
                        >
                            {navLinks.map((link) => {
                                // ... (logika dropdown navigasi)
                                const isDropdownActive =
                                    link.isDropdown &&
                                    link.items.some((item) =>
                                        url.startsWith(item.href)
                                    );

                                return link.isDropdown ? (
                                    <div key={link.label} className="relative">
                                        {/* ... (kode tombol dropdown) ... */}
                                    </div>
                                ) : (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        className={`transition-colors font-medium ${
                                            url === link.href
                                                ? "text-green-600"
                                                : "text-gray-600 hover:text-green-600"
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* --- [BAGIAN PENTING] Tombol Aksi di Kanan (Desktop) --- */}
                        <div className="hidden md:flex items-center space-x-4">
                            {/* Logika Tampilan Tombol Akun */}
                            {auth.user ? (
                                //
                                // --- [BAGIAN INI TAMPIL JIKA SUDAH LOGIN] ---
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
                                        {auth.user.name}
                                    </div>
                                    <div className="font-medium text-sm text-gray-500">
                                        {auth.user.email}
                                    </div>
                                    <div className="mt-3 space-y-1">
                                        <Link
                                            href={route("profile.edit")}
                                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        >
                                            Profile
                                        </Link>
                                        <Link
                                            href={route("order.index")}
                                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        >
                                            Pesanan Saya
                                        </Link>
                                        <Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-50 hover:text-red-700"
                                        >
                                            Log Out
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                // --- JIKA BELUM LOGIN (MOBILE) ---
                                <div className="px-2 space-y-1">
                                    <Link
                                        href={route("login")}
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href={route("register")}
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </header>
        </>
    );
}
