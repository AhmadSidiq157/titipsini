import React, { useState, useEffect } from "react";
import Modal from "@/Components/Modal";
import { Link, useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import DangerButton from "@/Components/DangerButton";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import LiveMap from "@/Components/LiveMap";
import axios from "axios";
import {
    Check,
    X,
    Truck,
    User,
    MapPin,
    Calendar,
    FileText,
    Map as MapIcon,
    ShieldCheck,
    AlertCircle,
    Package,
    Camera,
    Box,
    ArrowRight,
    Clock,
} from "lucide-react";

// Helper function
const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number || 0);
};

// --- Sub-Komponen: Loading ---
const StepLoading = () => (
    <div className="p-8 flex flex-col items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
        <p className="text-gray-600 animate-pulse">Memuat detail layanan...</p>
    </div>
);

// --- Sub-Komponen: Step 1 (Formulir Fleksibel) ---
const StepForm = ({ product, productModelClass, onFormSubmit }) => {
    const isPindahan = productModelClass.includes("MovingPackage");

    // Data awal
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
              delivery_method: "drop_off", // [BARU] Default: Antar Sendiri
              item_photo: null, // [BARU] Foto Barang
          };

    const [data, setData] = useState(initialData);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    // [BARU] Preview Foto
    const [photoPreview, setPhotoPreview] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    // [BARU] Handle File Upload
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData((prev) => ({ ...prev, item_photo: file }));
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        // Gunakan FormData untuk support file upload
        const formData = new FormData();
        formData.append("product_id", product.id);
        formData.append("product_model", productModelClass);
        formData.append("final_amount", product.price);

        // Loop data form_details dan append ke FormData
        Object.keys(data).forEach((key) => {
            // Format khusus untuk nested array di Laravel validation (form_details[key])
            formData.append(`form_details[${key}]`, data[key]);
        });

        axios
            .post(route("order.store"), formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
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
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-extrabold text-gray-900">
                    Detail Pemesanan
                </h2>
                <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase rounded-full">
                    Langkah 1/3
                </div>
            </div>

            {/* Info Produk */}
            <div className="mb-8 bg-gradient-to-br from-gray-50 to-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md ${
                            isPindahan ? "bg-blue-500" : "bg-green-500"
                        }`}
                    >
                        {isPindahan ? <Truck size={24} /> : <Box size={24} />}
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-gray-800">
                            {product.name || product.title}
                        </h4>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                            {isPindahan
                                ? "Paket Pindahan"
                                : "Layanan Penitipan"}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-400">Total Biaya</p>
                    <p className="text-xl font-bold text-green-600">
                        {formatRupiah(product.price)}
                    </p>
                </div>
            </div>

            {isPindahan ? (
                /* --- FORM PINDAHAN (Tetap Sama) --- */
                <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <InputLabel
                                htmlFor="tanggal_pindahan"
                                value="Tanggal Pindahan"
                            />
                            <input
                                type="date"
                                name="tanggal_pindahan"
                                value={data.tanggal_pindahan}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                                required
                            />
                            <InputError
                                message={
                                    errors["form_details.tanggal_pindahan"]?.[0]
                                }
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="telepon"
                                value="No. HP di Lokasi"
                            />
                            <input
                                type="tel"
                                name="telepon"
                                value={data.telepon}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                                placeholder="08..."
                                required
                            />
                            <InputError
                                message={errors["form_details.telepon"]?.[0]}
                                className="mt-1"
                            />
                        </div>
                    </div>
                    <div>
                        <InputLabel
                            htmlFor="alamat_penjemputan"
                            value="Alamat Penjemputan"
                        />
                        <textarea
                            name="alamat_penjemputan"
                            value={data.alamat_penjemputan}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                            rows="2"
                            placeholder="Alamat lengkap..."
                            required
                        ></textarea>
                        <InputError
                            message={
                                errors["form_details.alamat_penjemputan"]?.[0]
                            }
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <InputLabel
                            htmlFor="alamat_tujuan"
                            value="Alamat Tujuan"
                        />
                        <textarea
                            name="alamat_tujuan"
                            value={data.alamat_tujuan}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                            rows="2"
                            placeholder="Alamat lengkap..."
                            required
                        ></textarea>
                        <InputError
                            message={errors["form_details.alamat_tujuan"]?.[0]}
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <InputLabel
                            htmlFor="notes"
                            value="Catatan (Opsional)"
                        />
                        <textarea
                            name="notes"
                            value={data.notes}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                            rows="2"
                            placeholder="Info tambahan (misal: lantai 2, gang sempit)"
                        ></textarea>
                    </div>
                </div>
            ) : (
                /* --- [MODIFIKASI] FORM PENITIPAN MODERN --- */
                <div className="space-y-6">
                    {/* Pilihan Metode Penyerahan */}
                    <div>
                        <InputLabel
                            value="Metode Penyerahan Barang"
                            className="mb-2"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <div
                                onClick={() =>
                                    setData((prev) => ({
                                        ...prev,
                                        delivery_method: "drop_off",
                                    }))
                                }
                                className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center text-center transition-all ${
                                    data.delivery_method === "drop_off"
                                        ? "border-green-500 bg-green-50 ring-2 ring-green-500 ring-opacity-20"
                                        : "border-gray-200 hover:border-green-300"
                                }`}
                            >
                                <Box
                                    className={`w-8 h-8 mb-2 ${
                                        data.delivery_method === "drop_off"
                                            ? "text-green-600"
                                            : "text-gray-400"
                                    }`}
                                />
                                <span
                                    className={`font-bold text-sm ${
                                        data.delivery_method === "drop_off"
                                            ? "text-green-700"
                                            : "text-gray-600"
                                    }`}
                                >
                                    Antar Sendiri
                                </span>
                                <span className="text-xs text-gray-500 mt-1">
                                    Saya akan ke lokasi Titipsini
                                </span>
                            </div>
                            <div
                                onClick={() =>
                                    setData((prev) => ({
                                        ...prev,
                                        delivery_method: "pickup",
                                    }))
                                }
                                className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center text-center transition-all ${
                                    data.delivery_method === "pickup"
                                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-opacity-20"
                                        : "border-gray-200 hover:border-blue-300"
                                }`}
                            >
                                <Truck
                                    className={`w-8 h-8 mb-2 ${
                                        data.delivery_method === "pickup"
                                            ? "text-blue-600"
                                            : "text-gray-400"
                                    }`}
                                />
                                <span
                                    className={`font-bold text-sm ${
                                        data.delivery_method === "pickup"
                                            ? "text-blue-700"
                                            : "text-gray-600"
                                    }`}
                                >
                                    Request Jemput
                                </span>
                                <span className="text-xs text-gray-500 mt-1">
                                    Kurir akan mengambil barang
                                </span>
                            </div>
                        </div>
                        <InputError
                            message={
                                errors["form_details.delivery_method"]?.[0]
                            }
                            className="mt-1"
                        />
                    </div>

                    {/* Tanggal Durasi */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <InputLabel
                                htmlFor="start_date"
                                value="Mulai Titip"
                            />
                            <input
                                type="date"
                                name="start_date"
                                value={data.start_date}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 shadow-sm"
                                required
                            />
                            <InputError
                                message={errors["form_details.start_date"]?.[0]}
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="end_date"
                                value="Selesai Titip"
                            />
                            <input
                                type="date"
                                name="end_date"
                                value={data.end_date}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 shadow-sm"
                                required
                            />
                            <InputError
                                message={errors["form_details.end_date"]?.[0]}
                                className="mt-1"
                            />
                        </div>
                    </div>

                    {/* Upload Foto Barang */}
                    <div>
                        <InputLabel
                            htmlFor="item_photo"
                            value="Foto Barang (Opsional)"
                        />
                        <div className="mt-2 flex items-center gap-4">
                            <label className="flex-1 cursor-pointer group">
                                <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl group-hover:border-green-500 transition-colors bg-gray-50">
                                    {photoPreview ? (
                                        <img
                                            src={photoPreview}
                                            alt="Preview"
                                            className="h-full object-contain rounded-lg"
                                        />
                                    ) : (
                                        <div className="text-center p-4">
                                            <Camera className="mx-auto h-8 w-8 text-gray-400 group-hover:text-green-500 transition-colors" />
                                            <span className="mt-2 block text-xs font-medium text-gray-500">
                                                Klik untuk foto barang
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    name="item_photo"
                                    id="item_photo"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>
                        <InputError
                            message={errors["form_details.item_photo"]?.[0]}
                            className="mt-1"
                        />
                    </div>

                    {/* Catatan */}
                    <div>
                        <InputLabel htmlFor="notes" value="Deskripsi Barang" />
                        <textarea
                            name="notes"
                            value={data.notes}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 shadow-sm"
                            rows="2"
                            placeholder="Contoh: 2 Koper Merah, 1 Kardus Buku"
                        ></textarea>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-end mt-8 pt-6 border-t border-gray-100">
                <PrimaryButton
                    disabled={processing}
                    className="w-full sm:w-auto justify-center py-3 text-base font-bold rounded-xl shadow-lg shadow-green-200 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                    Lanjut Pembayaran <ArrowRight className="ml-2 w-4 h-4" />
                </PrimaryButton>
            </div>
        </form>
    );
};

// --- Sub-Komponen: Step 2 & 3 (SAMA SEPERTI SEBELUMNYA) ---
// (Saya sertakan ulang agar file lengkap dan tidak error saat copas)

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
                    alert("Gagal submit pembayaran.");
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
            <section className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Tagihan</span>
                    <span className="font-bold text-2xl text-green-600">
                        {formatRupiah(order.final_amount)}
                    </span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">
                        Transfer ke Rekening BCA:
                    </p>
                    <p className="font-mono font-bold text-lg text-gray-800 bg-white p-2 rounded border inline-block">
                        1234-567-890
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        a/n Titipsini Indonesia
                    </p>
                </div>
            </section>
            <div className="space-y-5">
                <div>
                    <InputLabel
                        htmlFor="payment_proof"
                        value="Upload Bukti Transfer"
                    />
                    <input
                        id="payment_proof"
                        type="file"
                        className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
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
                    <InputLabel
                        htmlFor="notes"
                        value="Catatan Pembayaran (Opsional)"
                    />
                    <textarea
                        id="notes"
                        value={data.notes}
                        className="mt-1 block w-full border-gray-300 rounded-xl"
                        rows="2"
                        onChange={handleNotesChange}
                        placeholder="Contoh: Atas nama Budi"
                    ></textarea>
                </div>
            </div>
            <div className="flex items-center justify-end mt-8 pt-6 border-t border-gray-100">
                <PrimaryButton
                    disabled={processing}
                    className="w-full sm:w-auto justify-center py-3 rounded-xl"
                >
                    Kirim Bukti Bayar
                </PrimaryButton>
            </div>
        </form>
    );
};

const StepSuccess = ({ orderId, initialStatus, onClose }) => {
    const [status, setStatus] = useState(initialStatus);
    useEffect(() => {
        if (status !== "awaiting_verification") return;
        const interval = setInterval(() => {
            axios
                .get(route("order.status", orderId))
                .then((response) => {
                    const newStatus = response.data.status;
                    if (newStatus !== "awaiting_verification") {
                        setStatus(newStatus);
                        clearInterval(interval);
                    }
                })
                .catch(() => clearInterval(interval));
        }, 3000);
        return () => clearInterval(interval);
    }, [status, orderId]);

    if (status === "awaiting_verification") {
        return (
            <div className="p-8 text-center">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <Clock className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                    Pembayaran Diterima
                </h3>
                <p className="mt-2 text-gray-600">
                    Mohon tunggu, admin sedang memverifikasi bukti pembayaran
                    Anda.
                </p>
                <div className="mt-8">
                    <PrimaryButton onClick={onClose} className="bg-gray-600">
                        Tutup
                    </PrimaryButton>
                </div>
            </div>
        );
    } else {
        const isApproved =
            status === "processing" ||
            status === "completed" ||
            status === "ready_for_pickup";
        return (
            <div className="p-8 text-center">
                {isApproved ? (
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                ) : (
                    <X className="w-20 h-20 text-red-500 mx-auto mb-6" />
                )}
                <h3 className="text-2xl font-bold text-gray-900">
                    {isApproved ? "Pesanan Disetujui!" : "Pembayaran Ditolak"}
                </h3>
                <p className="mt-2 text-gray-600">
                    {isApproved
                        ? "Terima kasih! Pesanan Anda sedang diproses."
                        : "Bukti pembayaran Anda tidak valid."}
                </p>
                <div className="mt-8">
                    <PrimaryButton onClick={onClose}>Selesai</PrimaryButton>
                </div>
            </div>
        );
    }
};

export default function OrderModal({ show, onClose, product, productType }) {
    const [step, setStep] = useState("loading");
    const [productData, setProductData] = useState(null);
    const [orderData, setOrderData] = useState(null);
    const [orderStatus, setOrderStatus] = useState(null);

    useEffect(() => {
        if (show && product) {
            setStep("loading");
            const type =
                productType === "moving_package" ? "moving_package" : "service";
            axios
                .get(route("order.create", { type: type, id: product.id }))
                .then((response) => {
                    setProductData({
                        product: response.data.product,
                        productModelClass: response.data.productModelClass,
                    });
                    setStep("form");
                })
                .catch((error) => {
                    alert("Gagal memuat data.");
                    onClose();
                });
        }
    }, [show, product, productType]);

    const handleFormSubmit = (newOrderData) => {
        setOrderData(newOrderData);
        setStep("payment");
    };
    const handlePaymentSubmit = (newOrderStatus) => {
        setOrderStatus(newOrderStatus);
        setStep("success");
    };

    const renderStep = () => {
        switch (step) {
            case "form":
                return productData ? (
                    <StepForm
                        product={productData.product}
                        productModelClass={productData.productModelClass}
                        onFormSubmit={handleFormSubmit}
                    />
                ) : (
                    <StepLoading />
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
                    <StepSuccess
                        orderId={orderData.id}
                        initialStatus={orderStatus}
                        onClose={onClose}
                    />
                );
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
