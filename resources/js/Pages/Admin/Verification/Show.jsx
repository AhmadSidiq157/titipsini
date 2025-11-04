import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { Check, X, ShieldAlert } from "lucide-react";
import PrimaryButton from "@/Components/PrimaryButton";
import DangerButton from "@/Components/DangerButton";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import Modal from "@/Components/Modal";

export default function Show({ auth, verification }) {
    const { flash } = usePage().props;
    const [isRejectModalOpen, setRejectModalOpen] = React.useState(false);

    // URL lengkap untuk gambar KTP
    const idCardImageUrl = `/storage/${verification.id_card_path}`;

    // Form untuk alasan penolakan
    const { data, setData, post, processing, errors } = useForm({
        rejection_notes: "",
    });

    const submitReject = (e) => {
        e.preventDefault();
        post(route("admin.verification.reject", verification.id), {
            onSuccess: () => setRejectModalOpen(false),
        });
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Tinjau Verifikasi #{verification.id}
                </h2>
            }
        >
            <Head title={`Tinjau Verifikasi #${verification.id}`} />

            {/* Modal untuk Konfirmasi Penolakan */}
            <Modal
                show={isRejectModalOpen}
                onClose={() => setRejectModalOpen(false)}
            >
                <form onSubmit={submitReject} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Tolak Verifikasi
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Anda akan menolak verifikasi untuk{" "}
                        <span className="font-medium">
                            {verification.user.name}
                        </span>
                        . Harap berikan alasan penolakan.
                    </p>
                    <div className="mt-6">
                        <InputLabel
                            htmlFor="rejection_notes"
                            value="Alasan Penolakan"
                        />
                        <textarea
                            id="rejection_notes"
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            rows="3"
                            value={data.rejection_notes}
                            onChange={(e) =>
                                setData("rejection_notes", e.target.value)
                            }
                        ></textarea>
                        <InputError
                            message={errors.rejection_notes}
                            className="mt-2"
                        />
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button
                            type-="button"
                            onClick={() => setRejectModalOpen(false)}
                            className="mr-3 px-4 py-2 text-gray-700"
                        >
                            Batal
                        </button>
                        <DangerButton disabled={processing}>Tolak</DangerButton>
                    </div>
                </form>
            </Modal>

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

                        {/* Tombol Aksi hanya muncul jika status 'pending' */}
                        {verification.status === "pending" && (
                            <div className="mt-6 flex space-x-3">
                                <Link
                                    href={route(
                                        "admin.verification.approve",
                                        verification.id
                                    )}
                                    method="post"
                                    as="button"
                                    className="w-full inline-flex justify-center items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    onBefore={() =>
                                        confirm("Setujui verifikasi user ini?")
                                    }
                                >
                                    <Check className="w-4 h-4 mr-2" />
                                    Approve
                                </Link>
                                <DangerButton
                                    onClick={() => setRejectModalOpen(true)}
                                    className="w-full inline-flex justify-center items-center"
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

// Komponen helper
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
