import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import {
    Users,
    ClipboardList,
    ShieldCheck,
    UserPlus,
    PlusCircle,
    LogIn,
    DollarSign,
    Package,
    Activity, // Icon Baru: Untuk Pesanan Aktif
    AlertCircle, // Icon Baru: Untuk Status/Perlu Tindakan
} from "lucide-react";
import { motion } from "framer-motion";

// --- Helper: Format Rupiah ---
const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number || 0);
};

// Komponen Kartu Statistik
const StatCard = ({ icon, title, value, colorClass, delay, subtext }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex items-center space-x-4 hover:shadow-xl transition-shadow duration-300"
    >
        <div className={`p-3 rounded-full ${colorClass.bg}`}>
            {React.cloneElement(icon, {
                className: `h-7 w-7 ${colorClass.text}`,
            })}
        </div>
        <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                {title}
            </p>
            <p className="text-2xl font-extrabold text-gray-800">{value}</p>
            {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
        </div>
    </motion.div>
);

// Komponen Tautan Cepat
const QuickLinkCard = ({ href, icon, title, description, colorClass }) => (
    <Link href={href} className="block group">
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex items-center">
            <div className={`p-3 rounded-lg mr-4 ${colorClass.bg}`}>
                {React.cloneElement(icon, {
                    className: `h-6 w-6 ${colorClass.text}`,
                })}
            </div>
            <div>
                <h4 className="font-bold text-gray-800 group-hover:text-green-600 transition-colors">
                    {title}
                </h4>
                <p className="text-sm text-gray-500 mt-1">{description}</p>
            </div>
        </div>
    </Link>
);

// Komponen Utama Dashboard
export default function AdminDashboard({ auth, stats, recentActivities }) {
    // Ikon Aktivitas
    const getActivityIcon = (type) => {
        switch (type) {
            case "user_registered":
                return <UserPlus className="w-5 h-5 text-green-500" />;
            case "order_placed":
                return <PlusCircle className="w-5 h-5 text-blue-500" />;
            case "order_approved":
                return <ShieldCheck className="w-5 h-5 text-green-500" />;
            case "user_login":
                return <LogIn className="w-5 h-5 text-gray-400" />;
            default:
                return null;
        }
    };

    return (
        <AdminLayout user={auth.user} header="Dashboard">
            <Head title="Admin Dashboard" />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="py-12"
            >
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* --- Pesan Selamat Datang --- */}
                    <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white overflow-hidden shadow-xl sm:rounded-2xl mb-8 p-8 relative">
                        <div className="relative z-10">
                            <h3 className="text-3xl font-bold">
                                Halo, {auth.user.name}! 👋
                            </h3>
                            <p className="mt-2 opacity-90 text-slate-200">
                                Berikut adalah ringkasan performa bisnis dan
                                status pesanan terkini.
                            </p>
                        </div>
                        {/* Hiasan Background */}
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-5 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-green-500 opacity-10 rounded-full blur-3xl"></div>
                    </div>

                    {/* --- [MODIFIKASI UTAMA] Grid Statistik Baru --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* 1. Total Semua Pesanan */}
                        <StatCard
                            title="Total Pesanan"
                            value={stats.total_orders || 0}
                            subtext="Semua riwayat pesanan"
                            icon={<Package />}
                            colorClass={{
                                bg: "bg-blue-100",
                                text: "text-blue-600",
                            }}
                            delay={0.1}
                        />

                        {/* 2. Total Pendapatan (Revenue) */}
                        <StatCard
                            title="Total Pendapatan"
                            value={formatRupiah(stats.revenue || 0)}
                            subtext="Akumulasi pendapatan sukses"
                            icon={<DollarSign />}
                            colorClass={{
                                bg: "bg-emerald-100",
                                text: "text-emerald-600",
                            }}
                            delay={0.2}
                        />

                        {/* 3. [UBAH] Pesanan Aktif (Menggantikan Armada Siap) */}
                        <StatCard
                            title="Pesanan Aktif"
                            value={stats.active_orders || 0} // Pastikan backend mengirim key ini
                            subtext="Sedang diproses / berjalan"
                            icon={<Activity />}
                            colorClass={{
                                bg: "bg-indigo-100", // Warna Indigo (Ungu Kebiruan)
                                text: "text-indigo-600",
                            }}
                            delay={0.3}
                        />

                        {/* 4. [UBAH] Menunggu Verifikasi (Menggantikan Armada Rusak) */}
                        <StatCard
                            title="Menunggu Verifikasi"
                            value={stats.pending_orders || 0} // Pastikan backend mengirim key ini
                            subtext="Butuh tindakan admin"
                            icon={<AlertCircle />}
                            colorClass={{
                                bg: "bg-amber-100", // Warna Amber (Oranye) untuk Warning/Alert
                                text: "text-amber-600",
                            }}
                            delay={0.4}
                        />
                    </div>

                    {/* --- Tautan Cepat & Aktivitas Terbaru --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Kolom Tautan Cepat */}
                        <div className="lg:col-span-1 space-y-4">
                            <h3 className="text-xl font-bold text-gray-800 px-1 mb-2 flex items-center gap-2">
                                <ShieldCheck
                                    size={20}
                                    className="text-gray-400"
                                />{" "}
                                Akses Cepat
                            </h3>

                            <QuickLinkCard
                                href={route("admin.orders.index")}
                                icon={<ClipboardList />}
                                title="Kelola Pesanan"
                                description="Cek pesanan baru masuk"
                                colorClass={{
                                    bg: "bg-blue-100",
                                    text: "text-blue-600",
                                }}
                            />
                            <QuickLinkCard
                                href={route("admin.verification.index")}
                                icon={<Users />}
                                title="Verifikasi User"
                                description="Validasi KTP pengguna baru"
                                colorClass={{
                                    bg: "bg-orange-100",
                                    text: "text-orange-600",
                                }}
                            />
                        </div>

                        {/* Kolom Aktivitas Terbaru */}
                        <div className="lg:col-span-2 bg-white overflow-hidden shadow-lg sm:rounded-2xl border border-gray-100">
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-800 border-b pb-4 mb-4">
                                    Aktivitas Terbaru
                                </h3>
                                <ul className="space-y-4 text-sm text-gray-700">
                                    {recentActivities.length > 0 ? (
                                        recentActivities.map(
                                            (activity, index) => (
                                                <motion.li
                                                    key={index}
                                                    initial={{
                                                        opacity: 0,
                                                        x: -10,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        x: 0,
                                                    }}
                                                    transition={{
                                                        duration: 0.5,
                                                        delay:
                                                            0.5 + index * 0.1,
                                                    }}
                                                    className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
                                                >
                                                    <div className="flex-shrink-0 mr-3 bg-gray-100 p-2 rounded-full">
                                                        {getActivityIcon(
                                                            activity.type
                                                        )}
                                                    </div>
                                                    <span className="font-medium text-gray-600">
                                                        {activity.description}
                                                    </span>
                                                    <span className="ml-auto text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">
                                                        {activity.time}
                                                    </span>
                                                </motion.li>
                                            )
                                        )
                                    ) : (
                                        <p className="text-gray-400 text-center py-4">
                                            Belum ada aktivitas tercatat.
                                        </p>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AdminLayout>
    );
}
