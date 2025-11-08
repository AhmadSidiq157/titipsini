import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { Check, X, Clock, Eye, ChevronLeft, ChevronRight } from "lucide-react";

// Komponen helper untuk badge status
const StatusBadge = ({ status }) => {
    let bgColor = "bg-gray-100";
    let textColor = "text-gray-800";
    let Icon = Clock;

    switch (status) {
        case "pending":
            bgColor = "bg-yellow-100 text-yellow-800";
            Icon = Clock;
            break;
        case "approved":
            bgColor = "bg-green-100 text-green-800";
            Icon = Check;
            break;
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
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

// Komponen helper untuk pagination
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

export default function Index({ auth, verifications }) {
    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Verifikasi Kurir
                </h2>
            }
        >
            <Head title="Verifikasi Kurir" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Daftar Pengajuan Verifikasi Kurir
                            </h3>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Kurir
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Plat Nomor
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Status
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Tanggal Pengajuan
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
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {verifications.data.length > 0 ? (
                                            verifications.data.map(
                                                (verification) => (
                                                    <tr key={verification.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {verification.user
                                                                ? verification
                                                                      .user.name
                                                                : "User Dihapus"}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {
                                                                verification.plat_nomor
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            <StatusBadge
                                                                status={
                                                                    verification.status
                                                                }
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(
                                                                verification.created_at
                                                            ).toLocaleDateString(
                                                                "id-ID"
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <Link
                                                                href={route(
                                                                    "admin.courier_verifications.show",
                                                                    verification.id
                                                                )}
                                                                className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                                                            >
                                                                <Eye className="w-4 h-4 mr-1" />
                                                                Lihat Detail
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                )
                                            )
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    className="px-6 py-4 text-center text-gray-500"
                                                >
                                                    Tidak ada data pengajuan
                                                    verifikasi.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <Pagination links={verifications.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
