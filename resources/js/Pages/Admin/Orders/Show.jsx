import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { Check, X } from "lucide-react";
import PrimaryButton from "@/Components/PrimaryButton";
import DangerButton from "@/Components/DangerButton";

const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number);
};

export default function Show({ auth, order }) {
    const { flash } = usePage().props;
    const payment = order.payment;

    // URL lengkap untuk gambar di storage
    const proofImageUrl = payment
        ? `/storage/${payment.payment_proof_path}`
        : null;

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Detail Pesanan #{order.id}
                </h2>
            }
        >
            <Head title={`Detail Pesanan #${order.id}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Kolom Kiri: Detail Pesanan & User */}
                    <div className="lg:col-span-2 bg-white shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-xl font-bold mb-4">
                            Detail Pesanan
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
                                value={order.user_form_details.start_date}
                            />
                            <DetailRow
                                label="Tgl Selesai"
                                value={order.user_form_details.end_date}
                            />
                            <DetailRow
                                label="Catatan User"
                                value={order.user_form_details.notes || "-"}
                            />
                        </div>
                    </div>

                    {/* Kolom Kanan: Bukti Pembayaran */}
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-xl font-bold mb-4">
                            Verifikasi Pembayaran
                        </h3>

                        {order.status === "awaiting_verification" && payment ? (
                            <div>
                                <h4 className="font-semibold">
                                    Bukti Transfer:
                                </h4>
                                <p className="text-sm text-gray-600 mb-2">
                                    Catatan: {payment.notes || "-"}
                                </p>

                                <a
                                    href={proofImageUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        src={proofImageUrl}
                                        alt="Bukti Pembayaran"
                                        className="w-full rounded-lg border shadow-sm cursor-pointer hover:opacity-80 transition"
                                    />
                                </a>

                                <div className="mt-6 flex space-x-3">
                                    <Link
                                        href={route(
                                            "admin.orders.approve",
                                            order.id
                                        )}
                                        method="post"
                                        as="button"
                                        className="w-full inline-flex justify-center items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        onBefore={() =>
                                            confirm(
                                                "Apakah Anda yakin ingin MENYETUJUI pembayaran ini?"
                                            )
                                        }
                                    >
                                        <Check className="w-4 h-4 mr-2" />
                                        Approve
                                    </Link>
                                    <Link
                                        href={route(
                                            "admin.orders.reject",
                                            order.id
                                        )}
                                        method="post"
                                        as="button"
                                        className="w-full inline-flex justify-center items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        onBefore={() =>
                                            confirm(
                                                "Apakah Anda yakin ingin MENOLAK pembayaran ini? Bukti bayar akan dihapus dan user harus upload ulang."
                                            )
                                        }
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Reject
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-600">
                                {order.status === "completed"
                                    ? "Pembayaran sudah diverifikasi."
                                    : "User belum meng-upload bukti pembayaran."}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

// Komponen helper kecil
const DetailRow = ({ label, value }) => (
    <div className="flex justify-between">
        <span className="text-gray-500">{label}</span>
        <span className="font-semibold text-gray-900 text-right">{value}</span>
    </div>
);
