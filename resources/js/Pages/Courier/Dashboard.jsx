import React from "react";
import CourierLayout from "../../Layouts/CourierLayout"; // Menggunakan path relatif
import { Head, Link, usePage } from "@inertiajs/react";

// [BARU] Import ikon-ikon untuk desain modern
import { User, Calendar, ChevronRight, ClipboardList } from "lucide-react";

// Komponen helper untuk badge status (Tidak Berubah, sudah bagus)
const StatusBadge = ({ status }) => {
    let bgColor = "bg-gray-500";
    let textColor = "text-gray-100";
    let label = status || "unknown";

    switch (label) {
        case "pending":
            bgColor = "bg-yellow-100";
            textColor = "text-yellow-800";
            break;
        case "processing":
            bgColor = "bg-cyan-100";
            textColor = "text-cyan-800";
            break;
        case "ready_for_pickup":
            bgColor = "bg-blue-100";
            textColor = "text-blue-800";
            break;
        case "picked_up":
            bgColor = "bg-indigo-100";
            textColor = "text-indigo-800";
            break;
        case "on_delivery":
            bgColor = "bg-purple-100";
            textColor = "text-purple-800";
            break;
        case "delivered":
        case "completed":
            bgColor = "bg-green-100";
            textColor = "text-green-800";
            break;
        case "cancelled":
            bgColor = "bg-red-100";
            textColor = "text-red-800";
            break;
        default:
            bgColor = "bg-gray-100";
            textColor = "text-gray-800";
            break;
    }

    return (
        <span
            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor} ${textColor}`}
        >
            {label.replace("_", " ").toUpperCase()}
        </span>
    );
};

export default function Dashboard({ auth, tasks }) {
    const { flash } = usePage().props;

    return (
        <CourierLayout
            user={auth.user}
            // [MODIFIKASI] Header diubah jadi teks biasa
            // Ini memperbaiki warning <h2> di dalam <h1>
            header={"Dashboard Tugas Saya"}
        >
            <Head title="Dashboard Kurir" />

            {/* [MODIFIKASI] Latar belakang diubah jadi abu-abu muda */}
            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Notifikasi Flash (Sudah Benar) */}
                    {flash.success && (
                        <div className="mb-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-sm">
                            <p>{flash.success}</p>
                        </div>
                    )}
                    {flash.error && (
                        <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm">
                            <p>{flash.error}</p>
                        </div>
                    )}

                    {/* [MODIFIKASI] Judul Halaman Internal */}
                    <h3 className="text-3xl font-bold text-gray-900 mb-6 px-4 sm:px-0">
                        Tugas Aktif Anda
                    </h3>

                    {/* [MODIFIKASI] Ganti Tabel menjadi Card List */}
                    <div className="space-y-4">
                        {tasks.data.length > 0 ? (
                            tasks.data.map((task) => (
                                // [MODIFIKASI] Setiap tugas adalah card yang bisa diklik
                                <Link
                                    key={task.id}
                                    href={route("courier.tasks.show", task.id)}
                                    className="block group"
                                >
                                    <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 transition-all duration-300 group-hover:shadow-md group-hover:border-green-300">
                                        <div className="p-6 flex items-center justify-between">
                                            {/* Info Tugas */}
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-4">
                                                    <p className="text-lg font-semibold text-gray-900">
                                                        Order #{task.id}
                                                    </p>
                                                    <StatusBadge
                                                        status={task.status}
                                                    />
                                                </div>

                                                <div className="flex items-center gap-6 text-sm">
                                                    <span className="flex items-center text-gray-600">
                                                        <User className="w-4 h-4 mr-2 text-gray-400" />
                                                        {task.user
                                                            ? task.user.name
                                                            : "Klien Dihapus"}
                                                    </span>
                                                    <span className="flex items-center text-gray-500">
                                                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                                        {new Date(
                                                            task.created_at
                                                        ).toLocaleDateString(
                                                            "id-ID"
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Tombol Aksi (Ikon) */}
                                            <div className="text-gray-400 transition-all duration-300 group-hover:text-green-600 group-hover:translate-x-1">
                                                <ChevronRight className="w-6 h-6" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            // [MODIFIKASI] Tampilan "Empty State" yang modern
                            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                                <div className="p-12 text-center">
                                    <ClipboardList className="mx-auto h-12 w-12 text-gray-300" />
                                    <h4 className="mt-4 text-xl font-semibold text-gray-700">
                                        Belum Ada Tugas
                                    </h4>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Saat ada tugas baru yang diberikan,
                                        tugas itu akan muncul di sini.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* TODO: Tambahkan Pagination Links di sini jika perlu */}
                    </div>
                </div>
            </div>
        </CourierLayout>
    );
}
