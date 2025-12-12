import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
// --- Modal Kustom untuk Konfirmasi Tolak ---
const RejectModal = ({
    show,
    onClose,
    onConfirm,
    processing,
    errors,
    data,
    setData,
}) => {
    if (!show) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center pb-3 border-b">
                    <h3 className="text-xl font-bold text-gray-800">
                        Tolak Verifikasi
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                        disabled={processing}
                    >
                        &times;
                    </button>
                </div>

                {/* Form Alasan Penolakan */}
                <div className="py-4">
                    <label
                        htmlFor="rejection_reason"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Alasan Penolakan (Wajib)
                    </label>
                    <textarea
                        id="rejection_reason"
                        name="rejection_reason"
                        value={data.rejection_reason}
                        onChange={(e) =>
                            setData("rejection_reason", e.target.value)
                        }
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        rows="4"
                    ></textarea>
                    {errors.rejection_reason && (
                        <p className="mt-2 text-sm text-red-600">
                            {errors.rejection_reason}
                        </p>
                    )}
                </div>

                <div className="flex justify-end space-x-3 pt-3 border-t">
                    <button
                        onClick={onClose}
                        disabled={processing}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-semibold text-sm hover:bg-gray-300"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={processing}
                        className="px-4 py-2 bg-red-600 text-white rounded-md font-semibold text-sm hover:bg-red-700 disabled:opacity-50"
                    >
                        {processing ? "Menolak..." : "Ya, Tolak"}
                    </button>
                </div>
            </div>
        </div>
    );
};
// --- Akhir Modal ---

const DataField = ({ label, value }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {value || "-"}
        </dd>
    </div>
);

const ImageField = ({ label, url }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {url ? (
                <a
                    href={`/storage/${url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline"
                >
                    Lihat Gambar
                </a>
            ) : (
                <span className="text-gray-500">-</span>
            )}
        </dd>
    </div>
);

export default function Show({ auth, verification }) {
    const user = verification.user;

    const [isRejectModalOpen, setRejectModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        rejection_reason: "",
    });

    const handleRejectSubmit = () => {
        post(route("admin.courier_verifications.reject", verification.id), {
            onSuccess: () => {
                setRejectModalOpen(false);
                reset();
            },
        });
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Tinjau Verifikasi Kurir
                </h2>
            }
        >
            <Head title={`Tinjau - ${user.name}`} />

            <RejectModal
                show={isRejectModalOpen}
                onClose={() => setRejectModalOpen(false)}
                onConfirm={handleRejectSubmit}
                processing={processing}
                errors={errors}
                data={data}
                setData={setData}
            />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {/* [MODIFIKASI] Tombol Kembali */}
                    <div className="mb-6">
                        <Link
                            href={route("admin.courier_verifications.index")}
                            className="inline-flex items-center text-gray-600 hover:text-emerald-600 transition-colors font-bold"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Kembali ke Daftar
                        </Link>
                    </div>

                    <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden border border-gray-100">
                        {/* Data Akun */}
                        <div className="px-4 py-5 sm:px-6 border-b bg-gray-50/50">
                            <h3 className="text-lg leading-6 font-bold text-gray-900">
                                Data Akun Kurir
                            </h3>
                        </div>
                        <div className="px-4 py-5 sm:p-6">
                            <dl className="divide-y divide-gray-200">
                                <DataField label="Nama" value={user.name} />
                                <DataField label="Email" value={user.email} />
                                {/* [MODIFIKASI] Kolom No. Telepon */}
                                <DataField
                                    label="No. Telepon"
                                    value={user.phone}
                                />
                                <DataField
                                    label="Status Akun"
                                    value={verification.status.toUpperCase()}
                                />
                            </dl>
                        </div>

                        {/* Data Kendaraan */}
                        <div className="px-4 py-5 sm:px-6 border-t bg-gray-50/50">
                            <h3 className="text-lg leading-6 font-bold text-gray-900">
                                Data Kendaraan & Dokumen
                            </h3>
                        </div>
                        <div className="px-4 py-5 sm:p-6">
                            <dl className="divide-y divide-gray-200">
                                <DataField
                                    label="Tipe Kendaraan"
                                    value={
                                        verification.vehicle_type
                                            ? verification.vehicle_type.toUpperCase()
                                            : "-"
                                    }
                                />
                                <DataField
                                    label="Merek Kendaraan"
                                    value={verification.vehicle_brand}
                                />
                                <DataField
                                    label="Model Kendaraan"
                                    value={verification.vehicle_model}
                                />
                                <DataField
                                    label="Plat Nomor"
                                    value={verification.plat_nomor}
                                />
                                <DataField
                                    label="Nomor BPKB"
                                    value={verification.no_bpkb}
                                />
                                <DataField
                                    label="Nomor SIM"
                                    value={verification.no_sim}
                                />

                                <ImageField
                                    label="Foto KTP"
                                    url={verification.foto_ktp_path}
                                />
                                <ImageField
                                    label="Foto SIM"
                                    url={verification.foto_sim_path}
                                />
                                <ImageField
                                    label="Foto STNK"
                                    url={verification.foto_stnk_path}
                                />
                                <ImageField
                                    label="Foto Kendaraan"
                                    url={verification.foto_kendaraan_path}
                                />
                            </dl>
                        </div>

                        {verification.status === "pending" && (
                            <div className="px-4 py-4 bg-gray-50 sm:px-6 flex justify-end space-x-4 border-t">
                                <button
                                    onClick={() => setRejectModalOpen(true)}
                                    disabled={processing}
                                    className="px-4 py-2 bg-red-600 text-white font-bold text-sm rounded-xl hover:bg-red-700 disabled:opacity-50 shadow-sm"
                                >
                                    Tolak
                                </button>
                                <Link
                                    href={route(
                                        "admin.courier_verifications.approve",
                                        verification.id
                                    )}
                                    method="post"
                                    as="button"
                                    disabled={processing}
                                    className="px-4 py-2 bg-emerald-600 text-white font-bold text-sm rounded-xl hover:bg-emerald-700 disabled:opacity-50 shadow-sm"
                                >
                                    Setujui
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
