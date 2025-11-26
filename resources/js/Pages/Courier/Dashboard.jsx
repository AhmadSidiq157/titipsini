import React, { useState } from "react";
import CourierLayout from "@/Layouts/CourierLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Package,
    Navigation,
    CheckCircle2,
    TrendingUp,
    Truck,
    Box,
    ArrowRight,
    Wifi,
} from "lucide-react";

// --- Helper: Status Badge ---
const StatusBadge = ({ status }) => {
    let style = "bg-gray-100 text-gray-600 border-gray-200";
    let label = status?.replace(/_/g, " ") || "Unknown";
    let icon = null;

    switch (status) {
        case "ready_for_pickup":
            style =
                "bg-blue-50 text-blue-700 border-blue-200 shadow-[0_0_10px_rgba(59,130,246,0.2)] animate-pulse";
            label = "Jemput";
            icon = <Navigation size={10} className="mr-1" />;
            break;
        case "picked_up":
        case "on_delivery":
            style =
                "bg-amber-50 text-amber-700 border-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.2)]";
            label = "Mengantar";
            icon = <Truck size={10} className="mr-1" />;
            break;
        case "delivered":
        case "completed":
            style = "bg-emerald-50 text-emerald-700 border-emerald-200";
            label = "Selesai";
            icon = <CheckCircle2 size={10} className="mr-1" />;
            break;
        case "cancelled":
            style = "bg-red-50 text-red-700 border-red-200";
            label = "Batal";
            break;
    }

    return (
        <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border flex items-center ${style}`}
        >
            {icon} {label}
        </span>
    );
};

// --- Helper: Service Badge ---
const ServiceTypeBadge = ({ orderableType, details }) => {
    const isPenitipan =
        !!details?.branch_address || orderableType?.includes("Service");
    return isPenitipan ? (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100/80 text-emerald-700 text-[10px] font-bold border border-emerald-200 uppercase tracking-wide">
            <Box size={10} /> Penitipan
        </span>
    ) : (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-100/80 text-indigo-700 text-[10px] font-bold border border-indigo-200 uppercase tracking-wide">
            <Truck size={10} /> Pindahan
        </span>
    );
};

// --- Main Component ---
export default function Dashboard({
    auth,
    activeTasks,
    completedTasks,
    stats,
}) {
    const [tab, setTab] = useState("active");
    const user = auth.user;
    const { flash } = usePage().props;

    // Data yang ditampilkan berdasarkan Tab
    const displayedTasks = tab === "active" ? activeTasks : completedTasks;

    // Greetings
    const hour = new Date().getHours();
    const greeting =
        hour < 12
            ? "Selamat Pagi"
            : hour < 18
            ? "Selamat Siang"
            : "Selamat Malam";

    return (
        <CourierLayout user={user} header="Dashboard">
            <Head title="Dashboard Kurir" />

            <div className="min-h-screen bg-gray-100 pb-24 font-sans">
                {/* --- HERO SECTION --- */}
                <div className="relative bg-[#0F172A] pt-12 pb-32 px-6 rounded-b-[3rem] shadow-2xl overflow-visible z-10 transition-all duration-500">
                    {/* Background Effects */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-b-[3rem] z-0">
                        <div className="absolute top-[-20%] left-[-10%] w-80 h-80 bg-emerald-500/20 rounded-full blur-[100px]"></div>
                        <div className="absolute bottom-[20%] right-[-10%] w-60 h-60 bg-blue-600/20 rounded-full blur-[80px]"></div>
                    </div>

                    <div className="relative z-10 flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-inner">
                                <span className="text-2xl font-black text-white">
                                    {user.name.charAt(0)}
                                </span>
                            </div>
                            <div>
                                <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-1">
                                    {greeting}
                                </p>
                                <h1 className="text-2xl font-bold text-white leading-tight truncate w-48 drop-shadow-sm">
                                    {user.name}
                                </h1>
                            </div>
                        </div>

                        {/* [MODIFIKASI] Status Badge Otomatis (Tanpa Tombol) */}
                        <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-emerald-500/20 border-emerald-500/50 text-emerald-300 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                                <Wifi size={12} className="animate-pulse" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">
                                    Online
                                </span>
                            </div>
                            <span className="text-[9px] text-gray-400 mt-1 font-medium">
                                Siap Menerima Order
                            </span>
                        </div>
                    </div>

                    {/* FLOATING STATS CARD */}
                    <div className="absolute -bottom-12 left-6 right-6 z-20">
                        <div className="bg-white rounded-3xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] p-1 flex divide-x divide-gray-100 border border-gray-100">
                            <div className="flex-1 py-5 text-center group cursor-pointer hover:bg-gray-50 rounded-l-3xl transition-colors">
                                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1 tracking-wider">
                                    Tugas Aktif
                                </p>
                                <p className="text-2xl font-black text-gray-900 group-hover:text-emerald-600 transition-colors">
                                    {stats.active}
                                </p>
                            </div>
                            <div className="flex-1 py-5 text-center group cursor-pointer hover:bg-gray-50 transition-colors">
                                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1 tracking-wider">
                                    Selesai
                                </p>
                                <p className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {stats.completed}
                                </p>
                            </div>
                            <div className="flex-1 py-5 text-center group cursor-pointer hover:bg-gray-50 rounded-r-3xl transition-colors">
                                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1 tracking-wider">
                                    Rating
                                </p>
                                <div className="flex items-center justify-center gap-1">
                                    <p className="text-2xl font-black text-gray-900">
                                        {stats.rating}
                                    </p>
                                    <TrendingUp
                                        size={14}
                                        className="text-emerald-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-16"></div>

                <div className="px-5 mt-4 relative z-0">
                    {/* Flash Message */}
                    {flash.success && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 bg-emerald-500 text-white px-4 py-3 rounded-xl shadow-lg shadow-emerald-500/20 text-sm font-bold flex items-center justify-center"
                        >
                            <CheckCircle2 size={16} className="mr-2" />
                            {flash.success}
                        </motion.div>
                    )}

                    {/* --- TABS --- */}
                    <div className="bg-white/70 backdrop-blur-sm p-1.5 rounded-2xl flex relative mb-6 shadow-sm border border-gray-200/60">
                        <motion.div
                            className="absolute top-1.5 bottom-1.5 bg-white rounded-xl shadow-sm border border-gray-100 z-0"
                            initial={false}
                            animate={{
                                width: "calc(50% - 6px)",
                                x: tab === "active" ? 0 : "100%",
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                            }}
                        />

                        <button
                            onClick={() => setTab("active")}
                            className={`flex-1 py-3 text-sm font-bold rounded-xl relative z-10 transition-colors duration-200 ${
                                tab === "active"
                                    ? "text-gray-900"
                                    : "text-gray-400 hover:text-gray-600"
                            }`}
                        >
                            Tugas Berjalan
                        </button>
                        <button
                            onClick={() => setTab("history")}
                            className={`flex-1 py-3 text-sm font-bold rounded-xl relative z-10 transition-colors duration-200 ${
                                tab === "history"
                                    ? "text-gray-900"
                                    : "text-gray-400 hover:text-gray-600"
                            }`}
                        >
                            Riwayat
                        </button>
                    </div>

                    {/* --- TASK LIST --- */}
                    <div className="space-y-5 pb-20">
                        <AnimatePresence mode="wait">
                            {displayedTasks.length > 0 ? (
                                displayedTasks.map((task, i) => (
                                    <motion.div
                                        key={task.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <Link
                                            href={route(
                                                "courier.tasks.show",
                                                task.id
                                            )}
                                            className="block bg-white rounded-[1.5rem] p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 hover:border-emerald-200 hover:shadow-lg active:scale-[0.98] transition-all relative overflow-hidden group"
                                        >
                                            <div
                                                className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                                                    task.user_form_details
                                                        ?.branch_address ||
                                                    task.orderable_type?.includes(
                                                        "Service"
                                                    )
                                                        ? "bg-emerald-500"
                                                        : "bg-indigo-500"
                                                }`}
                                            ></div>

                                            <div className="flex justify-between items-start mb-4 pl-2">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg font-black text-gray-800 leading-none">
                                                            #{task.id}
                                                        </span>
                                                        <ServiceTypeBadge
                                                            orderableType={
                                                                task.orderable_type
                                                            }
                                                            details={
                                                                task.user_form_details
                                                            }
                                                        />
                                                    </div>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">
                                                        {new Date(
                                                            task.created_at
                                                        ).toLocaleDateString(
                                                            "id-ID",
                                                            {
                                                                day: "numeric",
                                                                month: "long",
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            }
                                                        )}
                                                    </p>
                                                </div>
                                                <StatusBadge
                                                    status={task.status}
                                                />
                                            </div>

                                            <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100 relative ml-2">
                                                <div className="absolute left-[27px] top-8 bottom-8 w-0.5 border-l-2 border-dashed border-gray-300"></div>

                                                <div className="relative flex items-start gap-3 mb-4">
                                                    <div className="w-6 h-6 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center shadow-sm z-10 mt-0.5">
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[10px] text-blue-500 font-bold uppercase mb-0.5">
                                                            Jemput
                                                        </p>
                                                        <p className="text-sm font-semibold text-gray-700 line-clamp-1 leading-snug">
                                                            {task
                                                                .user_form_details
                                                                ?.alamat_penjemputan ||
                                                                "Lokasi Jemput..."}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="relative flex items-start gap-3">
                                                    <div className="w-6 h-6 rounded-full bg-white border-2 border-orange-500 flex items-center justify-center shadow-sm z-10 mt-0.5">
                                                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[10px] text-orange-500 font-bold uppercase mb-0.5">
                                                            Tujuan
                                                        </p>
                                                        <p className="text-sm font-semibold text-gray-700 line-clamp-1 leading-snug">
                                                            {!!task
                                                                .user_form_details
                                                                ?.branch_address ||
                                                            task.orderable_type?.includes(
                                                                "Service"
                                                            )
                                                                ? task
                                                                      .user_form_details
                                                                      ?.branch_address ||
                                                                  "Gudang Cabang"
                                                                : task
                                                                      .user_form_details
                                                                      ?.alamat_tujuan ||
                                                                  "Lokasi Tujuan..."}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex justify-end">
                                                <div className="inline-flex items-center text-xs font-bold text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors group-hover:bg-gray-900 group-hover:text-white">
                                                    Lihat Detail{" "}
                                                    <ArrowRight
                                                        size={12}
                                                        className="ml-1.5"
                                                    />
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center py-20 text-center"
                                >
                                    <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-inner">
                                        <Package
                                            size={48}
                                            className="text-gray-300 opacity-50"
                                        />
                                    </div>
                                    <h3 className="text-xl font-black text-gray-800 mb-2">
                                        {tab === "active"
                                            ? "Semua Beres!"
                                            : "Belum Ada Riwayat"}
                                    </h3>
                                    <p className="text-sm text-gray-400 max-w-xs leading-relaxed px-4">
                                        {tab === "active"
                                            ? "Belum ada tugas baru. Tetap semangat menunggu orderan!"
                                            : "Anda belum menyelesaikan tugas apapun."}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </CourierLayout>
    );
}
