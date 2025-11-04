import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, usePage } from "@inertiajs/react";

const getStatusBadge = (status) => {
    switch (status) {
        case "pending":
            return "bg-yellow-200 text-yellow-800";
        case "approved":
            return "bg-green-200 text-green-800";
        case "rejected":
            return "bg-red-200 text-red-800";
        default:
            return "bg-gray-200 text-gray-800";
    }
};

export default function Index({ auth, verifications, filters }) {
    const { flash } = usePage().props;

    // TODO: Tambahkan filter handler jika diperlukan

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Verifikasi User (KTP)
                </h2>
            }
        >
            <Head title="Verifikasi User" />

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
                                Daftar Pengajuan Verifikasi
                            </h3>

                            {/* TODO: Tambahkan Navigasi Filter (Pending, Approved, Rejected, All) */}

                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600 uppercase">
                                                User
                                            </th>
                                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600 uppercase">
                                                Tipe ID
                                            </th>
                                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600 uppercase">
                                                Status
                                            </th>
                                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600 uppercase">
                                                Tanggal
                                            </th>
                                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600 uppercase">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {verifications.data.map((v) => (
                                            <tr
                                                key={v.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="py-3 px-4 border-b text-gray-700">
                                                    <div className="font-medium">
                                                        {v.user.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {v.user.email}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 border-b text-gray-700">
                                                    {v.id_card_type}
                                                </td>
                                                <td className="py-3 px-4 border-b text-gray-700">
                                                    <span
                                                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                                                            v.status
                                                        )}`}
                                                    >
                                                        {v.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 border-b text-gray-700">
                                                    {new Date(
                                                        v.updated_at
                                                    ).toLocaleDateString(
                                                        "id-ID"
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 border-b text-gray-700">
                                                    <Link
                                                        href={route(
                                                            "admin.verification.show",
                                                            v.id
                                                        )}
                                                        className="text-indigo-600 hover:underline font-semibold focus:outline-none"
                                                    >
                                                        Tinjau
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* TODO: Tambahkan Pagination Links */}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
