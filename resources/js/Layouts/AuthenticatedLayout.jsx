import { useState } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, usePage } from "@inertiajs/react";
import NotificationDropdown from "@/Components/NotificationDropdown";
import { Bell } from "lucide-react"; // Pastikan sudah install lucide-react

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth?.user;

    // Ambil data notifikasi global
    const { auth } = usePage().props;
    const notificationData = auth.notifications || {};
    const unreadCount = notificationData.unread_count || 0;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    // Layout untuk User yang belum Login
    if (!user) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                    <div className="flex justify-center mb-6">
                        <Link href="/">
                            <ApplicationLogo className="w-30 h-16 text-indigo-600" />
                        </Link>
                    </div>
                    {children}
                </div>
            </div>
        );
    }

    // Layout Utama (Sudah Login)
    return (
        <div className="min-h-screen bg-gray-50">
            {/* --- NAVBAR HEADER --- */}
            <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* --- KIRI: Logo & Menu Desktop --- */}
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    {/* Logo Aplikasi */}
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            {/* Menu Navigasi Desktop */}
                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route("home")}
                                    active={route().current("home")}
                                >
                                    Beranda
                                </NavLink>
                                <NavLink
                                    href={route("history.index")}
                                    active={route().current("history.*")}
                                >
                                    Riwayat Order
                                </NavLink>
                            </div>
                        </div>

                        {/* --- KANAN: TAMPILAN DESKTOP (Layar Besar) --- */}
                        <div className="hidden sm:flex sm:items-center sm:ms-6 gap-3">
                            {/* Dropdown Notifikasi (Khusus Desktop) */}
                            <div className="relative">
                                <NotificationDropdown />
                            </div>

                            {/* Dropdown Profil User */}
                            <div className="ms-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {user.name}
                                                <svg
                                                    className="ms-2 -me-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route("profile.edit")}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        {user.courier_status && (
                                            <Dropdown.Link
                                                href={route(
                                                    "courier.dashboard"
                                                )}
                                            >
                                                Dashboard Kurir
                                            </Dropdown.Link>
                                        )}
                                        <Dropdown.Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* --- KANAN: TAMPILAN MOBILE/TABLET (Layar Kecil) --- */}
                        <div className="-me-2 flex items-center sm:hidden gap-3">
                            {/* 🔥 [INI KUNCINYA] Notifikasi Mobile Langsung di Header 🔥 */}
                            <Link
                                href={route("notifications.index")}
                                className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                            >
                                <Bell size={24} />

                                {/* Badge Merah (Angka Notif) */}
                                {unreadCount > 0 && (
                                    <span className="absolute top-1.5 right-2 flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
                                    </span>
                                )}
                            </Link>

                            {/* Tombol Hamburger (Garis Tiga) */}
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState
                                    )
                                }
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- MENU RESPONSIVE (Saat Hamburger Diklik) --- */}
                <div
                    className={
                        (showingNavigationDropdown ? "block" : "hidden") +
                        " sm:hidden"
                    }
                >
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink
                            href={route("home")}
                            active={route().current("home")}
                        >
                            Beranda
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route("history.index")}
                            active={route().current("history.*")}
                        >
                            Riwayat Order
                        </ResponsiveNavLink>
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800">
                                {user.name}
                            </div>
                            <div className="font-medium text-sm text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route("profile.edit")}>
                                Profile
                            </ResponsiveNavLink>
                            {/* HAPUS menu notifikasi dari sini supaya tidak duplikat */}
                            {user.courier_status && (
                                <ResponsiveNavLink
                                    href={route("courier.dashboard")}
                                >
                                    Dashboard Kurir
                                </ResponsiveNavLink>
                            )}
                            <ResponsiveNavLink
                                href={route("logout")}
                                method="post"
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Header Halaman (Opsional) */}
            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* Konten Utama */}
            <main>{children}</main>
        </div>
    );
}
