import AdminLayout from "@/Layouts/AdminLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import DangerButton from "@/Components/DangerButton";
import SecondaryButton from "@/Components/SecondaryButton";
import Modal from "@/Components/Modal";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";

// Helper function untuk styling badge status
const getStatusBadge = (status) => {
    switch (status) {
        case "pending":
            return "bg-yellow-100 text-yellow-800";
        case "approved":
            return "bg-green-100 text-green-800";
        case "in_storage":
            return "bg-blue-100 text-blue-800";
        case "completed":
            return "bg-gray-100 text-gray-800";
        case "rejected":
            return "bg-red-100 text-red-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

export default function Show({ auth, order }) {
    // 'order' adalah prop yang dikirim dari controller
    // Pastikan controller mengirim 'order' dengan relasi 'user' dan 'service'

    // State untuk modal "Tolak Pesanan"
    const [confirmingReject, setConfirmingReject] = useState(false);

    // Form hook untuk "Approve"
    const { patch: approveOrder, processing: approving } = useForm({});

    // Form hook untuk "Reject" (dengan alasan)
    const {
        data,
        setData,
        patch: rejectOrder,
        processing: rejecting,
        errors,
    } = useForm({
        rejection_reason: "",
    });

    const submitApprove = (e) => {
        e.preventDefault();
        // Nanti kita perlu buat route ini di 'routes/web.php'
        approveOrder(route("admin.orders.approve", order.id), {
            preserveScroll: true,
        });
    };

    const submitReject = (e) => {
        e.preventDefault();
        // Nanti kita perlu buat route ini di 'routes/web.php'
        rejectOrder(route("admin.orders.reject", order.id), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
        });
    };

    const closeModal = () => {
        setConfirmingReject(false);
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title={`Detail Pesanan #${order.id}`} />

            {/* Header Halaman */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Review Pesanan #{order.id}
                    </h2>
                    <Link
                        href={route("admin.orders.index")} // Asumsi nama route-nya ini
                        className="text-sm text-indigo-600 hover:text-indigo-900"
                    >
                        &larr; Kembali ke Daftar Pesanan
                    </Link>
                </div>
            </header>

            {/* Konten Utama */}
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 md:p-8 text-gray-900 grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* === KOLOM KIRI (DETAIL) === */}
                            <div className="md:col-span-2 space-y-6">
                                {/* 1. Detail Barang */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-3">
                                        Detail Barang
                                    </h3>
                                    <dl className="divide-y divide-gray-100">
                                        <DetailItem title="Status Pesanan">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                                                    order.status
                                                )}`}
                                            >
                                                {order.status}
                                            </span>
                                            {/* Tampilkan alasan penolakan jika ada */}
                                            {order.status === "rejected" &&
                                                order.rejection_reason && (
                                                    <p className="text-xs text-red-600 mt-1">
                                                        {order.rejection_reason}
                                                    </p>
                                                )}
                                        </DetailItem>
                                        <DetailItem
                                            title="Nama Barang"
                                            data={order.item_name}
                                        />
                                        <DetailItem
                                            title="Deskripsi"
                                            data={order.item_description}
                                            isPreWrap={true}
                                        />
                                        <DetailItem
                                            title="Kuantitas"
                                            data={`${order.item_quantity} unit`}
                                        />
                                        <DetailItem
                                            title="Ukuran"
                                            data={order.size_category}
                                            isCapitalize={true}
                                        />
                                        <DetailItem
                                            title="Tgl. Pesan"
                                            data={new Date(
                                                order.created_at
                                            ).toLocaleString("id-ID")}
                                        />
                                    </dl>
                                </div>

                                {/* 2. Detail Pemesan */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-3">
                                        Detail Pemesan
                                    </h3>
                                    <dl className="divide-y divide-gray-100">
                                        <DetailItem
                                            title="Nama"
                                            data={order.user.name}
                                        />
                                        <DetailItem
                                            title="Email"
                                            data={order.user.email}
                                        />
                                        <DetailItem
                                            title="Alamat"
                                            data={
                                                order.user.address ||
                                                "Belum diisi"
                                            }
                                        />
                                    </dl>
                                </div>

                                {/* 3. Detail Layanan */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-3">
                                        Layanan Dipesan
                                    </h3>
                                    <dl className="divide-y divide-gray-100">
                                        <DetailItem
                                            title="Nama Layanan"
                                            data={order.service.name}
                                        />
                                    </dl>
                                </div>
                            </div>

                            {/* === KOLOM KANAN (FOTO & AKSI) === */}
                            <div className="md:col-span-1 space-y-6">
                                {/* 1. Foto Barang */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                                        Foto Barang
                                    </h3>
                                    {order.item_image ? (
                                        <img
                                            // Ini dia cara nampilin gambarnya
                                            src={`/storage/${order.item_image}`}
                                            alt="Foto Barang Titipan"
                                            className="w-full h-auto rounded-lg shadow-md border"
                                        />
                                    ) : (
                                        <div className="text-center text-gray-500 p-8 border rounded-lg bg-gray-50">
                                            Pelanggan tidak meng-upload foto.
                                        </div>
                                    )}
                                </div>

                                {/* 2. Tindakan Admin */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                                        Tindakan Admin
                                    </h3>
                                    {/* Tampilkan tombol hanya jika status masih 'pending' */}
                                    {order.status === "pending" ? (
                                        <div className="flex flex-col sm:flex-row md:flex-col gap-4">
                                            <PrimaryButton
                                                onClick={submitApprove}
                                                disabled={approving}
                                                className="w-full justify-center"
                                            >
                                                {approving
                                                    ? "Memproses..."
                                                    : "Approve Pesanan"}
                                            </PrimaryButton>
                                            <DangerButton
                                                onClick={() =>
                                                    setConfirmingReject(true)
                                                }
                                                disabled={approving}
                                                className="w-full justify-center"
                                            >
                                                Tolak Pesanan
                                            </DangerButton>
                                        </div>
                                    ) : (
                                        <div className="text-center text-gray-500 p-4 border rounded-lg bg-gray-50">
                                            Pesanan ini sudah di-proses.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* === MODAL UNTUK REJECT === */}
            <Modal show={confirmingReject} onClose={closeModal}>
                <form onSubmit={submitReject} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Tolak Pesanan Ini?
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Harap berikan alasan penolakan. Alasan ini akan
                        ditampilkan ke pelanggan.
                    </p>
                    <div className="mt-6">
                        <InputLabel
                            htmlFor="rejection_reason"
                            value="Alasan Penolakan"
                            className="sr-only"
                        />
                        <textarea
                            id="rejection_reason"
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            value={data.rejection_reason}
                            onChange={(e) =>
                                setData("rejection_reason", e.target.value)
                            }
                            rows="4"
                            placeholder="Contoh: Barang yang akan dititip tidak sesuai..."
                            required
                        />
                        <InputError
                            message={errors.rejection_reason}
                            className="mt-2"
                        />
                    </div>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                            Batal
                        </SecondaryButton>
                        <DangerButton className="ms-3" disabled={rejecting}>
                            {rejecting ? "Memproses..." : "Tolak Pesanan"}
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}

// Komponen helper kecil biar rapi
function DetailItem({
    title,
    data,
    children,
    isPreWrap = false,
    isCapitalize = false,
}) {
    let content = data;
    if (children) {
        content = children;
    }

    let className = "mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2";
    if (isPreWrap) className += " whitespace-pre-wrap"; // Untuk deskripsi
    if (isCapitalize) className += " capitalize"; // Untuk status/kategori

    return (
        <div className="px-1 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">{title}</dt>
            <dd className={className}>{content}</dd>
        </div>
    );
}
