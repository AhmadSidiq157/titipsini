// resources/js/Pages/Admin/MovingPackages/Index.jsx

import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import AddPackageModal from "./Partials/AddPackageModal";
import EditPackageModal from "./Partials/EditPackageModal";

export default function Index({ auth, packages, flash }) {
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState(null);

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Manajemen Paket Pindahan
                </h2>
            }
        >
            <Head title="Manajemen Paket Pindahan" />

            <AddPackageModal
                show={isAddModalOpen}
                onClose={() => setAddModalOpen(false)}
            />
            <EditPackageModal
                show={!!editingPackage}
                onClose={() => setEditingPackage(null)}
                aPackage={editingPackage}
            />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flash.success && (
                        <div className="mb-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-sm">
                            <p className="font-bold">Sukses!</p>
                            <p>{flash.success}</p>
                        </div>
                    )}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold">
                                    Daftar Paket Pindahan
                                </h3>
                                <button
                                    onClick={() => setAddModalOpen(true)}
                                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                                >
                                    Tambah Paket Baru
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="py-3 px-4 border-b text-left">
                                                Nama Paket
                                            </th>
                                            <th className="py-3 px-4 border-b text-left">
                                                Deskripsi
                                            </th>
                                            <th className="py-3 px-4 border-b text-left">
                                                Populer
                                            </th>
                                            <th className="py-3 px-4 border-b text-left">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {packages.map((pkg) => (
                                            <tr
                                                key={pkg.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="py-3 px-4 border-b font-medium">
                                                    {pkg.name}
                                                </td>
                                                <td className="py-3 px-4 border-b text-sm text-gray-600">
                                                    {pkg.description}
                                                </td>
                                                <td className="py-3 px-4 border-b">
                                                    {pkg.popular ? (
                                                        <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                                                            Ya
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">
                                                            Tidak
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 border-b">
                                                    <button
                                                        onClick={() =>
                                                            setEditingPackage(
                                                                pkg
                                                            )
                                                        }
                                                        className="text-indigo-600 hover:underline font-semibold mr-4"
                                                    >
                                                        Edit
                                                    </button>
                                                    <Link
                                                        href={route(
                                                            "admin.moving-packages.destroy",
                                                            pkg.id
                                                        )}
                                                        method="delete"
                                                        as="button"
                                                        className="text-red-600 hover:underline font-semibold"
                                                        onBefore={() =>
                                                            confirm(
                                                                "Apakah Anda yakin ingin menghapus paket ini?"
                                                            )
                                                        }
                                                    >
                                                        Hapus
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
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
