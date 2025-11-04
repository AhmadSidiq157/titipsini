import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";

// Helper function untuk format Rupiah (bisa ditaruh di file terpisah nanti)
const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number);
};

export default function Create({
    auth,
    product,
    productType,
    productModelClass,
}) {
    // useForm untuk data pemesanan
    const { data, setData, post, processing, errors } = useForm({
        // Data tersembunyi untuk dikirim ke controller
        product_id: product.id,
        product_model: productModelClass, // cth: "App\Models\Service"
        final_amount: product.price,

        // Data dari form yang diisi user
        form_details: {
            start_date: "",
            end_date: "",
            notes: "",
        },
    });

    const submit = (e) => {
        e.preventDefault();
        // Kirim data ke OrderController@store
        post(route("order.store"));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Formulir Pemesanan Layanan
                </h2>
            }
        >
            <Head title="Formulir Pemesanan" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 md:p-8 text-gray-900">
                            {/* Detail Produk yang Dipesan */}
                            <section className="mb-6 border-b pb-6">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Layanan yang Anda Pilih:
                                </h3>
                                <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                                    <h4 className="text-xl font-bold text-gray-800">
                                        {product.title || product.name}
                                    </h4>
                                    <p className="mt-1 text-sm text-gray-600">
                                        {product.description}
                                    </p>
                                    <div className="mt-4 text-2xl font-bold text-green-600">
                                        {formatRupiah(product.price)}
                                    </div>
                                </div>
                            </section>

                            {/* Form Pemesanan */}
                            <form onSubmit={submit}>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    Lengkapi Data Penitipan:
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel
                                            htmlFor="start_date"
                                            value="Tanggal Mulai Titip"
                                        />
                                        <TextInput
                                            id="start_date"
                                            type="date"
                                            name="start_date"
                                            value={data.form_details.start_date}
                                            className="mt-1 block w-full"
                                            onChange={(e) =>
                                                setData("form_details", {
                                                    ...data.form_details,
                                                    start_date: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                        <InputError
                                            message={
                                                errors[
                                                    "form_details.start_date"
                                                ]
                                            }
                                            className="mt-2"
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="end_date"
                                            value="Tanggal Selesai Titip"
                                        />
                                        <TextInput
                                            id="end_date"
                                            type="date"
                                            name="end_date"
                                            value={data.form_details.end_date}
                                            className="mt-1 block w-full"
                                            onChange={(e) =>
                                                setData("form_details", {
                                                    ...data.form_details,
                                                    end_date: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                        <InputError
                                            message={
                                                errors["form_details.end_date"]
                                            }
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <InputLabel
                                        htmlFor="notes"
                                        value="Catatan Tambahan (Opsional)"
                                    />
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        value={data.form_details.notes}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        rows="3"
                                        onChange={(e) =>
                                            setData("form_details", {
                                                ...data.form_details,
                                                notes: e.target.value,
                                            })
                                        }
                                        placeholder="Contoh: Barang saya ada 2 koper, 1 tas ransel."
                                    ></textarea>
                                    <InputError
                                        message={errors["form_details.notes"]}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="flex items-center justify-end mt-8">
                                    <PrimaryButton
                                        className="ms-4"
                                        disabled={processing}
                                    >
                                        Lanjut ke Pembayaran
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
