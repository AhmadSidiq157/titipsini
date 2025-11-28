import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
// [1] Import Toast Library
import { Toaster, toast } from "react-hot-toast";

import AddServiceModal from "./Partials/AddServiceModal";
import EditServiceModal from "./Partials/EditServiceModal";

// Helper format Rupiah
const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number);
};

// KODE MODAL KONFIRMASI (LOCAL COMPONENT)
const ConfirmDeleteModal = ({
    show = false,
    onClose,
    onConfirm,
    title = "Konfirmasi Hapus",
    message = "Apakah Anda yakin ingin menghapus data ini?",
    processing = false,
}) => {
    if (!show) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 transform transition-all scale-100"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={processing}
                    >
                        &times;
                    </button>
                </div>
                <div className="py-6 text-center">
                    <p className="text-gray-600">{message}</p>
                </div>
                <div className="flex justify-center gap-3 pt-2">
                    <button
                        onClick={onClose}
                        disabled={processing}
                        className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={processing}
                        className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 shadow-lg shadow-red-200 transition-all disabled:opacity-50"
                    >
                        {processing ? "Menghapus..." : "Ya, Hapus"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function Index({ auth, services, flash }) {
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [serviceToDelete, setServiceToDelete] = useState(null);

    const { delete: deleteService, processing: isDeleting } = useForm();

    // [2] Effect untuk memunculkan Toast saat ada flash message sukses
    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success, {
                duration: 4000,
                position: "top-center",
                style: {
                    borderRadius: "12px",
                    background: "#333",
                    color: "#fff",
                },
            });
        }
        if (flash.error) {
            toast.error(flash.error, {
                position: "top-center",
            });
        }
    }, [flash]);

    const handleDeleteSubmit = () => {
        if (!serviceToDelete) return;

        deleteService(route("admin.services.destroy", serviceToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                setServiceToDelete(null);
                // Toast akan otomatis muncul karena flash.success di-update oleh server
            },
            onError: () => {
                toast.error("Gagal menghapus layanan.");
            },
        });
    };

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

            {/* [3] Komponen Toaster Wajib Ada */}
            <Toaster />

            <AddServiceModal
                show={isAddModalOpen}
                onClose={() => setAddModalOpen(false)}
            />
            <EditServiceModal
                show={!!editingService}
                onClose={() => setEditingService(null)}
                service={editingService}
            />

            <ConfirmDeleteModal
                show={!!serviceToDelete}
                onClose={() => setServiceToDelete(null)}
                onConfirm={handleDeleteSubmit}
                processing={isDeleting}
                title="Hapus Layanan"
                message={`Apakah Anda yakin ingin menghapus layanan "${serviceToDelete?.title}"?`}
            />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* [4] Alert Box Lama DIHAPUS, digantikan oleh Toast */}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-3xl border border-gray-100">
                        <div className="p-8 text-gray-900">
                            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                                <div>
                                    <h3 className="text-2xl font-black text-gray-800">
                                        Daftar Layanan
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Kelola paket dan harga layanan titip
                                    </p>
                                </div>
                                <button
                                    onClick={() => setAddModalOpen(true)}
                                    className="px-5 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 transition-all shadow-lg shadow-emerald-200 transform hover:-translate-y-0.5"
                                >
                                    + Tambah Layanan
                                </button>
                            </div>

                            <div className="overflow-x-auto rounded-xl border border-gray-100">
                                <table className="min-w-full bg-white">
                                    <thead className="bg-gray-50/50">
                                        <tr>
                                            <th className="py-4 px-6 border-b border-gray-100 text-left text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                                                #
                                            </th>
                                            <th className="py-4 px-6 border-b border-gray-100 text-left text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                                                Judul
                                            </th>
                                            <th className="py-4 px-6 border-b border-gray-100 text-left text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                                                Harga
                                            </th>
                                            <th className="py-4 px-6 border-b border-gray-100 text-left text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                                                Fitur
                                            </th>
                                            <th className="py-4 px-6 border-b border-gray-100 text-right text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {services.map((service, index) => (
                                            <tr
                                                key={service.id}
                                                className="hover:bg-gray-50/80 transition-colors"
                                            >
                                                <td className="py-4 px-6 text-gray-500 font-mono text-sm">
                                                    {index + 1}
                                                </td>
                                                <td className="py-4 px-6 text-gray-800 font-bold text-sm">
                                                    {service.title}
                                                </td>
                                                <td className="py-4 px-6 text-emerald-600 font-bold text-sm">
                                                    {formatRupiah(
                                                        service.price
                                                    )}
                                                </td>
                                                <td className="py-4 px-6 text-gray-600 text-sm">
                                                    <ul className="space-y-1">
                                                        {service.features.map(
                                                            (feature, i) => (
                                                                <li
                                                                    key={i}
                                                                    className="flex items-center gap-2"
                                                                >
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                                                    {feature}
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </td>
                                                <td className="py-4 px-6 text-right space-x-2">
                                                    <button
                                                        onClick={() =>
                                                            setEditingService(
                                                                service
                                                            )
                                                        }
                                                        className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            setServiceToDelete(
                                                                service
                                                            )
                                                        }
                                                        disabled={isDeleting}
                                                        className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors disabled:opacity-50"
                                                    >
                                                        Hapus
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
