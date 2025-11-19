import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, usePage } from "@inertiajs/react";

// Komponen helper untuk badge status
const StatusBadge = ({ status }) => {
    let bgColor = "bg-gray-200";
    let textColor = "text-gray-800";
    let label = status || "unknown";

    switch (label) {
        case "pending":
            bgColor = "bg-yellow-100";
            textColor = "text-yellow-800";
            break;
        case "approved":
            bgColor = "bg-green-100";
            textColor = "text-green-800";
            break;
        case "rejected":
            bgColor = "bg-red-100";
            textColor = "text-red-800";
            break;
        default:
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

// [BARU] Komponen Pagination
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
    const { flash } = usePage().props;

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
                    {flash.success && (
                        <div className="mb-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-sm">
                            <p>{flash.success}</p>
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">
                                Daftar Pengajuan Verifikasi Kurir
                            </h3>

                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600 uppercase">
                                                Nama Kurir
                                            </th>
                                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600 uppercase">
                                                Kendaraan
                                            </th>
                                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600 uppercase">
                                                Plat Nomor
                                            </th>
                                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600 uppercase">
                                                Status
                                            </th>
                                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600 uppercase">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {verifications.data.map((v) => (
                                            <tr
                                                key={v.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="py-4 px-4">
                                                    <div className="font-medium text-gray-900">
                                                        {v.user.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {v.user.email}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-sm text-gray-700">
                                                    {v.vehicle_brand}{" "}
                                                    {v.vehicle_model}
                                                </td>
                                                <td className="py-4 px-4 text-sm text-gray-700">
                                                    {v.plat_nomor}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <StatusBadge
                                                        status={v.status}
                                                    />
                                                </td>
                                                <td className="py-4 px-4">
                                                    <Link
                                                        href={route(
                                                            "admin.courier_verifications.show",
                                                            v.id
                                                        )}
                                                        className="text-indigo-600 hover:underline font-semibold"
                                                    >
                                                        Tinjau
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                        {verifications.data.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    className="py-8 text-center text-gray-500"
                                                >
                                                    Tidak ada data verifikasi
                                                    baru.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* [BARU] Tampilkan Pagination */}
                            <Pagination links={verifications.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
