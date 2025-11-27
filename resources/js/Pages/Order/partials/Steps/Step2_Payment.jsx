import React, { useState, useEffect } from "react";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import axios from "axios";
import {
    CreditCard,
    Copy,
    CheckCircle2,
    UploadCloud,
    FileText,
    ArrowRight,
    Wallet,
} from "lucide-react";

// Helper Format Rupiah
const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(number || 0);
};

export default function StepPayment({ order, onPaymentSubmit }) {
    const [data, setData] = useState({ payment_proof: null, notes: "" });
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [preview, setPreview] = useState(null);
    const [copied, setCopied] = useState(false);

    // Dummy Bank Data (Nanti bisa diambil dari props/backend)
    const bankDetails = {
        bank: "BCA",
        number: "1234567890",
        name: "Titipsini Indonesia",
    };

    // Debugging: Cek apakah data order masuk
    useEffect(() => {
        console.log("Step 2 Loaded. Order Data:", order);
    }, [order]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData((prev) => ({ ...prev, payment_proof: file }));
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleNotesChange = (e) =>
        setData((prev) => ({ ...prev, notes: e.target.value }));

    const copyToClipboard = () => {
        navigator.clipboard.writeText(bankDetails.number);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const submit = (e) => {
        e.preventDefault();

        // Validasi Pre-Flight: Pastikan Order ID ada
        if (!order || !order.id) {
            alert(
                "Terjadi kesalahan: Data Order ID tidak ditemukan. Silakan refresh halaman."
            );
            return;
        }

        setProcessing(true);
        setErrors({});

        const formData = new FormData();

        // [PERBAIKAN UTAMA]
        // Hanya append jika file benar-benar ada (bukan string kosong)
        if (data.payment_proof) {
            formData.append("payment_proof", data.payment_proof);
        }

        formData.append("notes", data.notes || "");

        // Opsional: Jika backend Anda menggunakan method POST murni untuk upload,
        // baris '_method' di bawah ini TIDAK DIPERLUKAN.
        // Namun jika route Anda adalah PUT/PATCH, aktifkan baris ini:
        // formData.append("_method", "PUT");

        axios
            .post(route("order.submitPayment", order.id), formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((response) => {
                // Panggil callback ke parent
                onPaymentSubmit(response.data.orderStatus);
            })
            .catch((error) => {
                console.error("Payment Submit Error:", error);

                if (error.response?.status === 422) {
                    setErrors(error.response.data.errors);
                } else {
                    alert(
                        "Gagal submit pembayaran. Silakan coba lagi atau cek koneksi."
                    );
                }
            })
            .finally(() => setProcessing(false));
    };

    // Pastikan order ada sebelum render komponen utama untuk menghindari crash
    if (!order) {
        return (
            <div className="p-8 text-center text-gray-500">
                Memuat data pesanan...
            </div>
        );
    }

    return (
        <form onSubmit={submit} className="p-6 md:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                        Pembayaran
                    </h2>
                    <p className="text-sm text-gray-500">
                        Selesaikan pembayaran untuk memproses pesanan
                    </p>
                </div>
                <div className="px-4 py-1.5 bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                    Step 2/3
                </div>
            </div>

            {/* Total Bill Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full blur-3xl opacity-20 -mt-10 -mr-10"></div>
                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">
                            Total Tagihan
                        </p>
                        <h3 className="text-3xl font-black text-emerald-400 tracking-tight">
                            {formatRupiah(order.final_amount)}
                        </h3>
                    </div>
                    <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                        <Wallet className="w-8 h-8 text-emerald-400" />
                    </div>
                </div>
            </div>

            {/* Bank Info Section */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="w-5 h-5 text-gray-500" />
                    <h4 className="font-bold text-gray-800">Transfer Manual</h4>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-dashed border-gray-300 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-center sm:text-left">
                        <p className="text-xs text-gray-500 font-bold uppercase">
                            Bank {bankDetails.bank}
                        </p>
                        <div className="flex items-center gap-2 justify-center sm:justify-start">
                            <p className="text-xl font-mono font-bold text-gray-900 tracking-wider">
                                {bankDetails.number}
                            </p>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                            a/n {bankDetails.name}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={copyToClipboard}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                            copied
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                        {copied ? (
                            <>
                                <CheckCircle2 className="w-4 h-4" /> Disalin!
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4" /> Salin No. Rek
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Upload & Notes Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Upload Area */}
                <div className="space-y-2">
                    <InputLabel value="Upload Bukti Transfer" />
                    <label
                        className={`group flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-all overflow-hidden relative ${
                            errors.payment_proof
                                ? "border-red-300 bg-red-50"
                                : "border-gray-300 bg-gray-50 hover:bg-blue-50 hover:border-blue-400"
                        }`}
                    >
                        {preview ? (
                            <>
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-full h-full object-cover opacity-90"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white text-sm font-bold bg-black/50 px-3 py-1 rounded-full">
                                        Ganti File
                                    </span>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                                <UploadCloud className="w-8 h-8 text-gray-400 mb-2 group-hover:text-blue-500 transition-colors" />
                                <p className="mb-1 text-sm text-gray-500 font-medium">
                                    Klik untuk upload bukti
                                </p>
                                <p className="text-xs text-gray-400">
                                    JPG, PNG, PDF (Max 2MB)
                                </p>
                            </div>
                        )}
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*,application/pdf"
                            onChange={handleFileChange}
                        />
                    </label>
                    <InputError message={errors.payment_proof?.[0]} />
                </div>

                {/* Notes Area */}
                <div className="space-y-2">
                    <InputLabel htmlFor="notes" value="Catatan (Opsional)" />
                    <div className="relative">
                        <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <textarea
                            id="notes"
                            value={data.notes}
                            className="pl-10 block w-full border-gray-200 rounded-2xl focus:ring-emerald-500 focus:border-emerald-500 min-h-[160px] text-sm bg-gray-50"
                            rows="4"
                            onChange={handleNotesChange}
                            placeholder="Contoh: Transfer atas nama Budi, mohon segera diproses."
                        ></textarea>
                    </div>
                </div>
            </div>

            {/* Footer Action */}
            <div className="pt-4 border-t border-gray-100">
                <PrimaryButton
                    disabled={processing}
                    className="w-full justify-center py-4 text-base font-bold rounded-xl shadow-lg shadow-emerald-200 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transform hover:-translate-y-1 transition-all"
                >
                    {processing ? (
                        "Memproses Pembayaran..."
                    ) : (
                        <span className="flex items-center">
                            Konfirmasi Pembayaran{" "}
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </span>
                    )}
                </PrimaryButton>
            </div>
        </form>
    );
}
