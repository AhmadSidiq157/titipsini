import React from "react";
import { Link, usePage } from "@inertiajs/react";

// [MODIFIKASI] Import ikon yang diperlukan
import { LayoutDashboard, User } from "lucide-react";

// --- [BARU] Komponen SidebarLink di-copy dari AdminSidebar ---
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
// --- Akhir komponen copy ---

// --- Komponen Sidebar Utama ---
export default function CourierSidebar({ user }) {
    const { url } = usePage();

    // Logika state dropdown tidak diperlukan di sini karena kurir tidak punya dropdown

    return (
        // [MODIFIKASI] Menggunakan style dari AdminSidebar
        <aside className="w-64 min-h-screen bg-[#0f172a] text-gray-200 flex flex-col border-r border-[#1e293b] shadow-2xl">
            {/* Header */}
            <div className="h-16 flex items-center justify-center bg-gradient-to-r from-[#0f172a] to-[#1e293b] border-b border-[#1e293b] shadow-lg">
                <Link
                    href={route("courier.dashboard")} // Ganti link ke dashboard kurir
                    className="text-amber-300 font-semibold text-lg tracking-wider hover:text-amber-200 transition-colors"
                >
                    {/* [MODIFIKASI] Teks diubah */}
                    COURIER PANEL
                </Link>
            </div>

            {/* Navigasi */}
            <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#1e293b] scrollbar-track-[#0f172a]">
                {/* [MODIFIKASI] Hapus <ul>, langsung gunakan SidebarLink */}

                <SidebarLink
                    href={route("courier.dashboard")}
                    active={
                        url.startsWith("/courier/dashboard") ||
                        url.startsWith("/courier/tasks")
                    }
                    icon={<LayoutDashboard className="h-5 w-5" />}
                >
                    Dashboard Tugas
                </SidebarLink>

                <SidebarLink
                    href={route("profile.edit")}
                    active={url.startsWith("/profile")}
                    icon={<User className="h-5 w-5" />}
                >
                    Profil Saya
                </SidebarLink>
            </nav>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-[#1e293b] text-center text-xs text-gray-500">
                {/* [MODIFIKASI] Teks diubah */}© {new Date().getFullYear()}{" "}
                Courier Panel
            </div>
        </aside>
    );
}
