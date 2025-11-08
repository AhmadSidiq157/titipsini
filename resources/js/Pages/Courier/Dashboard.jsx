import React from "react";
import CourierLayout from "../../Layouts/CourierLayout"; // Menggunakan path relatif
import { Head, Link } from "@inertiajs/react";

// Komponen helper untuk badge status
const StatusBadge = ({ status }) => {
    let bgColor = "bg-gray-500";
    let textColor = "text-gray-100";
    let label = status || "unknown"; // Default jika status null

    switch (label) {
        case "pending":
            bgColor = "bg-yellow-100";
            textColor = "text-yellow-800";
            break;
        case "processing":
            bgColor = "bg-cyan-100";
            textColor = "text-cyan-800";
            break;
        case "ready_for_pickup": // Status baru
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
            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor} ${textColor}`}
        >
            {label.replace("_", " ").toUpperCase()}
        </span>
    );
};

export default function Dashboard({ auth, tasks }) {
    return (
        <CourierLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Dashboard Tugas Saya
                </h2>
            }
        >
            <Head title="Dashboard Kurir" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/* Daftar Tugas */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                            >
                                                Order ID
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                            >
                                                Klien
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                            >
                                                Status
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                            >
                                                Tgl. Order
                                            </th>
                                            <th
                                                scope="col"
                                                className="relative px-6 py-3"
                                            >
                                                <span className="sr-only">
                                                    Aksi
                                                </span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {tasks.data.length > 0 ? (
                                            tasks.data.map((task) => (
                                                <tr key={task.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        #{task.id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {/* [PERBAIKAN] Menggunakan task.user.name */}
                                                        {task.user
                                                            ? task.user.name
                                                            : "Klien Dihapus"}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <StatusBadge
                                                            status={task.status}
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {new Date(
                                                            task.created_at
                                                        ).toLocaleDateString(
                                                            "id-ID"
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <Link
                                                            href={route(
                                                                "courier.tasks.show",
                                                                task.id
                                                            )}
                                                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                                                        >
                                                            Lihat Detail
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                                                >
                                                    Belum ada tugas yang
                                                    diberikan.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* TODO: Tambahkan Pagination Links di sini jika perlu */}
                        </div>
                    </div>
                </div>
            </div>
        </CourierLayout>
    );
}
