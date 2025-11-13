import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import {
    Briefcase,
    Users,
    LayoutDashboard,
    Settings,
    ChevronDown,
    Image,
    MessageSquare,
    Phone,
    ClipboardList,
    Package,
    Target,
    GraduationCap,
    BookOpen,
    Library,
    Home, // Tambahan ikon untuk Halaman Depan
    FileText, // Tambahan ikon untuk Halaman Layanan
    ShieldCheck,
    MapPin,
} from "lucide-react";

// --- KOMPONEN-KOMPONEN KECIL (HELPER) ---

const SidebarLink = ({ href, active, children, icon }) => (
    <Link
        href={href}
        className={`group relative flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
            active
                ? "bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-amber-300 shadow-md scale-[1.02]"
                : "text-gray-400 hover:bg-[#1e293b] hover:text-white"
        }`}
    >
        {active && (
            <span className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 rounded-r-lg"></span>
        )}
        <span
            className={`mr-3 ${
                active
                    ? "text-amber-300"
                    : "text-gray-500 group-hover:text-gray-200"
            } transition-colors duration-200`}
        >
            {icon}
        </span>
        {children}
    </Link>
);

const SidebarSubLink = ({ href, active, children }) => (
    <Link
        href={href}
        className={`group flex items-center pl-11 pr-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
            active
                ? "bg-[#1e293b] text-amber-300"
                : "text-gray-400 hover:bg-[#1e293b] hover:text-white"
        }`}
    >
        {children}
    </Link>
);

const SidebarDropdown = ({
    title,
    icon,
    active,
    isOpen,
    onToggle,
    children,
}) => (
    <div>
        <button
            onClick={onToggle}
            className={`group w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                active
                    ? "bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-amber-300 shadow-md scale-[1.02]"
                    : "text-gray-400 hover:bg-[#1e293b] hover:text-white"
            }`}
        >
            <span
                className={`mr-3 ${
                    active
                        ? "text-amber-300"
                        : "text-gray-500 group-hover:text-gray-200"
                }`}
            >
                {icon}
            </span>
            {title}
            <ChevronDown
                className={`ml-auto h-5 w-5 transform transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-amber-300" : ""
                }`}
            />
        </button>
        <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
                isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
            }`}
        >
            <div className="mt-1 space-y-1">{children}</div>
        </div>
    </div>
);

// --- KOMPONEN UTAMA SIDEBAR ---

export default function AdminSidebar() {
    // State untuk setiap dropdown menu
    const [openDropdown, setOpenDropdown] = useState({
        halamanDepan: route().current("admin.services.*"),
        halamanLayanan: route().current("admin.moving-packages.*"),
        pengaturan:
            route().current("admin.settings.*") ||
            route().current("admin.branches.*"), // <-- Ini sudah benar
    });

    const handleToggle = (dropdown) => {
        setOpenDropdown((prev) => ({ ...prev, [dropdown]: !prev[dropdown] }));
    };

    return (
        <aside className="w-64 min-h-screen bg-[#0f172a] text-gray-200 flex flex-col border-r border-[#1e293b] shadow-2xl">
            {/* Header */}
            <div className="h-16 flex items-center justify-center bg-gradient-to-r from-[#0f172a] to-[#1e293b] border-b border-[#1e293b] shadow-lg">
                <Link
                    href={route("dashboard")}
                    className="text-amber-300 font-semibold text-lg tracking-wider hover:text-amber-200 transition-colors"
                >
                    ADMIN PANEL
                </Link>
            </div>

            {/* Navigasi */}
            <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#1e293b] scrollbar-track-[#0f172a]">
                <SidebarLink
                    href={route("dashboard")}
                    active={route().current("dashboard")}
                    icon={<LayoutDashboard className="h-5 w-5" />}
                >
                    Dashboard
                </SidebarLink>

                <SidebarLink
                    href={route("admin.orders.index")}
                    active={route().current("admin.orders.*")}
                    icon={<ClipboardList className="h-5 w-5" />}
                >
                    Manajemen Pesanan
                </SidebarLink>

                {/* --- Dropdown Manajemen Halaman Depan --- */}
                <SidebarDropdown
                    title="Halaman Depan"
                    icon={<Home className="h-5 w-5" />}
                    active={openDropdown.halamanDepan}
                    isOpen={openDropdown.halamanDepan}
                    onToggle={() => handleToggle("halamanDepan")}
                >
                    <SidebarSubLink
                        href={route("admin.services.index")}
                        active={route().current("admin.services.*")}
                    >
                        Layanan Umum
                    </SidebarSubLink>
                </SidebarDropdown>

                {/* --- Dropdown Manajemen Halaman Layanan --- */}
                <SidebarDropdown
                    title="Halaman Layanan"
                    icon={<FileText className="h-5 w-5" />}
                    active={openDropdown.halamanLayanan}
                    isOpen={openDropdown.halamanLayanan}
                    onToggle={() => handleToggle("halamanLayanan")}
                >
                    <SidebarSubLink
                        href={route("admin.moving-packages.index")}
                        active={route().current("admin.moving-packages.*")}
                    >
                        Paket Pindahan
                    </SidebarSubLink>
                </SidebarDropdown>

                {/* --- [MODIFIKASI] Dropdown Manajemen Halaman Internship dimatikan --- */}
                {/* ... (kode link nonaktif) ... */}

                {/* --- [MODIFIKASI] Dropdown Manajemen Halaman Program dimatikan --- */}
                {/* ... (kode link nonaktif) ... */}

                {/* --- [MODIFIKASI] Link Lowongan Kerja dimatikan --- */}
                {/* ... (kode link nonaktif) ... */}

                <SidebarLink
                    href={route("admin.users.index")}
                    active={route().current("admin.users.*")}
                    icon={<Users className="h-5 w-5" />}
                >
                    Manajemen User
                </SidebarLink>

                <SidebarLink
                    href={route("admin.verification.index")}
                    active={route().current("admin.verification.*")}
                    icon={<ShieldCheck className="h-5 w-5" />}
                >
                    Verifikasi User (Klien)
                </SidebarLink>

                {/* [PERBAIKAN] Link "Verifikasi Kurir" ini saya nonaktifkan (comment) 
                  karena ini adalah SUMBER ERROR UTAMA di screenshot Anda.

                  Error-nya adalah: "route 'admin.courier_verifications.index' is not in the route list."

                  Jika rute ini sudah Anda buat di Laravel, pastikan namanya sama persis,
                  lalu jalankan `php artisan route:cache` & `php artisan ziggy:generate`.
                  Setelah itu, Anda bisa menghapus komentar (uncomment) blok di bawah ini.
                */}
                {/* <SidebarLink
                    href={route("admin.courier_verifications.index")}
                    active={route().current("admin.courier_verifications.*")}
                    icon={<ShieldCheck className="h-5 w-5" />}
                >
                    Verifikasi Kurir
                </SidebarLink>
                */}

                <SidebarDropdown
                    title="Pengaturan"
                    icon={<Settings className="h-5 w-5" />}
                    active={openDropdown.pengaturan}
                    isOpen={openDropdown.pengaturan}
                    onToggle={() => handleToggle("pengaturan")}
                >
                    {/* --- Manajemen Cabang (Sudah Benar) --- */}
                    <SidebarSubLink
                        href={route("admin.branches.index")}
                        active={route().current("admin.branches.*")}
                    >
                        Manajemen Cabang
                    </SidebarSubLink>
                    {/* --- Batas Tambahan --- */}

                    <SidebarSubLink
                        href={route("admin.settings.contact")}
                        active={route().current("admin.settings.contact")}
                    >
                        Info Kontak
                    </SidebarSubLink>
                    <SidebarSubLink
                        href={route("admin.settings.social")}
                        active={route().current("admin.settings.social")}
                    >
                        Media Sosial
                    </SidebarSubLink>
                    <SidebarSubLink
                        href={route("admin.settings.logo")}
                        active={route().current("admin.settings.logo")}
                    >
                        Logo
                    </SidebarSubLink>
                </SidebarDropdown>
            </nav>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-[#1e293b] text-center text-xs text-gray-500">
                © {new Date().getFullYear()} Admin Panel
            </div>
        </aside>
    );
}
