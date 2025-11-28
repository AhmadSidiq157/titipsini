// resources/js/Pages/Admin/MovingPackages/Index.jsx

import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
// [1] Import Toast & Icons
import { Toaster, toast } from "react-hot-toast";
import { AlertTriangle, Trash2, Edit, Plus } from "lucide-react";

import Modal from "@/Components/Modal"; // Gunakan komponen Modal bawaan
import AddPackageModal from "./Partials/AddPackageModal";
import EditPackageModal from "./Partials/EditPackageModal";

// Helper function untuk format mata uang
const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number);
};

// [2] KOMPONEN MODAL KONFIRMASI MODERN
const ConfirmDeleteModal = ({
    show = false,
    onClose,
    onConfirm,
    title = "Hapus Paket?",
    message = "Tindakan ini tidak dapat dibatalkan. Data paket akan hilang permanen.",
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
                        {processing ? "Menghapus..." : "Ya, Hapus Paket"}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

// [3] Komponen Induk (Index)
export default function Index({ auth, packages, flash }) {
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState(null);
    const [packageToDelete, setPackageToDelete] = useState(null);

    const { delete: deletePackage, processing: isDeleting } = useForm();

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

    // [5] Handle Delete
    const handleDeleteSubmit = () => {
        if (!packageToDelete) return;

        deletePackage(
            route("admin.moving-packages.destroy", packageToDelete.id),
            {
                preserveScroll: true,
                onSuccess: () => {
                    setPackageToDelete(null);
                },
                onError: () => {
                    toast.error("Gagal menghapus paket.");
                    setPackageToDelete(null);
                },
            }
        );
    };

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

            <Toaster />

            <AddPackageModal
                show={isAddModalOpen}
                onClose={() => setAddModalOpen(false)}
            />
            <EditPackageModal
                show={!!editingPackage}
                onClose={() => setEditingPackage(null)}
                aPackage={editingPackage}
            />

            {/* Render Modal Konfirmasi Baru */}
            <ConfirmDeleteModal
                show={!!packageToDelete}
                onClose={() => setPackageToDelete(null)}
                onConfirm={handleDeleteSubmit}
                processing={isDeleting}
                message={`Apakah Anda yakin ingin menghapus paket "${packageToDelete?.name}"?`}
            />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl shadow-gray-200/50 sm:rounded-3xl border border-gray-100">
                        <div className="p-8 text-gray-900">
                            {/* Header Section */}
                            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                                <div>
                                    <h3 className="text-2xl font-black text-gray-800">
                                        Daftar Paket
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Atur harga dan fitur layanan pindahan
                                    </p>
                                </div>
                                <button
                                    onClick={() => setAddModalOpen(true)}
                                    className="inline-flex items-center px-5 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 transform hover:-translate-y-0.5"
                                >
                                    <Plus className="w-5 h-5 mr-2" />
                                    Tambah Paket
                                </button>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto rounded-2xl border border-gray-100">
                                <table className="min-w-full bg-white">
                                    <thead className="bg-gray-50/50">
                                        <tr>
                                            <th className="py-4 px-6 text-left text-xs font-extrabold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                                                Nama Paket
                                            </th>
                                            <th className="py-4 px-6 text-left text-xs font-extrabold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                                                Harga
                                            </th>
                                            <th className="py-4 px-6 text-left text-xs font-extrabold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                                                Deskripsi
                                            </th>
                                            <th className="py-4 px-6 text-left text-xs font-extrabold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                                                Populer
                                            </th>
                                            <th className="py-4 px-6 text-right text-xs font-extrabold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {packages.map((pkg) => (
                                            <tr
                                                key={pkg.id}
                                                className="hover:bg-gray-50/80 transition-colors group"
                                            >
                                                <td className="py-4 px-6 font-bold text-gray-800">
                                                    {pkg.name}
                                                </td>
                                                <td className="py-4 px-6 font-bold text-emerald-600">
                                                    {formatRupiah(pkg.price)}
                                                </td>
                                                <td className="py-4 px-6 text-sm text-gray-500 max-w-xs truncate">
                                                    {pkg.description}
                                                </td>
                                                <td className="py-4 px-6">
                                                    {pkg.popular ? (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                                                            Populer
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                                                            Standar
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() =>
                                                                setEditingPackage(
                                                                    pkg
                                                                )
                                                            }
                                                            className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                setPackageToDelete(
                                                                    pkg
                                                                )
                                                            }
                                                            disabled={
                                                                isDeleting
                                                            }
                                                            className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                                                            title="Hapus"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
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
