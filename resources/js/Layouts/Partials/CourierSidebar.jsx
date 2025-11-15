import React from "react";
import { Link, usePage } from "@inertiajs/react";
// [WAJIB] Import motion dari framer-motion
import { motion } from "framer-motion";
import ApplicationLogo from "../../Components/ApplicationLogo";
import {
    LayoutDashboard,
    ShieldCheck,
    FileClock,
    User, // <-- [BARU] Ikon untuk Profil
} from "lucide-react";

// --- [EFEK] Varian untuk animasi list ---
const sidebarVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1, // <-- Ini adalah efek staggered
        },
    },
};

const linkVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
};

// --- [MODIFIKASI] Komponen SidebarLink dengan Efek ---
const SidebarLink = ({ href, active, children, icon }) => (
    <motion.li variants={linkVariants}>
        <motion.div
            whileHover={{ x: 5 }} // <-- Ini adalah efek "maju" saat hover
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="relative"
        >
            <Link
                href={href}
                className={`
                    flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg
                    transition-all duration-150 ease-in-out w-full
                    ${
                        active
                            ? "bg-gradient-to-r from-green-50 to-green-100 text-green-700 font-semibold shadow-inner" // <-- [EFEK] Gaya aktif baru
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }
                `}
            >
                <span
                    className={`flex-shrink-0 ${
                        active
                            ? "text-green-600"
                            : "text-gray-400 group-hover:text-gray-500"
                    }`}
                >
                    {icon}
                </span>
                <span>{children}</span>
            </Link>
            {/* [EFEK] Indikator aktif di sebelah kiri */}
            {active && (
                <motion.div
                    className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 rounded-r-full"
                    layoutId="active-indicator" // <-- Animasi perpindahan antar link
                />
            )}
        </motion.div>
    </motion.li>
);

// --- Komponen Sidebar Utama ---
export default function CourierSidebar({ user }) {
    const { url } = usePage();

    // Logika "pintar" (tetap sama)
    const verificationStatus = user?.courier_verification?.status;
    const isVerified = verificationStatus === "approved";

    return (
        <aside className="w-72 flex-col h-full bg-white shadow-xl flex border-r border-gray-100">
            {/* Logo */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-6 border-b h-16 flex items-center justify-center"
            >
                <Link href={route("home")}>
                    <ApplicationLogo className="h-10 w-auto text-gray-800" />
                </Link>
            </motion.div>

            {/* Nav Links dengan Efek Staggered */}
            <motion.nav
                variants={sidebarVariants}
                initial="hidden"
                animate="visible"
                className="flex-1 p-4 space-y-2 overflow-y-auto"
            >
                {/* [MODIFIKASI] Kita bungkus dengan <ul> untuk animasi */}
                <ul className="space-y-2">
                    {isVerified ? (
                        <>
                            {/* === TAMPILKAN INI HANYA JIKA KURIR SUDAH DISETUJUI === */}
                            <SidebarLink
                                href={route("courier.dashboard")}
                                active={
                                    url.startsWith("/courier/dashboard") ||
                                    url.startsWith("/courier/tasks")
                                }
                                icon={<LayoutDashboard size={20} />}
                            >
                                Dashboard Tugas
                            </SidebarLink>

                            {/* [BARU] Link ke profil (menggunakan link profile bawaan) */}
                            <SidebarLink
                                href={route("profile.edit")}
                                active={url.startsWith("/profile")}
                                icon={<User size={20} />}
                            >
                                Profil Saya
                            </SidebarLink>
                        </>
                    ) : (
                        <>
                            {/* === TAMPILKAN INI JIKA KURIR BELUM DISETUJUI === */}
                            <SidebarLink
                                href={route("courier.verification.create")}
                                active={url.includes("/courier/verification")}
                                icon={
                                    verificationStatus === "pending" ? (
                                        <FileClock size={20} />
                                    ) : (
                                        <ShieldCheck size={20} />
                                    )
                                }
                            >
                                {verificationStatus === "pending"
                                    ? "Status Verifikasi"
                                    : "Form Verifikasi"}
                            </SidebarLink>
                        </>
                    )}
                </ul>
            </motion.nav>

            {/* Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="p-4 border-t border-gray-100"
            >
                <p className="text-xs text-gray-400 text-center">
                    © {new Date().getFullYear()} Titipsini
                </p>
            </motion.div>
        </aside>
    );
}
