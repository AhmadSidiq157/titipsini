import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import {
    Users,
    Briefcase,
    UserPlus,
    PlusCircle,
    Settings,
    ClipboardList,
    Package,
    GraduationCap,
    BookOpen,
    ArrowRight,
    LogIn,
} from "lucide-react";
import { motion } from "framer-motion";

// Komponen Kartu Statistik yang Didesain Ulang
const StatCard = ({ icon, title, value, colorClass, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex items-center space-x-4"
    >
        <div className={`p-3 rounded-full ${colorClass.bg}`}>
            {React.cloneElement(icon, {
                className: `h-7 w-7 ${colorClass.text}`,
            })}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                {title}
            </p>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
    </motion.div>
);

// Komponen Tautan Cepat yang Didesain Ulang
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
    const getActivityIcon = (type) => {
        switch (type) {
            case "user_registered":
                return <UserPlus className="w-5 h-5 text-green-500" />;
            case "item_created":
                return <PlusCircle className="w-5 h-5 text-blue-500" />;
            case "item_updated":
                return <Settings className="w-5 h-5 text-yellow-500" />;
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
                    <div className="bg-gradient-to-r from-green-600 to-teal-500 text-white overflow-hidden shadow-xl sm:rounded-2xl mb-8 p-8">
                        <h3 className="text-3xl font-bold">
                            Selamat Datang Kembali, {auth.user.name}!
                        </h3>
                        <p className="mt-2 opacity-90">
                            Berikut adalah ringkasan data terbaru dari platform
                            Titipsini.
                        </p>
                    </div>

                    {/* --- Kartu Statistik --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            title="Total User"
                            value={stats.total_users}
                            icon={<Users />}
                            colorClass={{
                                bg: "bg-blue-100",
                                text: "text-blue-600",
                            }}
                            delay={0.1}
                        />
                        <StatCard
                            title="Lowongan Aktif"
                            value={stats.total_job_vacancies}
                            icon={<Briefcase />}
                            colorClass={{
                                bg: "bg-green-100",
                                text: "text-green-600",
                            }}
                            delay={0.2}
                        />
                        <StatCard
                            title="Posisi Magang"
                            value={stats.total_internship_positions}
                            icon={<GraduationCap />}
                            colorClass={{
                                bg: "bg-yellow-100",
                                text: "text-yellow-600",
                            }}
                            delay={0.3}
                        />
                        <StatCard
                            title="Program Karir"
                            value={stats.total_career_programs}
                            icon={<BookOpen />}
                            colorClass={{
                                bg: "bg-indigo-100",
                                text: "text-indigo-600",
                            }}
                            delay={0.4}
                        />
                    </div>

                    {/* --- Tautan Cepat & Aktivitas Terbaru --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Kolom Tautan Cepat */}
                        <div className="lg:col-span-1 space-y-4">
                            <h3 className="text-xl font-bold text-gray-800 px-1 mb-2">
                                Tautan Cepat
                            </h3>
                            <QuickLinkCard
                                href={route("admin.services.index")}
                                icon={<ClipboardList />}
                                title="Manajemen Layanan"
                                description="Atur layanan umum & paket pindahan"
                                colorClass={{
                                    bg: "bg-cyan-100",
                                    text: "text-cyan-600",
                                }}
                            />
                            <QuickLinkCard
                                href={route("admin.internship-positions.index")}
                                icon={<GraduationCap />}
                                title="Manajemen Internship"
                                description="Atur posisi & proyek magang"
                                colorClass={{
                                    bg: "bg-rose-100",
                                    text: "text-rose-600",
                                }}
                            />
                            <QuickLinkCard
                                href={route("admin.users.index")}
                                icon={<Users />}
                                title="Manajemen User"
                                description="Kelola pengguna & hak akses"
                                colorClass={{
                                    bg: "bg-orange-100",
                                    text: "text-orange-600",
                                }}
                            />
                        </div>

                        {/* Kolom Aktivitas Terbaru */}
                        <div className="lg:col-span-2 bg-white overflow-hidden shadow-lg sm:rounded-2xl">
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-800 border-b pb-4 mb-4">
                                    Aktivitas Terbaru
                                </h3>
                                <ul className="space-y-4 text-sm text-gray-700">
                                    {recentActivities.map((activity, index) => (
                                        <motion.li
                                            key={index}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{
                                                duration: 0.5,
                                                delay: 0.5 + index * 0.1,
                                            }}
                                            className="flex items-center"
                                        >
                                            <div className="flex-shrink-0 mr-3">
                                                {getActivityIcon(activity.type)}
                                            </div>
                                            <span>{activity.description}</span>
                                            <span className="ml-auto text-xs text-gray-400 whitespace-nowrap">
                                                {activity.time}
                                            </span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>{" "}
            {/* <-- INI TAG PENUTUP YANG HILANG */}
        </AdminLayout>
    );
}
