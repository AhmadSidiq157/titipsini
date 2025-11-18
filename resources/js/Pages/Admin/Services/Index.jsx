import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
// [1] Import useForm
import { Head, Link, useForm } from "@inertiajs/react";

// Import modal-modal yang diperlukan
import AddServiceModal from "./Partials/AddServiceModal";
import EditServiceModal from "./Partials/EditServiceModal";
// [2] Import ConfirmDeleteModal SUDAH DIHAPUS

// Helper format Rupiah (sudah benar)
const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number);
};

// [3] KODE MODAL KONFIRMASI (YANG TADI FILE BARU) DIPINDAH KE SINI
const ConfirmDeleteModal = ({
    show = false,
    onClose,
    onConfirm,
    title = "Konfirmasi Hapus",
    message = "Apakah Anda yakin ingin menghapus data ini?",
    processing = false,
}) => {
    // Jangan tampilkan apapun jika 'show' adalah false
    if (!show) {
        return null;
    }

    return (
        // Latar belakang overlay
        <div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50"
            onClick={onClose} // Menutup modal jika klik di luar
        >
            {/* Panel Modal */}
            <div
                className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
                onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup saat klik di dalam
            >
                {/* Header Modal */}
                <div className="flex justify-between items-center pb-3 border-b">
                    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                        disabled={processing}
                    >
                        &times;
                    </button>
                </div>

                {/* Body Modal */}
                <div className="py-4">
                    <p className="text-sm text-gray-600">{message}</p>
                </div>

                {/* Footer Modal (Tombol Aksi) */}
                <div className="flex justify-end space-x-3 pt-3 border-t">
                    <button
                        onClick={onClose}
                        disabled={processing}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-semibold text-sm hover:bg-gray-300 disabled:opacity-50"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={processing}
                        className="px-4 py-2 bg-red-600 text-white rounded-md font-semibold text-sm hover:bg-red-700 disabled:opacity-50"
                    >
                        {processing ? "Menghapus..." : "Ya, Hapus"}
                    </button>
                </div>
            </div>
        </div>
    );
};
// [AKHIR DARI KODE MODAL]

// [4] Komponen Induk (Index)
export default function Index({ auth, services, flash }) {
    // State untuk modal (sudah benar)
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);

    // State baru untuk modal konfirmasi hapus
    const [serviceToDelete, setServiceToDelete] = useState(null);

    // Gunakan useForm untuk method 'delete'
    const { delete: deleteService, processing: isDeleting } = useForm();

    // Fungsi yang akan dipanggil saat tombol "Ya, Hapus" di modal diklik
    const handleDeleteSubmit = () => {
        if (!serviceToDelete) return; // Keamanan

        deleteService(route("admin.services.destroy", serviceToDelete.id), {
            preserveScroll: true,
            // Tutup modal setelah sukses
            onSuccess: () => {
                setServiceToDelete(null);
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

            {/* Modal Tambah & Edit (sudah benar) */}
            <AddServiceModal
                show={isAddModalOpen}
                onClose={() => setAddModalOpen(false)}
            />
            <EditServiceModal
                show={!!editingService}
                onClose={() => setEditingService(null)}
                service={editingService}
            />

            {/* [5] Render Modal Konfirmasi Hapus (Sekarang memanggil const di file ini) */}
            <ConfirmDeleteModal
                show={!!serviceToDelete} // Tampilkan jika serviceToDelete tidak null
                onClose={() => setServiceToDelete(null)}
                onConfirm={handleDeleteSubmit}
                processing={isDeleting}
                title="Hapus Layanan"
                message={`Apakah Anda yakin ingin menghapus layanan "${serviceToDelete?.title}"?`}
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
                                <h3 className="text-2xl font-bold text-gray-800">
                                    Daftar Layanan
                                </h3>
                                <button
                                    onClick={() => setAddModalOpen(true)}
                                    className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all"
                                >
                                    Tambah Layanan Baru
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white">
                                    {/* ... thead (sudah benar) ... */}
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600 uppercase">
                                                #
                                            </th>
                                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600 uppercase">
                                                Judul
                                            </th>
                                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600 uppercase">
                                                Harga
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
                                                {/* ... td (kolom lain sudah benar) ... */}
                                                <td className="py-3 px-4 border-b text-gray-700">
                                                    {index + 1}
                                                </td>
                                                <td className="py-3 px-4 border-b text-gray-700 font-medium">
                                                    {service.title}
                                                </td>
                                                <td className="py-3 px-4 border-b text-gray-700 font-semibold text-green-700">
                                                    {formatRupiah(
                                                        service.price
                                                    )}
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

                                                    {/* [6] Tombol Hapus (sudah benar) */}
                                                    <button
                                                        onClick={() =>
                                                            setServiceToDelete(
                                                                service
                                                            )
                                                        }
                                                        disabled={isDeleting}
                                                        className="text-red-600 hover:underline font-semibold focus:outline-none disabled:opacity-50"
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
