import React, { useState, useEffect } from "react";
import Modal from "@/Components/Modal";
import { Head, Link, usePage, useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import DangerButton from "@/Components/DangerButton";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import {
    Check,
    X,
    Truck,
    User,
    MapPin,
    Phone,
    Calendar,
    FileText,
    Download,
} from "lucide-react";

// Helper function (tidak berubah)
const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number || 0);
};

// --- Komponen Internal: Kotak Verifikasi Pembayaran ---
const PaymentVerificationBox = ({ order }) => {
    // ... (Komponen ini tidak berubah, sudah dioptimasi)
    const [showRejectModal, setShowRejectModal] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        rejection_reason: "",
    });
    const submitReject = (e) => {
        e.preventDefault();
        post(route("admin.pindahan.reject", order.id), {
            only: ["orders", "flash"],
            preserveScroll: true,
            onSuccess: () => {
                setShowRejectModal(false);
                reset();
            },
        });
    };
    return (
        <div className="bg-white rounded-lg p-6 border shadow-sm">
            <h3 className="text-xl font-bold mb-4">Verifikasi Pembayaran</h3>
            {order.payment ? (
                <div>
                    <a
                        href={`/storage/${order.payment.payment_proof_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-lg overflow-hidden border hover:opacity-90 transition"
                    >
                        <img
                            src={`/storage/${order.payment.payment_proof_path}`}
                            alt="Bukti Pembayaran"
                            className="w-full h-auto object-cover"
                        />
                    </a>
                    <p className="text-sm text-gray-600 mt-2">
                        Catatan Klien: {order.payment.notes || "-"}
                    </p>
                    <div className="mt-6 flex space-x-3">
                        <Link
                            href={route("admin.pindahan.approve", order.id)}
                            method="post"
                            as="button"
                            className="w-full inline-flex justify-center items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700"
                            onBefore={() =>
                                confirm(
                                    "Apakah Anda yakin ingin MENYETUJUI pembayaran ini?"
                                )
                            }
                            preserveScroll
                            only={["orders", "flash"]}
                        >
                            <Check className="w-4 h-4 mr-2" />
                            Approve
                        </Link>
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
            <Modal
                show={showRejectModal}
                onClose={() => setShowRejectModal(false)}
            >
                <form onSubmit={submitReject} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Tolak Verifikasi
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Harap masukkan alasan penolakan. Alasan ini akan
                        ditampilkan kepada kurir.
                    </p>
                    <div className="mt-4">
                        <InputLabel
                            htmlFor="rejection_reason"
                            value="Alasan Penolakan"
                        />
                        <textarea
                            id="rejection_reason"
                            name="rejection_reason"
                            value={data.rejection_reason}
                            onChange={(e) =>
                                setData("rejection_reason", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            rows="4"
                        />
                        <InputError
                            message={errors.rejection_reason}
                            className="mt-2"
                        />
                    </div>
                    <div className="mt-6 flex justify-end">
                        <PrimaryButton
                            type="button"
                            className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                            onClick={() => setShowRejectModal(false)}
                            disabled={processing}
                        >
                            Batal
                        </PrimaryButton>
                        <DangerButton className="ms-3" disabled={processing}>
                            {processing
                                ? "Menyimpan..."
                                : "Tolak & Kirim Alasan"}
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

// --- [MODIFIKASI TOTAL] Komponen Internal: Kotak Tugaskan Kurir ---
const AssignCourierBox = ({ order, couriers, formState }) => {
    const { data, setData, post, processing, errors } = formState;

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.pindahan.assignCourier", order.id), {
            only: ["orders", "flash"],
            preserveScroll: true,
        });
    };

    // [BARU] Helper untuk info status yang lebih profesional
    const getStatusInfo = (status) => {
        switch (status) {
            case "available":
                return { label: "Tersedia", disabled: false };
            case "on_delivery":
                return { label: "Sedang Mengantar", disabled: true };
            case "offline":
                return { label: "Offline", disabled: true };
            default:
                return { label: "Tidak Diketahui", disabled: true };
        }
    };

    return (
        <div className="bg-white rounded-lg p-6 border shadow-sm">
            <h3 className="text-xl font-bold mb-4 flex items-center">
                <Truck className="w-5 h-5 mr-2" />
                Tugaskan Kurir
            </h3>
            {order.courier && (
                <div className="mb-4 p-3 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-md">
                    <span className="font-semibold">
                        Saat ini ditugaskan ke: {order.courier.name}
                    </span>
                </div>
            )}
            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="courier_id" value="Pilih Kurir" />
                    <select
                        id="courier_id"
                        name="courier_id"
                        value={data.courier_id}
                        onChange={(e) => setData("courier_id", e.target.value)}
                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        disabled={couriers.length === 0}
                    >
                        <option value="">
                            {couriers.length > 0
                                ? "-- Pilih kurir --"
                                : "-- Tidak ada kurir tersedia --"}
                        </option>
                        {couriers.map((courier) => {
                            // [MODIFIKASI] Ambil info status
                            const statusInfo = getStatusInfo(
                                courier.courier_status
                            );
                            return (
                                <option
                                    key={courier.id}
                                    value={courier.id}
                                    // Nonaktifkan jika sibuk/offline
                                    disabled={statusInfo.disabled}
                                    // Beri warna abu-abu jika nonaktif
                                    className={
                                        statusInfo.disabled
                                            ? "text-gray-400"
                                            : "text-gray-900"
                                    }
                                >
                                    {/* [MODIFIKASI] Ganti emoji dengan label teks */}
                                    {courier.name} - ({statusInfo.label})
                                </option>
                            );
                        })}
                    </select>
                    <InputError message={errors.courier_id} className="mt-2" />
                </div>
                <div className="mt-4">
                    <PrimaryButton
                        className="w-full justify-center"
                        disabled={processing || couriers.length === 0}
                    >
                        {processing
                            ? "Menyimpan..."
                            : order.courier
                            ? "Ganti Kurir"
                            : "Tugaskan Kurir"}
                    </PrimaryButton>
                </div>
            </form>
        </div>
    );
};

// --- Komponen Internal: Detail Pesanan ---
const OrderDetailsBox = ({ order }) => {
    // ... (Tidak berubah)
    const details = order.user_form_details;
    return (
        <div className="bg-white rounded-lg p-6 border shadow-sm">
            <h3 className="text-xl font-bold mb-4">Detail Pesanan</h3>
            <div className="space-y-4">
                <div>
                    <h4 className="text-sm font-medium text-gray-500 flex items-center">
                        <User className="w-4 h-4 mr-1.5" />
                        Info Klien
                    </h4>
                    <p className="mt-1 text-gray-900">
                        {order.user.name} ({order.user.email})
                    </p>
                    <p className="mt-1 text-gray-900">{details.telepon}</p>
                </div>
                <div>
                    <h4 className="text-sm font-medium text-gray-500 flex items-center">
                        <Calendar className="w-4 h-4 mr-1.5" />
                        Tanggal Pindahan
                    </h4>
                    <p className="mt-1 text-gray-900">
                        {new Date(details.tanggal_pindahan).toLocaleDateString(
                            "id-ID",
                            { dateStyle: "full" }
                        )}
                    </p>
                </div>
                <div>
                    <h4 className="text-sm font-medium text-gray-500 flex items-center">
                        <MapPin className="w-4 h-4 mr-1.5 text-red-500" />
                        Alamat Penjemputan
                    </h4>
                    <p className="mt-1 text-gray-900">
                        {details.alamat_penjemputan}
                    </p>
                </div>
                <div>
                    <h4 className="text-sm font-medium text-gray-500 flex items-center">
                        <MapPin className="w-4 h-4 mr-1.5 text-green-500" />
                        Alamat Tujuan
                    </h4>
                    <p className="mt-1 text-gray-900">
                        {details.alamat_tujuan}
                    </p>
                </div>
                {details.notes && (
                    <div>
                        <h4 className="text-sm font-medium text-gray-500 flex items-center">
                            <FileText className="w-4 h-4 mr-1.5" />
                            Catatan Klien
                        </h4>
                        <p className="mt-1 text-gray-900 italic">
                            "{details.notes}"
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Komponen Modal UTAMA ---
export default function ManageOrderModal({ show, onClose, order, couriers }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        courier_id: order?.courier_id || "",
    });

    useEffect(() => {
        if (order) {
            setData("courier_id", order.courier_id || "");
        }
    }, [order]);

    if (!order) {
        return null;
    }

    return (
        <Modal show={show} onClose={onClose} maxWidth="4xl">
            <div className="p-6 bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-900">
                    Kelola Pesanan Pindahan #{order.id}
                </h2>
                <p className="mt-1 text-gray-600">
                    Klien:{" "}
                    <span className="font-medium">{order.user.name}</span>
                </p>
                <p className="text-gray-600">
                    Paket:{" "}
                    <span className="font-medium">{order.orderable.name}</span>
                </p>

                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Kolom Kiri: Detail */}
                    <div className="space-y-6">
                        <OrderDetailsBox order={order} />
                    </div>

                    {/* Kolom Kanan: Aksi */}
                    <div className="space-y-6">
                        {order.status === "awaiting_verification" && (
                            <PaymentVerificationBox order={order} />
                        )}
                        {(order.status === "processing" ||
                            order.status === "ready_for_pickup") && (
                            <AssignCourierBox
                                order={order}
                                couriers={couriers}
                                formState={{
                                    data,
                                    setData,
                                    post,
                                    processing,
                                    errors,
                                }}
                            />
                        )}
                        {order.status === "completed" && (
                            <div className="bg-white rounded-lg p-6 border border-green-300 shadow-sm flex items-center text-green-700">
                                <Check className="w-6 h-6 mr-3" />
                                <span className="font-medium">
                                    Pesanan ini telah selesai.
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 text-right">
                    <PrimaryButton
                        type="button"
                        className="bg-gray-600 hover:bg-gray-700"
                        onClick={onClose}
                    >
                        Tutup
                    </PrimaryButton>
                </div>
            </div>
        </Modal>
    );
}
