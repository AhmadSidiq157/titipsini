import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, usePage, router, Link } from "@inertiajs/react"; // [MODIF] Tambah Link
import { Check, X, ShieldCheck, AlertTriangle, ArrowLeft } from "lucide-react"; // [MODIF] Tambah ArrowLeft
import PrimaryButton from "@/Components/PrimaryButton";
import DangerButton from "@/Components/DangerButton";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import Modal from "@/Components/Modal";

export default function Show({ auth, verification }) {
    const { flash } = usePage().props;

    // State untuk Modal Reject (Tolak)
    const [isRejectModalOpen, setRejectModalOpen] = useState(false);

    // State untuk Modal Approve (Setujui)
    const [isApproveModalOpen, setApproveModalOpen] = useState(false);

    // URL lengkap untuk gambar KTP
    const idCardImageUrl = `/storage/${verification.id_card_path}`;

    // Form untuk alasan penolakan
    const { data, setData, post, processing, errors } = useForm({
        rejection_notes: "",
    });

    // Handle Submit Reject
    const submitReject = (e) => {
        e.preventDefault();
        post(route("admin.verification.reject", verification.id), {
            onSuccess: () => setRejectModalOpen(false),
        });
    };

    // Handle Submit Approve
    const submitApprove = () => {
        router.post(
            route("admin.verification.approve", verification.id),
            {},
            {
                onSuccess: () => setApproveModalOpen(false),
            }
        );
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-4">
                    {/* Tombol Kembali */}
                    <Link
                        href={route("admin.verification.index")}
                        className="p-2 bg-white border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all shadow-sm group"
                        title="Kembali ke Daftar"
                    >
                        <ArrowLeft
                            size={20}
                            className="group-hover:-translate-x-1 transition-transform"
                        />
                    </Link>

                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Tinjau Verifikasi #{verification.id}
                    </h2>
                </div>
            }
        >
            <Head title={`Tinjau Verifikasi #${verification.id}`} />

            {/* --- MODAL APPROVE --- */}
            <Modal
                show={isApproveModalOpen}
                onClose={() => setApproveModalOpen(false)}
                maxWidth="sm"
            >
                <div className="p-6 text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6 animate-in zoom-in duration-300">
                        <ShieldCheck className="h-8 w-8 text-green-600" />
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                        Setujui Verifikasi?
                    </h2>

                    <p className="text-sm text-gray-500 mb-6">
                        Apakah Anda yakin data user{" "}
                        <strong>{verification.user.name}</strong> sudah valid?{" "}
                        <br />
                        Status akan berubah menjadi{" "}
                        <span className="text-green-600 font-bold">
                            Approved
                        </span>
                        .
                    </p>

                    <div className="flex justify-center gap-3">
                        <button
                            onClick={() => setApproveModalOpen(false)}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm transition-colors"
                        >
                            Batal
                        </button>
                        <PrimaryButton
                            onClick={submitApprove}
                            className="bg-green-600 hover:bg-green-700 border-0 shadow-lg shadow-green-200"
                        >
                            Ya, Setujui
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>

            {/* --- MODAL REJECT --- */}
            <Modal
                show={isRejectModalOpen}
                onClose={() => setRejectModalOpen(false)}
            >
                <form onSubmit={submitReject} className="p-6">
                    <div className="flex items-center gap-3 mb-4 text-red-600">
                        <div className="p-2 bg-red-100 rounded-full">
                            <AlertTriangle size={24} />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">
                            Tolak Verifikasi
                        </h2>
                    </div>

                    <p className="mt-2 text-sm text-gray-600">
                        Anda akan menolak verifikasi untuk{" "}
                        <span className="font-medium text-gray-900">
                            {verification.user.name}
                        </span>
                        . Harap berikan alasan penolakan agar user bisa
                        memperbaiki data.
                    </p>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="rejection_notes"
                            value="Alasan Penolakan"
                        />
                        <textarea
                            id="rejection_notes"
                            className="mt-1 block w-full border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-md shadow-sm"
                            rows="3"
                            value={data.rejection_notes}
                            onChange={(e) =>
                                setData("rejection_notes", e.target.value)
                            }
                            placeholder="Contoh: Foto KTP buram, Nama tidak sesuai..."
                        ></textarea>
                        <InputError
                            message={errors.rejection_notes}
                            className="mt-2"
                        />
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setRejectModalOpen(false)}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm transition-colors"
                        >
                            Batal
                        </button>
                        <DangerButton disabled={processing}>
                            Tolak Verifikasi
                        </DangerButton>
                    </div>
                </form>
            </Modal>

            {/* KONTEN UTAMA HALAMAN */}
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Kolom Kiri: Detail Data */}
                    <div className="lg:col-span-2 bg-white shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-xl font-bold mb-4">Data User</h3>
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
                                label="Status"
                                value={verification.status}
                                badge={verification.status}
                            />
                            <DetailRow
                                label="Nama User"
                                value={verification.user.name}
                            />
                            <DetailRow
                                label="Email User"
                                value={verification.user.email}
                            />
                            <hr className="my-4" />
                            <DetailRow
                                label="Nama Sesuai ID"
                                value={verification.legal_name}
                            />
                            <DetailRow
                                label="Jenis ID"
                                value={verification.id_card_type}
                            />
                            <DetailRow
                                label="Nomor ID"
                                value={verification.id_card_number}
                            />
                            <DetailRow
                                label="Nomor Telepon"
                                value={verification.phone || "-"}
                            />
                            <DetailRow
                                label="Jenis Kelamin"
                                value={verification.gender}
                            />
                            <DetailRow
                                label="Alamat Sesuai ID"
                                value={verification.address_on_id}
                            />
                            {verification.status === "rejected" && (
                                <DetailRow
                                    label="Alasan Ditolak"
                                    value={verification.rejection_notes}
                                />
                            )}
                        </div>
                    </div>

                    {/* Kolom Kanan: Foto KTP & Aksi */}
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-xl font-bold mb-4">
                            Foto Identitas
                        </h3>

                        <a
                            href={idCardImageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                src={idCardImageUrl}
                                alt="Foto KTP/SIM"
                                className="w-full rounded-lg border shadow-sm cursor-pointer hover:opacity-80 transition"
                            />
                        </a>

                        {/* Tombol Aksi (Hanya muncul jika Pending) */}
                        {verification.status === "pending" && (
                            <div className="mt-6 flex gap-3">
                                <button
                                    onClick={() => setApproveModalOpen(true)}
                                    className="w-full inline-flex justify-center items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-bold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:outline-none transition ease-in-out duration-150 shadow-lg shadow-green-100"
                                >
                                    <Check className="w-4 h-4 mr-2" />
                                    Approve
                                </button>

                                <DangerButton
                                    onClick={() => setRejectModalOpen(true)}
                                    className="w-full inline-flex justify-center items-center shadow-lg shadow-red-100"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Reject
                                </DangerButton>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

// Komponen Helper
const getStatusBadge = (status) => {
    switch (status) {
        case "pending":
            return "bg-yellow-200 text-yellow-800";
        case "approved":
            return "bg-green-200 text-green-800";
        case "rejected":
            return "bg-red-200 text-red-800";
        default:
            return "bg-gray-200 text-gray-800";
    }
};

const DetailRow = ({ label, value, badge = null }) => (
    <div className="flex flex-col sm:flex-row sm:justify-between">
        <span className="text-sm text-gray-500">{label}</span>
        {badge ? (
            <span
                className={`px-2 py-0.5 text-sm font-semibold rounded-full ${getStatusBadge(
                    badge
                )}`}
            >
                {value}
            </span>
        ) : (
            <span className="font-semibold text-gray-900 text-left sm:text-right">
                {value}
            </span>
        )}
    </div>
);
