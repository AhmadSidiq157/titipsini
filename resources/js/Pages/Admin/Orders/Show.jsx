import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, usePage, useForm } from "@inertiajs/react";
import {
    Check,
    X,
    User,
    Calendar,
    FileText,
    Box,
    ShieldCheck,
    Clock,
    PackageCheck,
    Truck,
    ArrowRight,
    Image as ImageIcon,
} from "lucide-react";
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

// --- 1. Kotak Verifikasi Pembayaran ---
const PaymentVerificationBox = ({ order }) => {
    const [showRejectModal, setShowRejectModal] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        rejection_reason: "",
    });
    const submitReject = (e) => {
        e.preventDefault();
        post(route("admin.orders.reject", order.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowRejectModal(false);
                reset();
            },
        });
    };

    return (
        <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-lg shadow-orange-500/5 relative overflow-hidden mb-6">
            <div className="absolute top-0 left-0 w-1 h-full bg-orange-400"></div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <ShieldCheck className="w-5 h-5 mr-2 text-orange-500" />{" "}
                Verifikasi Pembayaran
            </h3>
            {order.payment ? (
                <div className="space-y-4">
                    <a
                        href={`/storage/${order.payment.payment_proof_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-xl overflow-hidden border hover:opacity-90"
                    >
                        <img
                            src={`/storage/${order.payment.payment_proof_path}`}
                            alt="Bukti"
                            className="w-full h-40 object-cover"
                        />
                    </a>
                    <div className="flex gap-3">
                        <Link
                            href={route("admin.orders.approve", order.id)}
                            method="post"
                            as="button"
                            className="flex-1 flex justify-center items-center px-4 py-2.5 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700"
                            onBefore={() => confirm("Setujui pembayaran?")}
                        >
                            <Check className="w-4 h-4 mr-2" /> Terima
                        </Link>
                        <button
                            onClick={() => setShowRejectModal(true)}
                            className="flex-1 flex justify-center items-center px-4 py-2.5 bg-white border border-red-200 text-red-600 rounded-xl font-bold text-sm hover:bg-red-50"
                        >
                            <X className="w-4 h-4 mr-2" /> Tolak
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center py-8 bg-gray-50 rounded-xl text-gray-400 text-sm border border-dashed border-gray-300">
                    Menunggu upload bukti...
                </div>
            )}
            <Modal
                show={showRejectModal}
                onClose={() => setShowRejectModal(false)}
            >
                <form onSubmit={submitReject} className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Tolak Pembayaran
                    </h2>
                    <textarea
                        value={data.rejection_reason}
                        onChange={(e) =>
                            setData("rejection_reason", e.target.value)
                        }
                        className="w-full border-gray-300 rounded-xl"
                        rows="3"
                        placeholder="Alasan penolakan..."
                    ></textarea>
                    <div className="mt-6 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setShowRejectModal(false)}
                            className="px-4 py-2 bg-gray-100 rounded-lg"
                        >
                            Batal
                        </button>
                        <DangerButton disabled={processing}>
                            Tolak Verifikasi
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

// --- 2. [BARU] Kotak Penugasan Kurir (Khusus Pickup) ---
const CourierAssignmentBox = ({ order, couriers }) => {
    const { data, setData, post, processing, errors } = useForm({
        courier_id: order.courier_id || "",
    });

    useEffect(() => {
        setData("courier_id", order.courier_id || "");
    }, [order]);

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.orders.assignCourier", order.id), {
            preserveScroll: true,
        });
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case "available":
                return { label: "🟢 Tersedia", disabled: false };
            case "on_delivery":
                return { label: "🔴 Sibuk", disabled: true };
            case "offline":
                return { label: "⚫ Offline", disabled: true };
            default:
                return { label: "⚪ Unknown", disabled: true };
        }
    };

    return (
        <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-lg shadow-blue-500/5 relative overflow-hidden mb-6">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Truck className="w-5 h-5 mr-2 text-blue-500" /> Penjemputan
                Barang
            </h3>

            {order.courier && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-100 text-blue-800 rounded-xl">
                    <p className="text-xs text-blue-600 uppercase font-bold">
                        Kurir Bertugas
                    </p>
                    <p className="font-bold text-lg">{order.courier.name}</p>
                </div>
            )}

            <form onSubmit={submit}>
                <InputLabel
                    htmlFor="courier_id"
                    value={
                        order.courier ? "Ganti Kurir" : "Pilih Kurir Jemputan"
                    }
                    className="mb-1"
                />
                <div className="flex gap-2">
                    <div className="flex-1">
                        <select
                            id="courier_id"
                            value={data.courier_id}
                            onChange={(e) =>
                                setData("courier_id", e.target.value)
                            }
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl text-sm block p-2.5"
                            disabled={couriers.length === 0}
                        >
                            <option value="">-- Pilih Kurir --</option>
                            {couriers.map((courier) => {
                                const info = getStatusInfo(
                                    courier.courier_status
                                );
                                return (
                                    <option
                                        key={courier.id}
                                        value={courier.id}
                                        disabled={info.disabled}
                                        className={
                                            info.disabled ? "text-gray-400" : ""
                                        }
                                    >
                                        {courier.name} {info.label}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <PrimaryButton
                        className="rounded-xl bg-blue-600 hover:bg-blue-700"
                        disabled={processing}
                    >
                        {processing ? "..." : "Simpan"}
                    </PrimaryButton>
                </div>
                <InputError message={errors.courier_id} className="mt-1" />
            </form>
        </div>
    );
};

// --- 3. Kotak Status Penyimpanan ---
const StorageStatusBox = ({ order }) => {
    const { post, processing } = useForm();
    const handleComplete = () => {
        if (confirm("Barang sudah diambil/dikembalikan ke pemilik?"))
            post(route("admin.orders.complete", order.id));
    };

    if (order.status === "completed")
        return (
            <div className="bg-green-50 rounded-2xl p-6 border border-green-200 text-center shadow-sm">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PackageCheck size={32} />
                </div>
                <h4 className="text-xl font-bold text-green-800">Selesai</h4>
                <p className="text-sm text-green-600 mt-1">
                    Barang sudah diambil/dikembalikan.
                </p>
            </div>
        );

    // Tampilkan tombol selesai hanya jika barang sudah di gudang (processing)
    if (order.status === "processing")
        return (
            <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Box className="w-5 h-5 mr-2 text-indigo-500" /> Status
                    Barang
                </h3>
                <div className="bg-indigo-50 p-4 rounded-xl mb-6 flex items-start gap-4 border border-indigo-100">
                    <div className="bg-white p-2 rounded-lg shadow-sm text-indigo-600">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="font-bold text-indigo-900 text-lg">
                            Sedang Disimpan
                        </p>
                        <p className="text-xs text-indigo-600 mt-1">
                            Masa sewa aktif.
                        </p>
                    </div>
                </div>
                <PrimaryButton
                    onClick={handleComplete}
                    disabled={processing}
                    className="w-full justify-center py-4 bg-indigo-600 hover:bg-indigo-700 rounded-xl"
                >
                    <PackageCheck className="w-5 h-5 mr-2" /> Tandai Selesai
                    (Barang Diambil)
                </PrimaryButton>
            </div>
        );
    return null;
};

// --- 4. Kotak Detail Pesanan ---
const OrderDetailsBox = ({ order }) => {
    const details = order.user_form_details || {};
    return (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm h-full">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-gray-400" /> Detail
                Pesanan
            </h3>
            <div className="space-y-8">
                <div className="flex items-start gap-5">
                    <div className="p-3 bg-gray-50 rounded-2xl text-gray-500">
                        <User size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                            Info Klien
                        </p>
                        <p className="font-bold text-gray-900 text-lg">
                            {order.user.name}
                        </p>
                        <p className="text-sm text-gray-500">
                            {order.user.email}
                        </p>
                        {details.phone && (
                            <p className="text-sm text-gray-600 mt-1">
                                {details.phone}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex items-start gap-5">
                    <div className="p-3 bg-gray-50 rounded-2xl text-gray-500">
                        <Box size={24} />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                            Paket Layanan
                        </p>
                        <div className="flex justify-between items-start">
                            <p className="font-bold text-gray-900 text-lg">
                                {order.orderable.title || order.orderable.name}
                            </p>
                            <span className="text-green-600 font-extrabold text-lg bg-green-50 px-3 py-1 rounded-lg">
                                {formatRupiah(order.final_amount)}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-gray-500">
                            <Calendar size={16} />
                            <span className="text-xs font-bold uppercase">
                                Durasi Penitipan
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-400 mb-1">Mulai</p>
                            <p className="font-bold text-gray-900">
                                {details.start_date}
                            </p>
                        </div>
                        <div className="flex-1 mx-4 h-0.5 bg-gray-300 relative">
                            <div className="absolute -top-1.5 -right-1 text-gray-300">
                                <ArrowRight size={16} />
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400 mb-1">
                                Selesai
                            </p>
                            <p className="font-bold text-gray-900">
                                {details.end_date}
                            </p>
                        </div>
                    </div>
                </div>
                {details.delivery_method && (
                    <div className="flex items-center gap-4 p-4 border border-dashed border-gray-300 rounded-xl">
                        <div
                            className={`p-2 rounded-full ${
                                details.delivery_method === "pickup"
                                    ? "bg-blue-100 text-blue-600"
                                    : "bg-orange-100 text-orange-600"
                            }`}
                        >
                            {details.delivery_method === "pickup" ? (
                                <Truck size={20} />
                            ) : (
                                <Box size={20} />
                            )}
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">
                                Metode Penyerahan
                            </p>
                            <p className="font-bold text-gray-800">
                                {details.delivery_method === "pickup"
                                    ? "Request Jemput (Pick Up)"
                                    : "Antar Sendiri (Drop Off)"}
                            </p>
                        </div>
                    </div>
                )}
                {details.item_photo_path && (
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold mb-3 flex items-center">
                            <ImageIcon size={16} className="mr-1" /> Foto Barang
                        </p>
                        <a
                            href={`/storage/${details.item_photo_path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full h-56 rounded-2xl overflow-hidden border border-gray-200 shadow-sm group relative"
                        >
                            <img
                                src={`/storage/${details.item_photo_path}`}
                                alt="Foto Barang"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                <span className="opacity-0 group-hover:opacity-100 text-white font-bold border-2 border-white px-4 py-2 rounded-full">
                                    Perbesar
                                </span>
                            </div>
                        </a>
                    </div>
                )}
                {details.notes && (
                    <div className="bg-yellow-50 p-5 rounded-2xl text-sm text-yellow-800 border border-yellow-100 flex gap-3">
                        <FileText className="w-5 h-5 flex-shrink-0 mt-0.5 opacity-60" />
                        <div>
                            <span className="font-bold block mb-1">
                                Catatan Klien:
                            </span>
                            <span className="italic">"{details.notes}"</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default function Show({ auth, order, couriers }) {
    // <-- Terima prop couriers
    const { flash } = usePage().props;
    const details = order.user_form_details || {};

    // Cek apakah butuh penjemputan dan belum selesai
    const needsPickup = details.delivery_method === "pickup";
    const canAssignCourier =
        needsPickup &&
        order.status !== "completed" &&
        order.status !== "cancelled" &&
        order.status !== "rejected";

    return (
        <AdminLayout user={auth.user} header={null}>
            <Head title={`Detail Penitipan #${order.id}`} />
            <div className="min-h-screen bg-gray-50/50 pb-20">
                <div className="bg-white border-b border-gray-100 sticky top-0 z-10 bg-opacity-90 backdrop-blur-md px-6 py-4 flex justify-between items-center shadow-sm">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
                                Penitipan #{order.id}
                            </h2>
                            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-gray-100 text-gray-700">
                                {order.status.replace("_", " ")}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Dibuat pada{" "}
                            {new Date(order.created_at).toLocaleDateString()}
                        </p>
                    </div>
                    <Link
                        href={route("admin.orders.index")}
                        className="text-sm text-gray-500 hover:text-gray-800 font-medium"
                    >
                        &larr; Kembali
                    </Link>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {flash.success && (
                        <div className="mb-8 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-2xl flex items-center shadow-sm">
                            <Check className="w-5 h-5 mr-2" /> {flash.success}
                        </div>
                    )}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-7 space-y-6">
                            <OrderDetailsBox order={order} />
                        </div>
                        <div className="lg:col-span-5 space-y-6">
                            {order.status === "awaiting_verification" && (
                                <PaymentVerificationBox order={order} />
                            )}

                            {/* [LOGIKA] Tampilkan Box Kurir HANYA jika butuh jemput & belum selesai */}
                            {canAssignCourier && (
                                <CourierAssignmentBox
                                    order={order}
                                    couriers={couriers}
                                />
                            )}

                            <StorageStatusBox order={order} />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
