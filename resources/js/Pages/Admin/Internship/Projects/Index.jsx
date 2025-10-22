import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import AddProjectModal from "./Partials/AddProjectModal";
import EditProjectModal from "./Partials/EditProjectModal";

export default function Index({ auth, projects, flash }) {
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);

    return (
        <AdminLayout user={auth.user} header="Manajemen Proyek Magang">
            <Head title="Proyek Magang" />

            <AddProjectModal
                show={isAddModalOpen}
                onClose={() => setAddModalOpen(false)}
            />
            <EditProjectModal
                show={!!editingProject}
                onClose={() => setEditingProject(null)}
                project={editingProject}
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
                                    Daftar Proyek Magang
                                </h3>
                                <button
                                    onClick={() => setAddModalOpen(true)}
                                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                                >
                                    Tambah Proyek Baru
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="py-3 px-4 border-b text-left">
                                                Judul Proyek
                                            </th>
                                            <th className="py-3 px-4 border-b text-left">
                                                Kategori
                                            </th>
                                            <th className="py-3 px-4 border-b text-left">
                                                Durasi
                                            </th>
                                            <th className="py-3 px-4 border-b text-left">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {projects.map((proj) => (
                                            <tr
                                                key={proj.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="py-3 px-4 border-b font-medium">
                                                    {proj.title}
                                                </td>
                                                <td className="py-3 px-4 border-b">
                                                    {proj.category}
                                                </td>
                                                <td className="py-3 px-4 border-b">
                                                    {proj.duration}
                                                </td>
                                                <td className="py-3 px-4 border-b">
                                                    <button
                                                        onClick={() =>
                                                            setEditingProject(
                                                                proj
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
