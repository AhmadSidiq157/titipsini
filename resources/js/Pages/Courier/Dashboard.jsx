import React from "react";
import CourierLayout from "../../Layouts/CourierLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { motion } from "framer-motion"; // [BARU] Animasi
import {
    User,
    Calendar,
    ChevronRight,
    ClipboardList,
    Package,
    TrendingUp,
    Clock,
    MapPin,
} from "lucide-react";

// --- Komponen Helper: Badge Status Modern ---
const StatusBadge = ({ status }) => {
    const styles = {
        pending: "bg-amber-50 text-amber-700 border-amber-200",
        processing: "bg-blue-50 text-blue-700 border-blue-200",
        ready_for_pickup: "bg-indigo-50 text-indigo-700 border-indigo-200",
        picked_up: "bg-purple-50 text-purple-700 border-purple-200",
        on_delivery:
            "bg-orange-50 text-orange-700 border-orange-200 animate-pulse", // Efek berdenyut saat mengantar
        delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
        completed: "bg-green-50 text-green-700 border-green-200",
        cancelled: "bg-red-50 text-red-700 border-red-200",
        unknown: "bg-gray-50 text-gray-700 border-gray-200",
    };

    const styleClass = styles[status] || styles.unknown;

    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${styleClass}`}
        >
            {status ? status.replace("_", " ") : "Unknown"}
        </span>
    );
};

// --- Komponen Helper: Kartu Statistik ---
const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <h4 className="text-2xl font-extrabold text-gray-800 mt-1">
                {value}
            </h4>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
    </div>
);

export default function Dashboard({ auth, tasks }) {
    const { flash } = usePage().props;
    const user = auth.user;

    // Hitung statistik sederhana dari data tasks yang ada
    // (Catatan: Untuk produksi, sebaiknya hitung ini di backend controller)
    const activeTasksCount = tasks.data.length;

    // Animasi container
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };

    return (
        <CourierLayout user={user} header="Dashboard">
            <Head title="Dashboard Kurir" />

            <div className="py-8 bg-gray-50/50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* --- Sapaan & Header --- */}
                    <div className="mb-8 px-4 sm:px-0">
                        <h2 className="text-3xl font-extrabold text-gray-900">
                            Halo,{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
                                {user.name}
                            </span>
                            ! 👋
                        </h2>
                        <p className="text-gray-500 mt-2">
                            Siap mengantar kebahagiaan hari ini?
                        </p>
                    </div>

                    {/* --- Statistik Ringkas --- */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 px-4 sm:px-0">
                        <StatCard
                            title="Tugas Aktif"
                            value={activeTasksCount}
                            icon={Package}
                            color="bg-blue-500"
                        />
                        <StatCard
                            title="Status Anda"
                            value={
                                user.courier_status === "available"
                                    ? "Online"
                                    : "Sibuk/Offline"
                            }
                            icon={Clock}
                            color={
                                user.courier_status === "available"
                                    ? "bg-green-500"
                                    : "bg-gray-400"
                            }
                        />
                        {/* Placeholder stat */}
                        <StatCard
                            title="Performa"
                            value="100%"
                            icon={TrendingUp}
                            color="bg-purple-500"
                        />
                    </div>

                    {/* Notifikasi Flash */}
                    {flash.success && (
                        <div className="mb-6 mx-4 sm:mx-0 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl shadow-sm flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                            {flash.success}
                        </div>
                    )}
                    {flash.error && (
                        <div className="mb-6 mx-4 sm:mx-0 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-sm">
                            {flash.error}
                        </div>
                    )}

                    {/* --- Daftar Tugas --- */}
                    <div className="px-4 sm:px-0">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <ClipboardList className="w-5 h-5 mr-2 text-gray-500" />
                            Daftar Tugas Terbaru
                        </h3>

                        {tasks.data.length > 0 ? (
                            <motion.div
                                className="space-y-4"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {tasks.data.map((task) => (
                                    <motion.div
                                        key={task.id}
                                        variants={itemVariants}
                                    >
                                        <Link
                                            href={route(
                                                "courier.tasks.show",
                                                task.id
                                            )}
                                            className="block group"
                                        >
                                            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-lg hover:border-green-200 transition-all duration-300 relative overflow-hidden">
                                                {/* Dekorasi Hover */}
                                                <div className="absolute top-0 left-0 w-1 h-full bg-gray-200 group-hover:bg-green-500 transition-colors duration-300"></div>

                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    {/* Info Utama */}
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className="text-lg font-bold text-gray-900">
                                                                Order #{task.id}
                                                            </span>
                                                            <StatusBadge
                                                                status={
                                                                    task.status
                                                                }
                                                            />
                                                        </div>

                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-gray-500">
                                                            <div className="flex items-center">
                                                                <User className="w-4 h-4 mr-2 text-gray-400" />
                                                                {task.user
                                                                    ? task.user
                                                                          .name
                                                                    : "Klien Dihapus"}
                                                            </div>
                                                            <div className="flex items-center">
                                                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                                                {new Date(
                                                                    task.created_at
                                                                ).toLocaleDateString(
                                                                    "id-ID",
                                                                    {
                                                                        day: "numeric",
                                                                        month: "long",
                                                                        year: "numeric",
                                                                        hour: "2-digit",
                                                                        minute: "2-digit",
                                                                    }
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Tampilkan Alamat Singkat jika ada */}
                                                        {task.user_form_details
                                                            ?.alamat_penjemputan && (
                                                            <div className="mt-3 flex items-start text-sm text-gray-600 bg-gray-50 p-2 rounded-lg md:w-fit">
                                                                <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                                                                <span className="line-clamp-1">
                                                                    {
                                                                        task
                                                                            .user_form_details
                                                                            .alamat_penjemputan
                                                                    }
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Action Icon */}
                                                    <div className="flex items-center justify-end">
                                                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-green-50 group-hover:text-green-600 transition-colors">
                                                            <ChevronRight className="w-5 h-5" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            // --- Empty State Modern ---
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300"
                            >
                                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ClipboardList className="w-10 h-10 text-green-500" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">
                                    Tidak Ada Tugas Saat Ini
                                </h3>
                                <p className="text-gray-500 mt-2 max-w-md mx-auto">
                                    Anda sedang santai! Tugas baru yang
                                    ditugaskan oleh admin akan muncul di sini
                                    secara otomatis.
                                </p>
                            </motion.div>
                        )}

                        {/* Pagination (Jika ada banyak tugas) */}
                        {tasks.links && tasks.meta && (
                            <div className="mt-6">
                                {/* Anda bisa menambahkan komponen Pagination di sini jika tasks menggunakan resource collection */}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </CourierLayout>
    );
}
