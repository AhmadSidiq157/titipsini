import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";

// 1. Import komponen modal yang sudah kita buat
import AddPositionModal from "./Partials/AddPositionModal";
import EditPositionModal from "./Partials/EditPositionModal";

export default function Index({ auth, positions, flash }) {
    // 2. Buat state untuk mengontrol kapan modal muncul
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [editingPosition, setEditingPosition] = useState(null); // Berisi data posisi yg akan diedit

    return (
        <AdminLayout
            user={auth.user}
            // Perbaikan untuk warning: Kirim header sebagai teks biasa, bukan tag <h2>
            header="Manajemen Posisi Magang"
        >
            <Head title="Posisi Magang" />

            {/* 3. Render komponen modal di sini. Mereka akan muncul saat state-nya aktif */}
            <AddPositionModal
                show={isAddModalOpen}
                onClose={() => setAddModalOpen(false)}
            />
            <EditPositionModal
                show={!!editingPosition}
                onClose={() => setEditingPosition(null)}
                position={editingPosition}
            />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flash.success && (
                        <div className="mb-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md">
                            {flash.success}
                        </div>
                    )}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold">
                                    Daftar Posisi Magang
                                </h3>
                                {/* 4. Ganti Link dengan button yang mengubah state */}
                                <button
                                    onClick={() => setAddModalOpen(true)}
                                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                                >
                                    Tambah Posisi Baru
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
                                                Kategori
                                            </th>
                                            <th className="py-3 px-4 border-b text-left">
                                                Lokasi
                                            </th>
                                            <th className="py-3 px-4 border-b text-left">
                                                Deadline
                                            </th>
                                            <th className="py-3 px-4 border-b text-left">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {positions.map((pos) => (
                                            <tr
                                                key={pos.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="py-3 px-4 border-b font-medium">
                                                    {pos.title}
                                                </td>
                                                <td className="py-3 px-4 border-b">
                                                    {pos.category}
                                                </td>
                                                <td className="py-3 px-4 border-b">
                                                    {pos.location}
                                                </td>
                                                <td className="py-3 px-4 border-b">
                                                    {new Date(
                                                        pos.deadline
                                                    ).toLocaleDateString(
                                                        "id-ID",
                                                        {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        }
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 border-b">
                                                    {/* 5. Ganti Link dengan button yang mengubah state */}
                                                    <button
                                                        onClick={() =>
                                                            setEditingPosition(
                                                                pos
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
