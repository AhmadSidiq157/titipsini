import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import AddCurriculumModal from "./Partials/AddCurriculumModal";
import EditCurriculumModal from "./Partials/EditCurriculumModal";

export default function Index({ auth, curricula, flash }) {
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [editingCurriculum, setEditingCurriculum] = useState(null);

    return (
        <AdminLayout user={auth.user} header="Manajemen Kurikulum">
            <Head title="Kurikulum" />

            <AddCurriculumModal
                show={isAddModalOpen}
                onClose={() => setAddModalOpen(false)}
            />
            <EditCurriculumModal
                show={!!editingCurriculum}
                onClose={() => setEditingCurriculum(null)}
                curriculum={editingCurriculum}
            />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flash.success && (
                        <div className="mb-4 bg-green-100 text-green-700 p-4 rounded">
                            {flash.success}
                        </div>
                    )}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold">
                                    Daftar Kurikulum
                                </h3>
                                <button
                                    onClick={() => setAddModalOpen(true)}
                                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                                >
                                    Tambah Kurikulum Baru
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="py-3 px-4 border-b text-left">
                                                Judul
                                            </th>
                                            <th className="py-3 px-4 border-b text-left">
                                                Nama Ikon
                                            </th>
                                            <th className="py-3 px-4 border-b text-left">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {curricula.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="py-3 px-4 border-b font-medium">
                                                    {item.title}
                                                </td>
                                                <td className="py-3 px-4 border-b font-mono text-xs text-purple-700">
                                                    {item.icon_name}
                                                </td>
                                                <td className="py-3 px-4 border-b">
                                                    <button
                                                        onClick={() =>
                                                            setEditingCurriculum(
                                                                item
                                                            )
                                                        }
                                                        className="text-indigo-600 hover:underline font-semibold"
                                                    >
                                                        Edit
                                                    </button>
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
