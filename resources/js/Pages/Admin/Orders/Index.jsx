import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, usePage } from "@inertiajs/react";

// --- Helper: Format Rupiah ---
const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number);
};

// --- Helper: Status Badge ---
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

// --- [MODIFIKASI] Komponen Pagination (Selalu Tampil & Gaya Kotak Terpisah) ---
const Pagination = ({ links }) => {
    // [CATATAN] Baris pengecekan 'links.length <= 3' SUDAH DIHAPUS.
    // Jadi tombol akan selalu muncul.

    return (
        <div className="flex flex-wrap items-center gap-2 mt-6">
            {links.map((link, index) => {
                // Bersihkan label panah bawaan Laravel agar rapi
                let label = link.label
                    .replace("&laquo; Previous", "« Previous")
                    .replace("Next &raquo;", "Next »");

                // Style dasar: Kotak putih dengan border, text-sm, rounded
                const baseClasses =
                    "px-4 py-2 text-sm font-medium border rounded-md transition-colors shadow-sm";

                // KONDISI 1: Link Disabled (Previous/Next mati saat di ujung)
                if (link.url === null) {
                    return (
                        <span
                            key={index}
                            className={`${baseClasses} bg-white text-gray-300 border-gray-200 cursor-not-allowed`}
                            dangerouslySetInnerHTML={{ __html: label }}
                        />
                    );
                }

                // KONDISI 2: Link Aktif & Link Biasa
                return (
                    <Link
                        key={index}
                        href={link.url}
                        className={`${baseClasses} ${
                            link.active
                                ? "bg-indigo-50 text-indigo-600 border-indigo-600 z-10" // Style saat Aktif (Halaman yang sedang dibuka)
                                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-gray-800" // Style Biasa
                        }`}
                        dangerouslySetInnerHTML={{ __html: label }}
                    />
                );
            })}
        </div>
    );
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
                    {/* Flash Messages */}
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
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-800">
                                    Daftar Pesanan Masuk
                                </h3>
                            </div>

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
                                        {orders.data.length > 0 ? (
                                            orders.data.map((order) => (
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
                                                        {order.orderable
                                                            .title ||
                                                            order.orderable
                                                                .name}
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
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="6"
                                                    className="py-8 text-center text-gray-500"
                                                >
                                                    Belum ada pesanan.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* [MODIFIKASI] Tombol Paginasi akan selalu muncul di sini */}
                            <div className="mt-4">
                                <Pagination links={orders.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
