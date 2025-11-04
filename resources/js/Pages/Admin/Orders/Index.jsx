import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, usePage } from "@inertiajs/react";

const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number);
};

const getStatusBadge = (status) => {
    switch (status) {
        case "pending":
            return "bg-gray-200 text-gray-800";
        case "awaiting_payment":
            return "bg-yellow-200 text-yellow-800";
        case "awaiting_verification":
            return "bg-blue-200 text-blue-800";
        case "completed":
            return "bg-green-200 text-green-800";
        case "cancelled":
            return "bg-red-200 text-red-800";
        default:
            return "bg-gray-200 text-gray-800";
    }
};

export default function Index({ auth, orders }) {
    const { flash } = usePage().props;

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Manajemen Pesanan
                </h2>
            }
        >
            <Head title="Manajemen Pesanan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
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

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">
                                Daftar Pesanan Masuk
                            </h3>

                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600 uppercase">
                                                ID
                                            </th>
                                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600 uppercase">
                                                User
                                            </th>
                                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600 uppercase">
                                                Layanan
                                            </th>
                                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600 uppercase">
                                                Total
                                            </th>
                                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600 uppercase">
                                                Status
                                            </th>
                                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600 uppercase">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.data.map((order) => (
                                            <tr
                                                key={order.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="py-3 px-4 border-b text-gray-700 font-medium">
                                                    #{order.id}
                                                </td>
                                                <td className="py-3 px-4 border-b text-gray-700">
                                                    {order.user.name}
                                                </td>
                                                <td className="py-3 px-4 border-b text-gray-700">
                                                    {order.orderable.title ||
                                                        order.orderable.name}
                                                </td>
                                                <td className="py-3 px-4 border-b text-gray-700">
                                                    {formatRupiah(
                                                        order.final_amount
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 border-b text-gray-700">
                                                    <span
                                                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                                                            order.status
                                                        )}`}
                                                    >
                                                        {order.status.replace(
                                                            "_",
                                                            " "
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 border-b text-gray-700">
                                                    <Link
                                                        href={route(
                                                            "admin.orders.show",
                                                            order.id
                                                        )}
                                                        className="text-indigo-600 hover:underline font-semibold focus:outline-none"
                                                    >
                                                        Lihat Detail
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* TODO: Tambahkan Pagination Links nanti */}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
