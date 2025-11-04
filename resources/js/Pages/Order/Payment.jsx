import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";

// Helper function
const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number);
};

export default function Payment({ auth, order }) {
    // useForm untuk upload file
    const { data, setData, post, processing, errors } = useForm({
        payment_proof: null, // Ini akan diisi oleh file input
        notes: "",
    });

    const submit = (e) => {
        e.preventDefault();
        // Kirim ke OrderController@submitPayment
        // PENTING: Inertia otomatis menangani file upload (multipart/form-data)
        post(route("order.submitPayment", order.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Konfirmasi Pembayaran
                </h2>
            }
        >
            <Head title="Konfirmasi Pembayaran" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 md:p-8 text-gray-900">
                            {/* Instruksi Pembayaran (Hardcoded, bisa Anda buat dinamis nanti) */}
                            <section className="mb-6 border-b pb-6">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Detail Tagihan
                                </h3>
                                <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">
                                            Pesanan:
                                        </span>
                                        <span className="font-bold">
                                            {order.orderable.title ||
                                                order.orderable.name}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-gray-600">
                                            Total Tagihan:
                                        </span>
                                        <span className="font-bold text-2xl text-green-600">
                                            {formatRupiah(order.final_amount)}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <p className="text-gray-700">
                                        Silakan lakukan transfer ke rekening
                                        berikut:
                                    </p>
                                    <p className="font-bold text-lg mt-2">
                                        BCA: 1234-567-890
                                        <br />
                                        a/n Titipsini Indonesia
                                    </p>
                                    <p className="mt-2 text-sm text-red-600">
                                        PENTING: Pastikan Anda mentransfer
                                        sesuai nominal tagihan di atas.
                                    </p>
                                </div>
                            </section>

                            {/* Form Upload Bukti */}
                            <form onSubmit={submit}>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    Upload Bukti Transfer
                                </h3>

                                <div>
                                    <InputLabel
                                        htmlFor="payment_proof"
                                        value="Screenshot Bukti Transfer"
                                    />
                                    <input
                                        id="payment_proof"
                                        type="file"
                                        name="payment_proof"
                                        className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                                        onChange={(e) =>
                                            setData(
                                                "payment_proof",
                                                e.target.files[0]
                                            )
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.payment_proof}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mt-6">
                                    <InputLabel
                                        htmlFor="notes"
                                        value="Catatan (Opsional)"
                                    />
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        value={data.notes}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        rows="3"
                                        onChange={(e) =>
                                            setData("notes", e.target.value)
                                        }
                                        placeholder="Contoh: Sudah transfer dari BCA a/n Budi Santoso"
                                    ></textarea>
                                    <InputError
                                        message={errors.notes}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="flex items-center justify-end mt-8">
                                    <PrimaryButton
                                        className="ms-4"
                                        disabled={processing}
                                    >
                                        Saya Sudah Bayar
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
