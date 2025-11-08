import React from "react";
import { Link, usePage } from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo"; // Menggunakan alias
import {
    LayoutDashboard,
    LogOut,
    ShieldCheck, // Ikon baru untuk verifikasi
    FileClock, // Ikon baru untuk pending
} from "lucide-react";

// Komponen link sidebar internal
const SidebarLink = ({ href, active, children }) => (
    <Link
        href={href}
        className={`
            flex items-center space-x-3 px-4 py-3 text-sm font-medium
            transition-all duration-150 ease-in-out
            ${
                active
                    ? "bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }
        `}
    >
        {children}
    </Link>
);

// [MODIFIKASI] Menerima prop 'user' dari CourierLayout
export default function CourierSidebar({ user }) {
    const { url } = usePage();

    // [LOGIKA PINTAR]
    // Dapatkan status verifikasi dari prop user yang sudah di-load
    // Status bisa: 'approved', 'pending', 'rejected', or null (baru)
    const verificationStatus = user?.courier_verification?.status;

    // Cek apakah kurir sudah disetujui (verified)
    const isVerified = verificationStatus === "approved";

    return (
        <aside className="w-64 flex-shrink-0 bg-white shadow-lg border-r border-gray-100 flex flex-col">
            {/* Logo */}
            <div className="h-16 flex items-center justify-center px-4 border-b border-gray-100">
                <Link href="/">
                    <ApplicationLogo className="block h-10 w-auto" />
                </Link>
            </div>

            {/* Navigasi */}
            <nav className="flex-1 overflow-y-auto py-4 space-y-1">
                {/* [LOGIKA KONDISIONAL] */}
                {isVerified ? (
                    <>
                        {/* === TAMPILKAN INI HANYA JIKA KURIR SUDAH DISETUJUI === */}
                        <SidebarLink
                            href={route("courier.dashboard")}
                            active={url.startsWith("/courier/dashboard")}
                        >
                            <LayoutDashboard size={20} />
                            <span>Dashboard Tugas</span>
                        </SidebarLink>

                        {/* Nanti Anda bisa tambahkan link "Riwayat Tugas" atau "Profil" di sini */}
                    </>
                ) : (
                    <>
                        {/* === TAMPILKAN INI JIKA KURIR BELUM DISETUJUI === */}
                        <SidebarLink
                            href={route("courier.verification.create")}
                            active={url.startsWith("/courier/verification")}
                        >
                            {verificationStatus === "pending" ? (
                                <FileClock
                                    size={20}
                                    className="text-yellow-600"
                                />
                            ) : (
                                <ShieldCheck
                                    size={20}
                                    className="text-blue-600"
                                />
                            )}

                            <span>
                                {verificationStatus === "pending"
                                    ? "Status Verifikasi"
                                    : "Form Verifikasi"}
                            </span>
                        </SidebarLink>
                    </>
                )}
            </nav>

            {/* Bagian Bawah (Logout) */}
            <div className="py-4 border-t border-gray-100">
                <SidebarLink
                    href={route("logout")}
                    method="post"
                    as="button"
                    active={false}
                >
                    <LogOut size={20} className="text-red-600" />
                    <span className="text-red-700">Logout</span>
                </SidebarLink>
            </div>
        </aside>
    );
}
