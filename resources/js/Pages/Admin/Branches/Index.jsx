// resources/js/Pages/Admin/Branches/Index.jsx

import React, { useState, useEffect } from "react";
import { Head, Link, usePage, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
// [1] Import Toast & Icons
import { Toaster, toast } from "react-hot-toast";
import { PlusCircle, Edit, Trash2, MapPin, AlertTriangle } from "lucide-react";
import Modal from "@/Components/Modal"; // Gunakan komponen Modal bawaan

// [2] KOMPONEN MODAL KONFIRMASI MODERN
const ConfirmDeleteModal = ({
    show = false,
    onClose,
    onConfirm,
    title = "Hapus Cabang?",
    message = "Apakah Anda yakin ingin menghapus data cabang ini? Tindakan ini tidak dapat dibatalkan.",
    processing = false,
}) => {
    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-6">
                <div className="flex items-center gap-4 mb-5">
                    <div className="p-3 bg-red-100 rounded-full text-red-600">
                        <AlertTriangle size={28} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-8">
                    {message}
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={processing}
                        className="px-5 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={processing}
                        className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 shadow-lg shadow-red-200 transition-all disabled:opacity-70 flex items-center"
                    >
                        {processing ? "Menghapus..." : "Ya, Hapus Cabang"}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

// [3] Komponen Utama
export default function Index({ auth, branches }) {
    const { flash } = usePage().props;

    // State untuk Modal Hapus
    const [branchToDelete, setBranchToDelete] = useState(null);
    const { delete: destroy, processing } = useForm();

    // [4] Effect untuk Toast Notifikasi
    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success, {
                duration: 4000,
                position: "top-center",
                style: {
                    background: "#10B981",
                    color: "#fff",
                    borderRadius: "12px",
                    fontWeight: "bold",
                },
                iconTheme: {
                    primary: "#fff",
                    secondary: "#10B981",
                },
            });
        }
        if (flash.error) {
            toast.error(flash.error, {
                duration: 4000,
                position: "top-center",
            });
        }
    }, [flash]);

    // [5] Handle Delete Logic
    const handleDeleteSubmit = () => {
        if (!branchToDelete) return;

        destroy(route("admin.branches.destroy", branchToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                setBranchToDelete(null);
            },
            onError: () => {
                toast.error("Gagal menghapus cabang.");
                setBranchToDelete(null);
            },
        });
    };

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

            {/* Render Toaster */}
            <Toaster />

            {/* Render Modal Konfirmasi */}
            <ConfirmDeleteModal
                show={!!branchToDelete}
                onClose={() => setBranchToDelete(null)}
                onConfirm={handleDeleteSubmit}
                processing={processing}
                message={`Apakah Anda yakin ingin menghapus cabang "${branchToDelete?.name}"?`}
            />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl shadow-gray-200/50 sm:rounded-3xl border border-gray-100">
                        <div className="p-8">
                            {/* Header Section */}
                            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-800">
                                        Daftar Cabang
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Kelola lokasi operasional TitipSini
                                    </p>
                                </div>
                                <Link
                                    href={route("admin.branches.create")}
                                    className="inline-flex items-center px-5 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 transform hover:-translate-y-0.5"
                                >
                                    <PlusCircle className="w-5 h-5 mr-2" />
                                    Tambah Cabang
                                </Link>
                            </div>

                            {/* Flash message lama dihapus, digantikan Toast */}

                            {/* Tabel Data */}
                            <div className="overflow-x-auto rounded-2xl border border-gray-100">
                                <table className="min-w-full bg-white">
                                    <thead className="bg-gray-50/50">
                                        <tr>
                                            <th className="py-4 px-6 text-left text-xs font-extrabold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                                                Nama
                                            </th>
                                            <th className="py-4 px-6 text-left text-xs font-extrabold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                                                Alamat
                                            </th>
                                            <th className="py-4 px-6 text-left text-xs font-extrabold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                                                Status
                                            </th>
                                            <th className="py-4 px-6 text-right text-xs font-extrabold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {branches.map((branch) => (
                                            <tr
                                                key={branch.id}
                                                className="hover:bg-gray-50/80 transition-colors group"
                                            >
                                                {/* Nama */}
                                                <td className="py-4 px-6 whitespace-nowrap">
                                                    <div className="font-bold text-gray-800 text-sm">
                                                        {branch.name}
                                                    </div>
                                                </td>

                                                {/* Alamat */}
                                                <td className="py-4 px-6">
                                                    <div className="flex items-start gap-2 max-w-xs">
                                                        <MapPin
                                                            size={16}
                                                            className="text-gray-400 flex-shrink-0 mt-0.5"
                                                        />
                                                        <span className="text-sm text-gray-600 truncate">
                                                            {branch.address}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Status */}
                                                <td className="py-4 px-6 whitespace-nowrap">
                                                    {branch.status ===
                                                    "Buka" ? (
                                                        <span className="px-3 py-1 text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-full">
                                                            Buka
                                                        </span>
                                                    ) : (
                                                        <span className="px-3 py-1 text-xs font-bold text-amber-700 bg-amber-100 border border-amber-200 rounded-full">
                                                            Segera Hadir
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Tombol Aksi */}
                                                <td className="py-4 px-6 whitespace-nowrap text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={route(
                                                                "admin.branches.edit",
                                                                branch.id
                                                            )}
                                                            className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit size={18} />
                                                        </Link>

                                                        {/* Tombol Hapus Custom */}
                                                        <button
                                                            onClick={() =>
                                                                setBranchToDelete(
                                                                    branch
                                                                )
                                                            }
                                                            className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                            title="Hapus"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}

                                        {branches.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan="4"
                                                    className="py-12 text-center text-gray-400 italic"
                                                >
                                                    Belum ada data cabang yang
                                                    tersedia.
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
