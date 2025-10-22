import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";

// Import modal-modal yang diperlukan
import AddServiceModal from "./Partials/AddServiceModal";
import EditServiceModal from "./Partials/EditServiceModal";

export default function Index({ auth, services, flash }) {
    // State untuk mengontrol modal mana yang sedang aktif
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null); // Akan berisi objek service jika modal edit terbuka

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Manajemen Layanan
                </h2>
            }
        >
            <Head title="Manajemen Layanan" />

            {/* Merender komponen modal (tidak akan terlihat sampai state-nya true) */}
            <AddServiceModal
                show={isAddModalOpen}
                onClose={() => setAddModalOpen(false)}
            />

            <EditServiceModal
                show={!!editingService} // Konversi objek ke boolean: true jika ada service, false jika null
                onClose={() => setEditingService(null)}
                service={editingService}
            />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Menampilkan notifikasi sukses (flash message) dari controller */}
                    {flash.success && (
                        <div className="mb-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-sm">
                            <p className="font-bold">Sukses!</p>
                            <p>{flash.success}</p>
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-800">
                                    Daftar Layanan
                                </h3>
                                {/* Tombol untuk membuka modal tambah */}
                                <button
                                    onClick={() => setAddModalOpen(true)}
                                    className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all"
                                >
                                    Tambah Layanan Baru
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600 uppercase">
                                                #
                                            </th>
                                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600 uppercase">
                                                Judul
                                            </th>
                                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600 uppercase">
                                                Fitur
                                            </th>
                                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600 uppercase">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {services.map((service, index) => (
                                            <tr
                                                key={service.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="py-3 px-4 border-b text-gray-700">
                                                    {index + 1}
                                                </td>
                                                <td className="py-3 px-4 border-b text-gray-700 font-medium">
                                                    {service.title}
                                                </td>
                                                <td className="py-3 px-4 border-b text-gray-700">
                                                    <ul className="list-disc list-inside space-y-1">
                                                        {service.features.map(
                                                            (feature, i) => (
                                                                <li key={i}>
                                                                    {feature}
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </td>
                                                <td className="py-3 px-4 border-b text-gray-700">
                                                    {/* Tombol untuk membuka modal edit */}
                                                    <button
                                                        onClick={() =>
                                                            setEditingService(
                                                                service
                                                            )
                                                        }
                                                        className="text-indigo-600 hover:underline font-semibold mr-4 focus:outline-none"
                                                    >
                                                        Edit
                                                    </button>
                                                    <Link
                                                        href={route(
                                                            "admin.services.destroy",
                                                            service.id
                                                        )}
                                                        method="delete"
                                                        as="button"
                                                        className="text-red-600 hover:underline font-semibold focus:outline-none"
                                                        onBefore={() =>
                                                            confirm(
                                                                "Apakah Anda yakin ingin menghapus layanan ini?"
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
