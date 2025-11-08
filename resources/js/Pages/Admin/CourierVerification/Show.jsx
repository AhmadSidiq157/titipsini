import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, usePage, useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import DangerButton from "@/Components/DangerButton";
import Modal from "@/Components/Modal";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import {
    Check,
    X,
    AlertTriangle,
    User,
    Car,
    FileText,
    Download,
} from "lucide-react";

// Helper Tampilan Data
const DetailRow = ({ label, value }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 px-1">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {value || "-"}
        </dd>
    </div>
);

// Helper Tampilan Foto
const FotoItem = ({ label, path }) => (
    <div className="flex flex-col items-center p-4 border rounded-lg">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {path ? (
            <a
                href={`/storage/${path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2"
            >
                <img
                    src={`/storage/${path}`}
                    alt={label}
                    className="w-48 h-32 object-cover rounded-md shadow-sm hover:scale-105 transition-transform"
                />
                <span className="mt-2 text-xs text-indigo-600 hover:text-indigo-800 flex items-center justify-center">
                    <Download className="w-3 h-3 mr-1" /> Klik untuk perbesar
                </span>
            </a>
        ) : (
            <div className="w-48 h-32 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                (Tidak ada foto)
            </div>
        )}
    </div>
);

export default function Show({ auth, verification }) {
    const { flash } = usePage().props;
    const [showRejectModal, setShowRejectModal] = useState(false);

    // Form untuk Alasan Penolakan
    const { data, setData, post, processing, errors, reset } = useForm({
        rejection_reason: "",
    });

    // Handle submit form penolakan
    const submitReject = (e) => {
        e.preventDefault();
        post(route("admin.courier_verifications.reject", verification.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowRejectModal(false);
                reset();
            },
        });
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Detail Verifikasi Kurir
                </h2>
            }
        >
            <Head title={`Verifikasi Kurir: ${verification.user.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Kolom Kiri: Detail Data */}
                    <div className="lg:col-span-2 bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {flash.success && (
                                <div className="mb-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-sm">
                                    <p>{flash.success}</p>
                                </div>
                            )}

                            {/* Status Saat Ini */}
                            {verification.status === "pending" && (
                                <div className="mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-md flex items-center">
                                    <AlertTriangle className="w-5 h-5 mr-3" />
                                    <span>Menunggu persetujuan Anda.</span>
                                </div>
                            )}
                            {verification.status === "approved" && (
                                <div className="mb-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-800 rounded-md flex items-center">
                                    <Check className="w-5 h-5 mr-3" />
                                    <span>Kurir ini telah disetujui.</span>
                                </div>
                            )}
                            {verification.status === "rejected" && (
                                <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-800 rounded-md">
                                    <h4 className="font-bold flex items-center">
                                        <X className="w-5 h-5 mr-2" />
                                        Kurir ini ditolak
                                    </h4>
                                    <p className="mt-1 pl-7">
                                        Alasan: {verification.rejection_reason}
                                    </p>
                                </div>
                            )}

                            {/* Detail Data */}
                            <dl className="divide-y divide-gray-200">
                                <DetailRow
                                    label="Nama Kurir"
                                    value={verification.user.name}
                                />
                                <DetailRow
                                    label="Email Kurir"
                                    value={verification.user.email}
                                />
                                <DetailRow
                                    label="Merek Kendaraan"
                                    value={verification.vehicle_brand}
                                />
                                <DetailRow
                                    label="Model Kendaraan"
                                    value={verification.vehicle_model}
                                />
                                <DetailRow
                                    label="Plat Nomor"
                                    value={verification.plat_nomor}
                                />
                                <DetailRow
                                    label="Nomor BPKB"
                                    value={verification.no_bpkb}
                                />
                                <DetailRow
                                    label="Nomor SIM"
                                    value={verification.no_sim}
                                />
                                <DetailRow
                                    label="Tgl Pengajuan"
                                    value={new Date(
                                        verification.created_at
                                    ).toLocaleString("id-ID")}
                                />
                            </dl>
                        </div>
                    </div>

                    {/* Kolom Kanan: Foto & Aksi */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Box Foto */}
                        <div className="bg-white shadow-sm sm:rounded-lg p-6 space-y-4">
                            <h3 className="text-xl font-bold mb-4">
                                Dokumen Foto
                            </h3>
                            <FotoItem
                                label="Foto KTP"
                                path={verification.foto_ktp_path}
                            />
                            <FotoItem
                                label="Foto SIM"
                                path={verification.foto_sim_path}
                            />
                            <FotoItem
                                label="Foto Kendaraan"
                                path={verification.foto_kendaraan_path}
                            />
                        </div>

                        {/* Box Aksi */}
                        {verification.status !== "approved" && (
                            <div className="bg-white shadow-sm sm:rounded-lg p-6">
                                <h3 className="text-xl font-bold mb-4">Aksi</h3>
                                <div className="space-y-3">
                                    <Link
                                        href={route(
                                            "admin.courier_verifications.approve",
                                            verification.id
                                        )}
                                        method="post"
                                        as="button"
                                        className="w-full inline-flex justify-center items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700"
                                        onBefore={() =>
                                            confirm(
                                                "Apakah Anda yakin ingin MENYETUJUI kurir ini?"
                                            )
                                        }
                                        disabled={processing}
                                    >
                                        <Check className="w-4 h-4 mr-2" />
                                        Approve
                                    </Link>

                                    <DangerButton
                                        onClick={() => setShowRejectModal(true)}
                                        className="w-full justify-center"
                                        disabled={
                                            processing ||
                                            verification.status === "rejected"
                                        }
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Reject
                                    </DangerButton>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal untuk Alasan Penolakan */}
            <Modal
                show={showRejectModal}
                onClose={() => setShowRejectModal(false)}
            >
                <form onSubmit={submitReject} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Tolak Verifikasi Kurir
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
        </AdminLayout>
    );
}
