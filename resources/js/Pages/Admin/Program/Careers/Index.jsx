import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import AddProgramModal from "./Partials/AddProgramModal";
import EditProgramModal from "./Partials/EditProgramModal";

export default function Index({ auth, programs, flash }) {
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [editingProgram, setEditingProgram] = useState(null);

    return (
        <AdminLayout user={auth.user} header="Manajemen Program Karir">
            <Head title="Program Karir" />

            {/* Render komponen modal (tersembunyi sampai state-nya aktif) */}
            <AddProgramModal
                show={isAddModalOpen}
                onClose={() => setAddModalOpen(false)}
            />
            <EditProgramModal
                show={!!editingProgram}
                onClose={() => setEditingProgram(null)}
                program={editingProgram}
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
                                    Daftar Program Karir
                                </h3>
                                <button
                                    onClick={() => setAddModalOpen(true)}
                                    className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition-colors"
                                >
                                    Tambah Program Baru
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">
                                                Judul
                                            </th>
                                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">
                                                Durasi
                                            </th>
                                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">
                                                Populer
                                            </th>
                                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {programs.map((program) => (
                                            <tr
                                                key={program.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="py-3 px-4 border-b font-medium">
                                                    {program.title}
                                                </td>
                                                <td className="py-3 px-4 border-b">
                                                    {program.duration}
                                                </td>
                                                <td className="py-3 px-4 border-b">
                                                    {program.is_popular ? (
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
                                                            setEditingProgram(
                                                                program
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
