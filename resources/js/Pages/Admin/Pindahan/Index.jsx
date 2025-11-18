import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import ManageOrderModal from "./Partials/ManageOrderModal";
import { Eye, Truck, Check, X, Clock, Package, DollarSign } from "lucide-react";

// Helper function untuk format mata uang
const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number || 0);
};

// Komponen helper untuk badge status
const StatusBadge = ({ status }) => {
    let bgColor = "bg-gray-100 text-gray-800";
    let Icon = Clock;

    switch (status) {
        case "awaiting_payment":
            bgColor = "bg-yellow-100 text-yellow-800";
            Icon = DollarSign;
            break;
        case "awaiting_verification":
            bgColor = "bg-blue-100 text-blue-800";
            Icon = Clock;
            break;
        case "processing": // Pembayaran lunas, siap ditugaskan
            bgColor = "bg-cyan-100 text-cyan-800";
            Icon = Package;
            break;
        case "ready_for_pickup": // Kurir ditugaskan
            bgColor = "bg-indigo-100 text-indigo-800";
            Icon = Truck;
            break;
        case "picked_up":
        case "on_delivery":
            bgColor = "bg-purple-100 text-purple-800";
            Icon = Truck;
            break;
        case "completed":
            bgColor = "bg-green-100 text-green-800";
            Icon = Check;
            break;
        case "cancelled":
        case "rejected":
            bgColor = "bg-red-100 text-red-800";
            Icon = X;
            break;
    }

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor}`}
        >
            <Icon className="w-3 h-3" />
            {/* Mengganti underscore dengan spasi dan membuat huruf besar */}
            {status.replace("_", " ").charAt(0).toUpperCase() +
                status.replace("_", " ").slice(1)}
        </span>
    );
};

// Komponen helper untuk pagination (sama seperti di halaman lain)
const Pagination = ({ links }) => (
    <div className="mt-6 flex justify-between items-center">
        <div className="flex flex-wrap">
            {links.map((link, key) =>
                link.url === null ? (
                    <div
                        key={key}
                        className="mr-1 mb-1 px-4 py-2 text-sm leading-4 text-gray-400 border rounded"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <Link
                        key={key}
                        className={`mr-1 mb-1 px-4 py-2 text-sm leading-4 border rounded hover:bg-white focus:border-indigo-500 focus:text-indigo-500 ${
                            link.active ? "bg-white" : ""
                        }`}
                        href={link.url}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                )
            )}
        </div>
    </div>
);

export default function Index({ auth, orders, couriers, flash }) {
    // State untuk mengontrol modal
    const [selectedOrder, setSelectedOrder] = useState(null);

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Manajemen Pesanan Pindahan
                </h2>
            }
        >
            <Head title="Manajemen Pesanan Pindahan" />

            {/* Render Modal di sini. 
              Modal ini akan kosong sampai 'selectedOrder' diisi.
            */}
            <ManageOrderModal
                show={!!selectedOrder}
                onClose={() => setSelectedOrder(null)}
                order={selectedOrder} // Kirim data order yang dipilih ke modal
                couriers={couriers} // Kirim daftar semua kurir ke modal
            />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Notifikasi Sukses */}
                    {flash.success && (
                        <div className="mb-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-sm">
                            <p>{flash.success}</p>
                        </div>
                    )}
                    {/* Notifikasi Error */}
                    {flash.error && (
                        <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm">
                            <p>{flash.error}</p>
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-2xl font-bold mb-6">
                                Daftar Pesanan Pindahan
                            </h3>

                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="py-3 px-4 border-b text-left">
                                                ID
                                            </th>
                                            <th className="py-3 px-4 border-b text-left">
                                                Klien
                                            </th>
                                            <th className="py-3 px-4 border-b text-left">
                                                Paket
                                            </th>
                                            <th className="py-3 px-4 border-b text-left">
                                                Total
                                            </th>
                                            <th className="py-3 px-4 border-b text-left">
                                                Status
                                            </th>
                                            <th className="py-3 px-4 border-b text-left">
                                                Kurir
                                            </th>
                                            <th className="py-3 px-4 border-b text-left">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.data.length > 0 ? (
                                            orders.data.map((order) => (
                                                <tr
                                                    key={order.id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="py-3 px-4 border-b font-medium">
                                                        #{order.id}
                                                    </td>
                                                    <td className="py-3 px-4 border-b">
                                                        {order.user.name}
                                                    </td>
                                                    <td className="py-3 px-4 border-b text-sm text-gray-700">
                                                        {order.orderable.name}
                                                    </td>
                                                    <td className="py-3 px-4 border-b font-semibold">
                                                        {formatRupiah(
                                                            order.final_amount
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-4 border-b">
                                                        <StatusBadge
                                                            status={
                                                                order.status
                                                            }
                                                        />
                                                    </td>
                                                    <td className="py-3 px-4 border-b text-sm">
                                                        {order.courier ? (
                                                            <span className="font-medium text-indigo-700">
                                                                {
                                                                    order
                                                                        .courier
                                                                        .name
                                                                }
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-500">
                                                                Belum ada
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-4 border-b">
                                                        <button
                                                            onClick={() =>
                                                                setSelectedOrder(
                                                                    order
                                                                )
                                                            } // <-- Set order yang dipilih
                                                            className="text-indigo-600 hover:underline font-semibold inline-flex items-center"
                                                        >
                                                            <Eye className="w-4 h-4 mr-1" />
                                                            Kelola
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="7"
                                                    className="py-6 px-4 border-b text-center text-gray-500"
                                                >
                                                    Belum ada pesanan pindahan.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <Pagination links={orders.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
