import React, { useState, useEffect, useRef } from "react";
import { Link, usePage } from "@inertiajs/react";
// import SearchModal from "./SearchModal"; // <-- [DIHAPUS] Search dihilangkan
import { Menu, X, ChevronDown, User } from "lucide-react"; // <-- [DIHAPUS] Search dihilangkan dari import

export default function Header() {
    // ... (kode state, refs, props, handlers, useEffect tidak berubah) ...
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // const [isSearchOpen, setIsSearchOpen] = useState(false); // <-- [DIHAPUS] Search dihilangkan
    const [openDropdown, setOpenDropdown] = useState(null);
    const [isAccountDropdownOpen, setAccountDropdownOpen] = useState(false);

    // Refs untuk mendeteksi klik di luar area dropdown
    const navDropdownRef = useRef(null);
    const accountDropdownRef = useRef(null);

    // Mengambil URL, status otentikasi, dan settings dari Inertia
    const {
        url,
        props: { auth, settings },
    } = usePage();

    // --- LOGIKA WHATSAPP TIDAK KITA PAKAI LAGI ---
    // ...

    // Konfigurasi link navigasi
    const navLinks = [
        { label: "Beranda", href: "/" },
        { label: "Pindahan", href: "/layanan" },
        { label: "Tentang Kami", href: "/tentang-kami" },
        { label: "Kontak", href: "/contact" },
        // { <-- [DIHAPUS] Bagian "Karir & Program" dihilangkan sesuai permintaan
        //     label: "Karir & Program",
        //     isDropdown: true,
        //     items: [
        //         { label: "Lowongan Kerja", href: "/lowongan-kerja" },
        //         { label: "Internship", href: "/internship" },
        //         { label: "Program Kami", href: "/program-kami" },
        //     ],
        // },
    ];

    // Handler untuk membuka/menutup dropdown navigasi
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
                        </Link>{" "}
                        <nav
                            className="hidden md:flex items-center space-x-8"
                            ref={navDropdownRef}
                        >
                            {navLinks.map((link) => {
                                const isDropdownActive =
                                    link.isDropdown &&
                                    link.items.some((item) =>
                                        url.startsWith(item.href)
                                    );

                                return link.isDropdown ? (
                                    <div key={link.label} className="relative">
                                        <button
                                            onClick={() =>
                                                handleDropdownToggle(link.label)
                                            }
                                            className={`flex items-center transition-colors font-medium ${
                                                isDropdownActive
                                                    ? "text-green-600"
                                                    : "text-gray-600 hover:text-green-600"
                                            }`}
                                        >
                                            {link.label}
                                            <ChevronDown
                                                size={16}
                                                className={`ml-1 transition-transform duration-200 ${
                                                    openDropdown === link.label
                                                        ? "rotate-180"
                                                        : ""
                                                }`}
                                            />
                                        </button>
                                        {openDropdown === link.label && (
                                            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 border">
                                                {link.items.map((item) => {
                                                    const isActive =
                                                        url === item.href;
                                                    return (
                                                        <Link
                                                            key={item.label}
                                                            href={item.href}
                                                            className={`block px-4 py-2 text-sm ${
                                                                isActive
                                                                    ? "text-green-600 bg-green-50 font-semibold"
                                                                    : "text-gray-700 hover:bg-green-50 hover:text-green-600"
                                                            }`}
                                                            onClick={() =>
                                                                setOpenDropdown(
                                                                    null
                                                                )
                                                            }
                                                        >
                                                            {item.label}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}
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
                        {/* --- Tombol Aksi di Kanan (BAGIAN YANG DIPERBARUI) --- */}
                        <div className="hidden md:flex items-center space-x-4">
                            {/* [DIHAPUS] Tombol Search dihilangkan */}

                            {auth.user ? (
                                <></>
                            ) : (
                                // Jika user belum login
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
                                    {isAccountDropdownOpen && (
                                        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 border">
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

                            {/* [MODIFIKASI] Diubah jadi <a> tag (anchor link) untuk scroll ke section */}
                            <a
                                href="#layanan"
                                className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                            >
                                Titip Sekarang
                            </a>
                        </div>
                        {/* Tombol untuk Menu Mobile */}
                        <div className="md:hidden flex items-center space-x-4">
                            {/* [DIHAPUS] Tombol Search dihilangkan */}

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

                {/* Dropdown Menu untuk Mobile (jika terbuka) */}
                {isMenuOpen && <div className="md:hidden"></div>}
            </header>
        </>
    );
}
