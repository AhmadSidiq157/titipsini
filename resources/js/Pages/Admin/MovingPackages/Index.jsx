import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
// [1] Import useForm
import { Head, Link, useForm } from "@inertiajs/react";
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

// [2] KODE MODAL KONFIRMASI (DARI FILE SEBELUMNYA) DIPINDAH KE SINI
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

// [3] Komponen Induk (Index)
export default function Index({ auth, packages, flash }) {
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState(null);

    // [4] State baru untuk modal konfirmasi hapus
    const [packageToDelete, setPackageToDelete] = useState(null);

    // [5] Gunakan useForm untuk method 'delete'
    const { delete: deletePackage, processing: isDeleting } = useForm();

    // [6] Fungsi yang akan dipanggil saat tombol "Ya, Hapus" di modal diklik
    const handleDeleteSubmit = () => {
        if (!packageToDelete) return; // Keamanan

        deletePackage(
            route("admin.moving-packages.destroy", packageToDelete.id),
            {
                preserveScroll: true,
                // Tutup modal setelah sukses
                onSuccess: () => {
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

            <AddPackageModal
                show={isAddModalOpen}
                onClose={() => setAddModalOpen(false)}
            />
            <EditPackageModal
                show={!!editingPackage}
                onClose={() => setEditingPackage(null)}
                aPackage={editingPackage}
            />

            {/* [7] Render Modal Konfirmasi Hapus */}
            <ConfirmDeleteModal
                show={!!packageToDelete}
                onClose={() => setPackageToDelete(null)}
                onConfirm={handleDeleteSubmit}
                processing={isDeleting}
                title="Hapus Paket Pindahan"
                message={`Apakah Anda yakin ingin menghapus paket "${packageToDelete?.name}"?`}
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
                                                Harga
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
                                                <td className="py-3 px-4 border-b font-semibold text-green-600">
                                                    {formatRupiah(pkg.price)}
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

                                                    {/* [8] MODIFIKASI: Ubah <Link> Hapus menjadi <button> */}
                                                    <button
                                                        onClick={() =>
                                                            setPackageToDelete(
                                                                pkg
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
