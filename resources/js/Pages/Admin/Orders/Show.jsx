import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, usePage, useForm } from "@inertiajs/react";
import { Check, X, AlertTriangle } from "lucide-react";
import PrimaryButton from "@/Components/PrimaryButton";
import DangerButton from "@/Components/DangerButton";
import Modal from "@/Components/Modal";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";

const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number);
};

// --- [BARU] Komponen Box Verifikasi (disalin dari modal) ---
const PaymentVerificationBox = ({ order }) => {
    const [showRejectModal, setShowRejectModal] = useState(false);

    // Form untuk Alasan Penolakan
    const { data, setData, post, processing, errors, reset } = useForm({
        rejection_reason: "", // Ini diperlukan jika Anda ingin menambahkan alasan penolakan
    });

    const submitReject = (e) => {
        e.preventDefault();
        // Arahkan ke rute 'orders.reject' yang lama
        post(route("admin.orders.reject", order.id), {
            preserveScroll: true,
            onSuccess: () => setShowRejectModal(false),
        });
    };

    return (
        <div className="bg-white shadow-sm sm:rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Verifikasi Pembayaran</h3>
            {order.payment ? (
                <div>
                    <a
                        href={`/storage/${order.payment.payment_proof_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            src={`/storage/${order.payment.payment_proof_path}`}
                            alt="Bukti Pembayaran"
                            className="w-full rounded-lg border shadow-sm cursor-pointer hover:opacity-80 transition"
                        />
                    </a>
                    <div className="mt-6 flex space-x-3">
                        <Link
                            href={route("admin.orders.approve", order.id)}
                            method="post"
                            as="button"
                            className="w-full inline-flex justify-center items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700"
                            onBefore={() =>
                                confirm(
                                    "Apakah Anda yakin ingin MENYETUJUI pembayaran ini?"
                                )
                            }
                        >
                            <Check className="w-4 h-4 mr-2" />
                            Approve
                        </Link>
                        {/* Tombol reject sekarang memicu modal */}
                        <DangerButton
                            onClick={() => setShowRejectModal(true)}
                            className="w-full justify-center"
                        >
                            <X className="w-4 h-4 mr-2" />
                            Reject
                        </DangerButton>
                    </div>
                </div>
            ) : (
                <p className="text-gray-600">
                    User belum meng-upload bukti pembayaran.
                </p>
            )}

            {/* Modal untuk Alasan Penolakan (jika Anda membutuhkannya) */}
            {/* Jika tidak perlu alasan, Anda bisa gunakan <Link> biasa seperti di file lama Anda */}
            <Modal
                show={showRejectModal}
                onClose={() => setShowRejectModal(false)}
            >
                <form onSubmit={submitReject} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Tolak Pembayaran
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Apakah Anda yakin ingin menolak pembayaran ini? Bukti
                        bayar akan dihapus dan user harus upload ulang.
                    </p>
                    {/* Opsional: Tambahkan input alasan jika controller Anda membutuhkannya */}
                    <div className="mt-6 flex justify-end">
                        <PrimaryButton
                            type="button"
                            className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                            onClick={() => setShowRejectModal(false)}
                        >
                            Batal
                        </PrimaryButton>
                        <DangerButton className="ms-3" disabled={processing}>
                            Ya, Tolak Pembayaran
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default function Show({ auth, order }) {
    // <-- [PERBAIKAN] Prop 'couriers' dihapus
    const { flash } = usePage().props;

    // Ambil data form (hanya untuk Penitipan)
    const details = order.user_form_details || {};

    return (
        <AdminLayout
            user={auth.user}
            // [PERBAIKAN] Error nesting <h1><h2>:
            // Ubah header dari <h2> menjadi string biasa.
            header={`Detail Pesanan #${order.id}`}
        >
            <Head title={`Detail Pesanan #${order.id}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Kolom Kiri: Detail Pesanan & User */}
                    <div className="lg:col-span-2 bg-white shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-xl font-bold mb-4">
                            Detail Pesanan (Penitipan)
                        </h3>
                        {flash.success && (
                            <div className="mb-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-sm">
                                <p>{flash.success}</p>
                            </div>
                        )}
                        {flash.error && (
                            <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm">
                                <p>{flash.error}</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <DetailRow
                                label="ID Pesanan"
                                value={`#${order.id}`}
                            />
                            <DetailRow
                                label="Status"
                                value={order.status.replace("_", " ")}
                            />
                            <DetailRow
                                label="Total"
                                value={formatRupiah(order.final_amount)}
                            />
                            <DetailRow
                                label="Layanan"
                                value={
                                    order.orderable.title ||
                                    order.orderable.name
                                }
                            />
                            <DetailRow
                                label="Pemesan"
                                value={`${order.user.name} (${order.user.email})`}
                            />

                            <h4 className="text-md font-semibold pt-4 border-t mt-4">
                                Data Form User:
                            </h4>
                            <DetailRow
                                label="Tgl Mulai"
                                value={details.start_date}
                            />
                            <DetailRow
                                label="Tgl Selesai"
                                value={details.end_date}
                            />
                            <DetailRow
                                label="Catatan User"
                                value={details.notes || "-"}
                            />
                        </div>
                    </div>

                    {/* Kolom Kanan: Aksi */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* 1. Tampilkan Box Pembayaran JIKA statusnya 'awaiting_verification' */}
                        {order.status === "awaiting_verification" && (
                            <PaymentVerificationBox order={order} />
                        )}

                        {/* 2. Tampilkan pesan jika sudah diproses */}
                        {order.status !== "awaiting_verification" && (
                            <div className="bg-white rounded-lg p-6 border shadow-sm flex items-center text-gray-700">
                                <Check className="w-6 h-6 mr-3 text-green-500" />
                                <span className="font-medium">
                                    Pembayaran untuk pesanan ini sudah diproses.
                                </span>
                            </div>
                        )}

                        {/* [DIHAPUS] AssignCourierBox sudah dihapus dari halaman ini */}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

// Komponen helper kecil
const DetailRow = ({ label, value }) => (
    <div className="flex justify-between py-2 border-b border-gray-100">
        <span className="text-sm text-gray-500">{label}</span>
        <span className="font-semibold text-gray-900 text-right">{value}</span>
    </div>
);
