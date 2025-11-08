import React from "react";
import CourierLayout from "../../Layouts/CourierLayout"; // Path relatif
import InputError from "../../Components/InputError"; // Path relatif
import InputLabel from "../../Components/InputLabel"; // Path relatif
import PrimaryButton from "../../Components/PrimaryButton"; // Path relatif
import { Head, useForm, usePage } from "@inertiajs/react";

// Daftar status yang bisa dipilih kurir
const statusOptions = [
    // Tambahkan status awal jika diperlukan kurir untuk konfirmasi
    { value: "ready_for_pickup", label: "Siap Diambil (Ready for Pickup)" },
    { value: "picked_up", label: "Barang Sudah Diambil (Picked Up)" },
    { value: "on_delivery", label: "Dalam Pengantaran (On Delivery)" },
    { value: "delivered", label: "Sudah Sampai Tujuan (Delivered)" },
    { value: "completed", label: "Selesai (Completed)" },
    { value: "cancelled", label: "Dibatalkan (Cancelled)" },
];

// Helper untuk format Rupiah
const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number || 0);
};

export default function TaskShow({ auth, task }) {
    const { flash } = usePage().props;

    const { data, setData, patch, processing, errors } = useForm({
        status: task.status || "ready_for_pickup", // Ambil status saat ini
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route("courier.tasks.updateStatus", task.id), {
            preserveScroll: true,
        });
    };

    // Helper untuk mengambil detail alamat dari JSON
    const details = task.user_form_details || {};
    const orderable = task.orderable || {};
    const payment = task.payment || {};

    return (
        <CourierLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Detail Tugas #{task.id}
                </h2>
            }
        >
            <Head title={`Tugas #${task.id}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Kolom Kiri: Detail Tugas */}
                    <div className="md:col-span-2 bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                Detail Pesanan
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Klien
                                    </dt>
                                    {/* [PERBAIKAN] Menggunakan task.user */}
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                        {task.user
                                            ? `${task.user.name} (${task.user.email})`
                                            : "Klien Dihapus"}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Layanan
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                        {orderable.name ||
                                            "Layanan tidak ditemukan"}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Total Biaya
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                        {formatRupiah(task.total_amount)}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Status Pembayaran
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                        {payment.status
                                            ? payment.status.toUpperCase()
                                            : "Belum Bayar"}
                                    </dd>
                                </div>

                                <hr className="dark:border-gray-700" />

                                <h4 className="text-md font-medium text-gray-900 dark:text-gray-100">
                                    Detail Alamat
                                </h4>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Alamat Penjemputan
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                        {details.alamat_penjemputan ||
                                            "Tidak ada"}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Alamat Tujuan
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                        {details.alamat_tujuan || "Tidak ada"}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Kontak Klien
                                    </dt>
                                    {/* [PERBAIKAN] Menggunakan task.user */}
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                        {details.telepon ||
                                            (task.user
                                                ? task.user.email
                                                : "N/A")}
                                    </dd>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Kolom Kanan: Update Status */}
                    <div className="md:col-span-1 bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg h-fit">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                Update Status Tugas
                            </h3>

                            {flash.success && (
                                <div className="mb-4 font-medium text-sm text-green-600 dark:text-green-400">
                                    {flash.success}
                                </div>
                            )}

                            <form onSubmit={submit}>
                                <div>
                                    <InputLabel
                                        htmlFor="status"
                                        value="Status Baru"
                                    />

                                    <select
                                        id="status"
                                        name="status"
                                        value={data.status}
                                        onChange={(e) =>
                                            setData("status", e.target.value)
                                        }
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    >
                                        {statusOptions.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>

                                    <InputError
                                        message={errors.status}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="flex items-center justify-end mt-4">
                                    <PrimaryButton
                                        className="ms-4"
                                        disabled={processing}
                                    >
                                        Update
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </CourierLayout>
    );
}
