import React, { useState, useEffect } from "react";
import Modal from "@/Components/Modal";
import { useForm, usePage, router } from "@inertiajs/react";
import axios from "axios";

// Import komponen form
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { CheckCircle, Clock, Loader2, Package, Truck } from "lucide-react";

// Helper function (tidak berubah)
const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number);
};

// --- Sub-Komponen: Loading --- (Tidak berubah)
const StepLoading = () => (
    <div className="p-8 flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="w-12 h-12 text-gray-400 animate-spin" />
        <p className="mt-4 text-gray-600">Memuat detail layanan...</p>
    </div>
);

// --- Sub-Komponen: Step 1 (Formulir) --- (Tidak berubah)
const StepForm = ({ product, productModelClass, onFormSubmit }) => {
    const isPindahan = productModelClass.includes("MovingPackage");
    const initialData = isPindahan
        ? {
              tanggal_pindahan: "",
              telepon: "",
              alamat_penjemputan: "",
              alamat_tujuan: "",
              notes: "",
          }
        : {
              start_date: "",
              end_date: "",
              notes: "",
          };
    const [data, setData] = useState(initialData);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };
    const submit = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        const payload = {
            product_id: product.id,
            product_model: productModelClass,
            final_amount: product.price,
            form_details: data,
        };
        axios
            .post(route("order.store"), payload)
            .then((response) => {
                onFormSubmit(response.data.order);
            })
            .catch((error) => {
                if (error.response && error.response.status === 422) {
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
                <div className="flex items-center gap-3">
                    {isPindahan ? (
                        <Truck className="w-6 h-6 text-green-600 flex-shrink-0" />
                    ) : (
                        <Package className="w-6 h-6 text-green-600 flex-shrink-0" />
                    )}
                    <h4 className="text-lg font-bold text-gray-800">
                        {product.name || product.title}
                    </h4>
                </div>
                <div className="mt-2 text-2xl font-bold text-green-600">
                    {formatRupiah(product.price)}
                </div>
            </section>
            {isPindahan ? (
                <div className="space-y-6">
                    <div>
                        <InputLabel
                            htmlFor="tanggal_pindahan"
                            value="Tanggal Pindahan"
                        />
                        <TextInput
                            id="tanggal_pindahan"
                            type="date"
                            name="tanggal_pindahan"
                            value={data.tanggal_pindahan}
                            className="mt-1 block w-full"
                            onChange={handleChange}
                            required
                        />
                        <InputError
                            message={
                                errors["form_details.tanggal_pindahan"]?.[0]
                            }
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <InputLabel
                            htmlFor="telepon"
                            value="Nomor Telepon (di lokasi)"
                        />
                        <TextInput
                            id="telepon"
                            type="tel"
                            name="telepon"
                            value={data.telepon}
                            className="mt-1 block w-full"
                            onChange={handleChange}
                            required
                            placeholder="Cth: 08123456789"
                        />
                        <InputError
                            message={errors["form_details.telepon"]?.[0]}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <InputLabel
                            htmlFor="alamat_penjemputan"
                            value="Alamat Penjemputan"
                        />
                        <textarea
                            id="alamat_penjemputan"
                            name="alamat_penjemputan"
                            value={data.alamat_penjemputan}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            rows="3"
                            onChange={handleChange}
                            required
                        ></textarea>
                        <InputError
                            message={
                                errors["form_details.alamat_penjemputan"]?.[0]
                            }
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <InputLabel
                            htmlFor="alamat_tujuan"
                            value="Alamat Tujuan"
                        />
                        <textarea
                            id="alamat_tujuan"
                            name="alamat_tujuan"
                            value={data.alamat_tujuan}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            rows="3"
                            onChange={handleChange}
                            required
                        ></textarea>
                        <InputError
                            message={errors["form_details.alamat_tujuan"]?.[0]}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <InputLabel
                            htmlFor="notes"
                            value="Catatan Tambahan (Opsional)"
                        />
                        <textarea
                            id="notes"
                            name="notes"
                            value={data.notes}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            rows="2"
                            onChange={handleChange}
                            placeholder="Cth: Barang di lantai 3, tidak ada lift."
                        ></textarea>
                        <InputError
                            message={errors["form_details.notes"]?.[0]}
                            className="mt-2"
                        />
                    </div>
                </div>
            ) : (
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
                                name="start_date"
                                value={data.start_date}
                                className="mt-1 block w-full"
                                onChange={handleChange}
                                required
                            />
                            <InputError
                                message={errors["form_details.start_date"]?.[0]}
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
                                value={data.end_date}
                                className="mt-1 block w-full"
                                onChange={handleChange}
                                required
                            />
                            <InputError
                                message={errors["form_details.end_date"]?.[0]}
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
                            name="notes"
                            value={data.notes}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            rows="3"
                            onChange={handleChange}
                            placeholder="Contoh: Barang saya ada 2 koper, 1 tas ransel."
                        ></textarea>
                        <InputError
                            message={errors["form_details.notes"]?.[0]}
                            className="mt-2"
                        />
                    </div>
                </div>
            )}
            <div className="flex items-center justify-end mt-8 pt-6 border-t">
                <PrimaryButton disabled={processing}>
                    Lanjut ke Pembayaran
                </PrimaryButton>
            </div>
        </form>
    );
};

// --- Sub-Komponen: Step 2 (Pembayaran) --- (Tidak berubah)
const StepPayment = ({ order, onPaymentSubmit }) => {
    const [data, setData] = useState({ payment_proof: null, notes: "" });
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
        const formData = new FormData();
        formData.append("payment_proof", data.payment_proof);
        formData.append("notes", data.notes);
        formData.append("_method", "POST");
        axios
            .post(route("order.submitPayment", order.id), formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((response) => {
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
                        onChange={handleFileChange}
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
                        onChange={handleNotesChange}
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

// --- [MODIFIKASI TOTAL] Sub-Komponen: Step 3 (Pending & Sukses Real-time) ---
const StepSuccess = ({ orderId, initialStatus, onClose }) => {
    // [BARU] Buat state untuk status. Dimulai dari status awal ('awaiting_verification')
    const [status, setStatus] = useState(initialStatus);

    // [BARU] Logika Polling
    useEffect(() => {
        // Jika status BUKAN lagi 'awaiting_verification' (misal admin sudah approve),
        // maka kita tidak perlu polling lagi.
        if (status !== "awaiting_verification") {
            return; // Hentikan polling
        }

        // Mulai polling setiap 3 detik
        const interval = setInterval(() => {
            axios
                .get(route("order.status", orderId))
                .then((response) => {
                    const newStatus = response.data.status;
                    if (newStatus !== "awaiting_verification") {
                        setStatus(newStatus); // Update status di state
                        clearInterval(interval); // Stop polling
                    }
                })
                .catch((error) => {
                    console.error("Error polling status:", error);
                    clearInterval(interval); // Stop polling jika ada error
                });
        }, 3000); // Poll setiap 3 detik

        // Fungsi cleanup: Hentikan interval jika komponen ditutup (unmount)
        return () => clearInterval(interval);
    }, [status, orderId]); // 'dependency array': Jalankan ulang efek ini jika 'status' atau 'orderId' berubah

    // [MODIFIKASI] Tampilkan UI berdasarkan state 'status'
    if (status === "awaiting_verification") {
        // --- Tampilan 1: Pending (Menunggu) ---
        return (
            <div className="p-6 md:p-8 text-center">
                <Clock className="w-20 h-20 text-blue-500 mx-auto mb-4 animate-spin" />
                <h3 className="text-2xl font-bold text-gray-900">
                    Pembayaran Diterima
                </h3>
                <p className="mt-4 text-gray-600 text-lg">
                    Bukti pembayaran Anda telah kami terima.
                </p>
                <p className="mt-2 text-gray-600">
                    Status pesanan:{" "}
                    <span className="font-semibold text-blue-600">
                        Menunggu Verifikasi
                    </span>
                </p>
                <p className="mt-2 text-sm text-gray-500">
                    Kami akan segera mengecek. Halaman ini akan diperbarui
                    otomatis setelah Admin menyetujui.
                </p>
                <div className="mt-8">
                    <PrimaryButton
                        onClick={onClose}
                        className="bg-gray-600 hover:bg-gray-700"
                    >
                        Tutup
                    </PrimaryButton>
                </div>
            </div>
        );
    } else {
        // --- Tampilan 2: Sukses (Disetujui) ---
        // (Ini akan muncul jika status berubah menjadi 'processing', 'completed', atau 'rejected')
        const isApproved = status === "processing" || status === "completed";

        return (
            <div className="p-6 md:p-8 text-center">
                {isApproved ? (
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                ) : (
                    <X className="w-20 h-20 text-red-500 mx-auto mb-4" /> // Tampilan jika ditolak
                )}

                <h3 className="text-2xl font-bold text-gray-900">
                    {isApproved ? "Pesanan Disetujui!" : "Pesanan Ditolak"}
                </h3>
                <p className="mt-4 text-gray-600 text-lg">
                    {isApproved
                        ? "Pembayaran Anda telah dikonfirmasi oleh Admin."
                        : "Pembayaran Anda ditolak oleh Admin. Silakan cek riwayat pesanan."}
                </p>
                <p className="mt-2 text-gray-600">
                    Status pesanan baru:
                    <span
                        className={`font-semibold ${
                            isApproved ? "text-green-600" : "text-red-600"
                        }`}
                    >
                        {status.replace("_", " ")}
                    </span>
                </p>
                <div className="mt-8">
                    <PrimaryButton onClick={onClose}>Selesai</PrimaryButton>
                </div>
            </div>
        );
    }
};

// --- Komponen Modal UTAMA ---
export default function OrderModal({ show, onClose, product, productType }) {
    const [step, setStep] = useState("loading"); // loading, form, payment, success
    const [productData, setProductData] = useState(null);
    const [orderData, setOrderData] = useState(null);
    const [orderStatus, setOrderStatus] = useState(null); // Menyimpan status awal

    useEffect(() => {
        if (show && product) {
            setStep("loading");
            setProductData(null);
            setOrderData(null);
            setOrderStatus(null);

            const type =
                productType === "moving_package" ? "moving_package" : "service";

            axios
                .get(route("order.create", { type: type, id: product.id }))
                .then((response) => {
                    const props = response.data;
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
    }, [show, product, productType]);

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
                if (!productData) return <StepLoading />;
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

            // [MODIFIKASI] Kirim prop yang benar ke StepSuccess
            case "success":
                return (
                    <StepSuccess
                        orderId={orderData.id}
                        initialStatus={orderStatus}
                        onClose={onClose}
                    />
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
