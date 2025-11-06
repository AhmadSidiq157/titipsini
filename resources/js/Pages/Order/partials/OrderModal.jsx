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
// DIROMBAK: Tidak lagi pakai useForm() Inertia, pakai useState + axios
const StepForm = ({ product, productModelClass, onFormSubmit }) => {
    // Ganti useForm dengan useState
    const [data, setData] = useState({
        start_date: "",
        end_date: "",
        notes: "",
    });
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    // Helper untuk update state
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const submit = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        // Gabungkan data form dengan data produk
        const payload = {
            product_id: product.id,
            product_model: productModelClass,
            final_amount: product.price,
            form_details: data, // Kirim state 'data' sebagai 'form_details'
        };

        // Ganti post() Inertia dengan axios.post()
        axios
            .post(route("order.store"), payload)
            .then((response) => {
                // Controller merespons JSON { order: {...} }
                onFormSubmit(response.data.order);
            })
            .catch((error) => {
                if (error.response && error.response.status === 422) {
                    // Tangani error validasi dari Laravel
                    setErrors(error.response.data.errors);
                } else {
                    console.error("Gagal menyimpan order:", error);
                    alert("Gagal menyimpan pesanan. Silakan coba lagi.");
                }
            })
            .finally(() => {
                setProcessing(false);
            });
    };

    return (
        <form onSubmit={submit} className="p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
                Langkah 1: Detail Pemesanan
            </h2>

            <section className="mb-6 bg-gray-50 p-4 rounded-lg border">
                <h4 className="text-lg font-bold text-gray-800">
                    {product.title || product.name}
                </h4>
                <div className="mt-2 text-2xl font-bold text-green-600">
                    {formatRupiah(product.price)}
                </div>
            </section>

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
                            name="start_date" // Tambahkan name
                            value={data.start_date}
                            className="mt-1 block w-full"
                            onChange={handleChange} // Ganti helper
                            required
                        />
                        {/* Ganti cara menampilkan error validasi */}
                        <InputError
                            message={
                                errors["form_details.start_date"]
                                    ? errors["form_details.start_date"][0]
                                    : ""
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
                            name="end_date" // Tambahkan name
                            value={data.end_date}
                            className="mt-1 block w-full"
                            onChange={handleChange} // Ganti helper
                            required
                        />
                        <InputError
                            message={
                                errors["form_details.end_date"]
                                    ? errors["form_details.end_date"][0]
                                    : ""
                            }
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
                        name="notes" // Tambahkan name
                        value={data.notes}
                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        rows="3"
                        onChange={handleChange} // Ganti helper
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
// DIROMBAK: Ganti useForm() Inertia dengan useState + axios
const StepPayment = ({ order, onPaymentSubmit }) => {
    // Ganti useForm dengan useState
    const [data, setData] = useState({
        payment_proof: null,
        notes: "",
    });
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const handleFileChange = (e) => {
        setData((prev) => ({ ...prev, payment_proof: e.target.files[0] }));
    };

    const handleNotesChange = (e) => {
        setData((prev) => ({ ...prev, notes: e.target.value }));
    };

    const submit = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        // Kita butuh FormData karena kita upload file
        const formData = new FormData();
        formData.append("payment_proof", data.payment_proof);
        formData.append("notes", data.notes);
        // Penting: Laravel butuh ini untuk 'PUT' atau 'POST' saat pakai FormData
        formData.append("_method", "POST");

        // Ganti post() Inertia dengan axios.post()
        axios
            .post(route("order.submitPayment", order.id), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                // Controller merespons JSON { orderStatus: "..." }
                onPaymentSubmit(response.data.orderStatus);
            })
            .catch((error) => {
                if (error.response && error.response.status === 422) {
                    setErrors(error.response.data.errors);
                } else {
                    console.error("Gagal submit pembayaran:", error);
                    alert("Gagal submit pembayaran. Silakan coba lagi.");
                }
            })
            .finally(() => {
                setProcessing(false);
            });
    };

    return (
        <form onSubmit={submit} className="p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
                Langkah 2: Pembayaran
            </h2>

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
                        onChange={handleFileChange} // Ganti helper
                        required
                    />
                    <InputError
                        message={
                            errors.payment_proof ? errors.payment_proof[0] : ""
                        }
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
                        onChange={handleNotesChange} // Ganti helper
                        placeholder="Contoh: Sudah transfer dari BCA a/n Budi"
                    ></textarea>
                    <InputError
                        message={errors.notes ? errors.notes[0] : ""}
                        className="mt-2"
                    />
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

    useEffect(() => {
        if (show && service) {
            setStep("loading");
            setProductData(null);
            setOrderData(null);
            setOrderStatus(null);

            axios
                .get(route("order.create", { type: "service", id: service.id }))
                .then((response) => {
                    const props = response.data; // response.data adalah JSON murni
                    setProductData({
                        product: props.product,
                        productModelClass: props.productModelClass,
                    });
                    setStep("form");
                })
                .catch((error) => {
                    console.error(
                        "Gagal fetch data modal:",
                        error.response?.data?.message || error
                    );
                    alert(
                        error.response?.data?.message ||
                            "Gagal memuat detail layanan. Silakan coba lagi."
                    );
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

    const renderStep = () => {
        switch (step) {
            case "form":
                if (!productData) {
                    return <StepLoading />;
                }
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
