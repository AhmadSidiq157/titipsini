import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { PlusCircle, Edit, Trash2 } from "lucide-react";

export default function Index({ auth, branches }) {
    const { flash } = usePage().props;

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Manajemen Cabang
                </h2>
            }
        >
            <Head title="Manajemen Cabang" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-gray-700">
                                    Daftar Cabang
                                </h2>
                                <Link
                                    href={route("admin.branches.create")}
                                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-semibold text-sm rounded-md hover:bg-green-700 transition"
                                >
                                    <PlusCircle className="w-4 h-4 mr-2" />
                                    Tambah Cabang
                                </Link>
                            </div>

                            {/* Flash message */}
                            {flash && flash.success && (
                                <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-md">
                                    {flash.success}
                                </div>
                            )}

                            {/* Tabel Data */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Nama
                                            </th>
                                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Alamat
                                            </th>
                                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {branches.map((branch) => (
                                            <tr
                                                key={branch.id}
                                                className="hover:bg-gray-50"
                                            >
                                                {/* Nama */}
                                                <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {branch.name}
                                                </td>

                                                {/* Alamat */}
                                                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-600">
                                                    {branch.address}
                                                </td>

                                                {/* Status */}
                                                <td className="py-4 px-6 whitespace-nowrap text-sm">
                                                    {branch.status ===
                                                    "Buka" ? (
                                                        <span className="px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                                                            Buka
                                                        </span>
                                                    ) : (
                                                        <span className="px-3 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">
                                                            Segera Hadir
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Tombol Aksi */}
                                                <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-right">
                                                    <Link
                                                        href={route(
                                                            "admin.branches.edit",
                                                            branch.id
                                                        )}
                                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                    >
                                                        <Edit className="w-5 h-5 inline" />
                                                    </Link>

                                                    <Link
                                                        href={route(
                                                            "admin.branches.destroy",
                                                            branch.id
                                                        )}
                                                        method="delete"
                                                        as="button"
                                                        onBefore={() =>
                                                            confirm(
                                                                "Apakah Anda yakin ingin menghapus cabang ini?"
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <Trash2 className="w-5 h-5 inline" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}

                                        {branches.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan="4"
                                                    className="py-8 px-6 text-center text-gray-500"
                                                >
                                                    Belum ada data cabang.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
