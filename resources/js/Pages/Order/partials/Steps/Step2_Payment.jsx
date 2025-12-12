import React, { useState } from "react";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import axios from "axios";
import { usePage } from "@inertiajs/react";
import {
    CreditCard,
    Copy,
    CheckCircle2,
    UploadCloud,
    FileText,
    ArrowRight,
    Wallet,
    QrCode, // Icon QRIS
    Download,
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
    const { settings } = usePage().props;

    // Data Bank & QRIS
    const bankInfo = {
        bankName: settings.payment_bank_name || "Bank Transfer",
        accNumber: settings.payment_account_number || "-",
        accHolder: settings.payment_account_holder || "Admin",
        instruction:
            settings.payment_instruction || "Silakan lakukan pembayaran.",
        qrisImage: settings.payment_qris_image
            ? `/storage/${settings.payment_qris_image}`
            : null,
    };

    // State Tab: 'bank' atau 'qris'
    const [method, setMethod] = useState("bank");

    const [data, setData] = useState({ payment_proof: null, notes: "" });
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [preview, setPreview] = useState(null);
    const [copied, setCopied] = useState(false);

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
        const textToCopy = bankInfo.accNumber.replace(/[^0-9]/g, "");
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const submit = (e) => {
        e.preventDefault();
        if (!order || !order.id) return;

        setProcessing(true);
        setErrors({});

        const formData = new FormData();
        if (data.payment_proof)
            formData.append("payment_proof", data.payment_proof);
        formData.append("notes", data.notes || "");

        axios
            .post(route("order.submitPayment", order.id), formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((response) => {
                if (onPaymentSubmit) onPaymentSubmit(response.data.orderStatus);
            })
            .catch((error) => {
                if (error.response?.status === 422)
                    setErrors(error.response.data.errors);
                else alert("Gagal submit pembayaran.");
            })
            .finally(() => setProcessing(false));
    };

    if (!order)
        return <div className="p-8 text-center text-gray-500">Loading...</div>;

    return (
        <form onSubmit={submit} className="p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                        Pembayaran
                    </h2>
                    <p className="text-sm text-gray-500">
                        Pilih metode dan selesaikan pembayaran
                    </p>
                </div>
                <div className="px-4 py-1.5 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                    Step 2/3
                </div>
            </div>

            {/* Total Tagihan */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 shadow-xl">
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

            {/* Pilihan Metode Pembayaran (Tabs) */}
            <div className="flex p-1 bg-gray-100 rounded-xl">
                <button
                    type="button"
                    onClick={() => setMethod("bank")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
                        method === "bank"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                    <CreditCard size={18} /> Transfer Bank
                </button>
                <button
                    type="button"
                    onClick={() => setMethod("qris")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
                        method === "qris"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                    <QrCode size={18} /> QRIS Code
                </button>
            </div>

            {/* Konten Metode Pembayaran */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm min-h-[200px]">
                {method === "bank" ? (
                    // TAMPILAN BANK
                    <div className="space-y-4 animate-fade-in">
                        <div className="bg-gray-50 rounded-xl p-4 border border-dashed border-gray-300 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="text-center sm:text-left">
                                <p className="text-xs text-gray-500 font-bold uppercase">
                                    {bankInfo.bankName}
                                </p>
                                <p className="text-xl font-mono font-bold text-gray-900 tracking-wider my-1">
                                    {bankInfo.accNumber}
                                </p>
                                <p className="text-xs text-gray-400">
                                    a/n {bankInfo.accHolder}
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
                                        <CheckCircle2 className="w-4 h-4" />{" "}
                                        Disalin!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" /> Salin
                                    </>
                                )}
                            </button>
                        </div>
                        <p className="text-xs text-center text-gray-500">
                            {bankInfo.instruction}
                        </p>
                    </div>
                ) : (
                    // TAMPILAN QRIS
                    <div className="flex flex-col items-center animate-fade-in space-y-4">
                        {bankInfo.qrisImage ? (
                            <>
                                <div className="p-4 bg-white border-2 border-gray-900 rounded-2xl shadow-lg">
                                    <img
                                        src={bankInfo.qrisImage}
                                        alt="QRIS Code"
                                        className="w-48 h-48 object-contain"
                                    />
                                </div>
                                <p className="text-sm text-gray-600 font-medium text-center px-4">
                                    Scan QRIS di atas menggunakan aplikasi
                                    E-Wallet atau Mobile Banking Anda.
                                </p>
                                <a
                                    href={bankInfo.qrisImage}
                                    download
                                    className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                                >
                                    <Download size={12} /> Download QRIS
                                </a>
                            </>
                        ) : (
                            <div className="text-center py-10 text-gray-400">
                                <QrCode
                                    size={48}
                                    className="mx-auto mb-2 opacity-50"
                                />
                                <p>QRIS belum tersedia.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Upload & Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <InputLabel value="Upload Bukti Pembayaran" />
                    <label
                        className={`group flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-all relative ${
                            errors.payment_proof
                                ? "border-red-300 bg-red-50"
                                : "border-gray-300 bg-gray-50 hover:bg-blue-50"
                        }`}
                    >
                        {preview ? (
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-full h-full object-cover rounded-2xl opacity-90"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                                <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500">
                                    Klik untuk upload bukti
                                </p>
                            </div>
                        )}
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </label>
                    <InputError message={errors.payment_proof?.[0]} />
                </div>
                <div className="space-y-2">
                    <InputLabel htmlFor="notes" value="Catatan" />
                    <textarea
                        id="notes"
                        value={data.notes}
                        className="block w-full border-gray-200 rounded-2xl min-h-[160px] text-sm bg-gray-50"
                        onChange={handleNotesChange}
                        placeholder="Catatan tambahan..."
                    ></textarea>
                </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
                <PrimaryButton
                    disabled={processing}
                    className="w-full justify-center py-4 text-base font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700"
                >
                    {processing ? (
                        "Memproses..."
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
