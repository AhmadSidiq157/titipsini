import React, { useState, useEffect } from "react";
import Modal from "@/Components/Modal";
import { useForm, usePage, router } from "@inertiajs/react";
import axios from "axios"; // Kita butuh axios untuk fetch data modal

// Import komponen-komponen form Anda
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { CheckCircle, Clock, Loader2 } from "lucide-react";

// Helper function
const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number);
};

// --- Sub-Komponen: Loading ---
const StepLoading = () => (
    <div className="p-8 flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="w-12 h-12 text-gray-400 animate-spin" />
        <p className="mt-4 text-gray-600">Memuat detail layanan...</p>
    </div>
);

// --- Sub-Komponen: Step 1 (Formulir) ---
const StepForm = ({ product, productModelClass, onFormSubmit }) => {
    const { data, setData, post, processing, errors } = useForm({
        product_id: product.id,
        product_model: productModelClass,
        final_amount: product.price,
        form_details: {
            start_date: "",
            end_date: "",
            notes: "",
        },
    });

    const submit = (e) => {
        e.preventDefault();
        // Saat submit, kita panggil fungsi onFormSubmit dari parent (OrderModal)
        // yang akan menangani transisi ke step berikutnya
        post(route("order.store"), {
            onSuccess: (page) => {
                // Controller me-redirect ke order.payment,
                // Inertia akan menangkap props 'order' dari halaman itu
                onFormSubmit(page.props.order);
            },
        });
    };

    return (
        <form onSubmit={submit} className="p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
                Langkah 1: Detail Pemesanan
            </h2>

            {/* Detail Produk */}
            <section className="mb-6 bg-gray-50 p-4 rounded-lg border">
                <h4 className="text-lg font-bold text-gray-800">
                    {product.title || product.name}
                </h4>
                <div className="mt-2 text-2xl font-bold text-green-600">
                    {formatRupiah(product.price)}
                </div>
            </section>

            {/* Form */}
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <InputLabel
                            htmlFor="start_date"
                            value="Tanggal Mulai Titip"
                        />
                        <TextInput
                            id="start_date"
                            type="date"
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
                            message={errors["form_details.start_date"]}
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
                            message={errors["form_details.end_date"]}
                            className="mt-2"
                        />
                    </div>
                </div>
                <div>
                    <InputLabel
                        htmlFor="notes"
                        value="Catatan Tambahan (Opsional)"
                    />
                    <textarea
                        id="notes"
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
                </div>
            </div>

            <div className="flex items-center justify-end mt-8 pt-6 border-t">
                <PrimaryButton disabled={processing}>
                    Lanjut ke Pembayaran
                </PrimaryButton>
            </div>
        </form>
    );
};

// --- Sub-Komponen: Step 2 (Pembayaran) ---
const StepPayment = ({ order, onPaymentSubmit }) => {
    const { data, setData, post, processing, errors } = useForm({
        payment_proof: null,
        notes: "",
    });

    const submit = (e) => {
        e.preventDefault();
        // Kirim ke controller, lalu panggil onPaymentSubmit untuk
        // ganti ke step 'success'
        post(route("order.submitPayment", order.id), {
            onSuccess: (page) => {
                onPaymentSubmit(page.props.orderStatus);
            },
        });
    };

    return (
        <form onSubmit={submit} className="p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
                Langkah 2: Pembayaran
            </h2>

            {/* Instruksi Pembayaran */}
            <section className="mb-6">
                <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-600">Total Tagihan:</span>
                        <span className="font-bold text-2xl text-green-600">
                            {formatRupiah(order.final_amount)}
                        </span>
                    </div>
                </div>
                <div className="mt-6">
                    <p className="text-gray-700">
                        Silakan transfer ke rekening:
                    </p>
                    <p className="font-bold text-lg mt-2">
                        BCA: 1234-567-890 (a/n Titipsini Indonesia)
                    </p>
                </div>
            </section>

            {/* Form Upload */}
            <div className="space-y-6">
                <div>
                    <InputLabel
                        htmlFor="payment_proof"
                        value="Upload Bukti Transfer"
                    />
                    <input
                        id="payment_proof"
                        type="file"
                        className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                        onChange={(e) =>
                            setData("payment_proof", e.target.files[0])
                        }
                        required
                    />
                    <InputError
                        message={errors.payment_proof}
                        className="mt-2"
                    />
                </div>
                <div>
                    <InputLabel htmlFor="notes" value="Catatan (Opsional)" />
                    <textarea
                        id="notes"
                        value={data.notes}
                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        rows="2"
                        onChange={(e) => setData("notes", e.target.value)}
                        placeholder="Contoh: Sudah transfer dari BCA a/n Budi"
                    ></textarea>
                </div>
            </div>

            <div className="flex items-center justify-end mt-8 pt-6 border-t">
                <PrimaryButton disabled={processing}>
                    Saya Sudah Bayar
                </PrimaryButton>
            </div>
        </form>
    );
};

// --- Sub-Komponen: Step 3 (Sukses) ---
const StepSuccess = ({ orderStatus, onClose }) => (
    <div className="p-6 md:p-8 text-center">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900">Terima Kasih!</h3>
        <p className="mt-4 text-gray-600 text-lg">
            Bukti pembayaran Anda telah kami terima.
        </p>
        <p className="mt-2 text-gray-600">
            Status pesanan:{" "}
            <span className="font-semibold text-yellow-600">
                {orderStatus.replace("_", " ")}
            </span>
        </p>
        <div className="mt-8">
            <PrimaryButton onClick={onClose}>Tutup</PrimaryButton>
        </div>
    </div>
);

// --- Komponen Modal UTAMA ---
export default function OrderModal({ show, onClose, service }) {
    const [step, setStep] = useState("loading"); // loading, form, payment, success
    const [productData, setProductData] = useState(null);
    const [orderData, setOrderData] = useState(null);
    const [orderStatus, setOrderStatus] = useState(null);

    // Efek ini berjalan setiap kali modal dibuka (prop 'service' berubah)
    useEffect(() => {
        if (show && service) {
            // 1. Reset state
            setStep("loading");
            setProductData(null);
            setOrderData(null);
            setOrderStatus(null);

            // 2. Ambil data produk dari controller (via Axios)
            // Ini diperlukan agar kita bisa mendapatkan 'productModelClass'
            axios
                .get(route("order.create", { type: "service", id: service.id }))
                .then((response) => {
                    // Data yang diambil adalah Halaman Inertia dalam format JSON
                    const props = response.data.props;
                    setProductData({
                        product: props.product,
                        productModelClass: props.productModelClass,
                    });
                    setStep("form"); // Pindah ke step formulir
                })
                .catch((error) => {
                    console.error("Gagal fetch data modal:", error);
                    alert("Gagal memuat detail layanan. Silakan coba lagi.");
                    onClose();
                });
        }
    }, [show, service]);

    // Fungsi transisi
    const handleFormSubmit = (newOrderData) => {
        setOrderData(newOrderData); // Simpan data order
        setStep("payment"); // Pindah ke step pembayaran
    };

    const handlePaymentSubmit = (newOrderStatus) => {
        setOrderStatus(newOrderStatus); // Simpan status
        setStep("success"); // Pindah ke step sukses
    };

    // Render konten berdasarkan step saat ini
    const renderStep = () => {
        switch (step) {
            case "form":
                return (
                    <StepForm
                        product={productData.product}
                        productModelClass={productData.productModelClass}
                        onFormSubmit={handleFormSubmit}
                    />
                );
            case "payment":
                return (
                    <StepPayment
                        order={orderData}
                        onPaymentSubmit={handlePaymentSubmit}
                    />
                );
            case "success":
                return (
                    <StepSuccess orderStatus={orderStatus} onClose={onClose} />
                );
            case "loading":
            default:
                return <StepLoading />;
        }
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            {renderStep()}
        </Modal>
    );
}
