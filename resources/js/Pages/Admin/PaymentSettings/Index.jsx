import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, router } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import InputError from "@/Components/InputError";
import {
    CreditCard,
    Save,
    Wallet,
    User,
    FileText,
    QrCode,
    Upload,
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

export default function PaymentSettings({ auth, settings }) {
    const { data, setData, post, processing, errors } = useForm({
        payment_bank_name: settings.payment_bank_name || "",
        payment_account_number: settings.payment_account_number || "",
        payment_account_holder: settings.payment_account_holder || "",
        payment_instruction: settings.payment_instruction || "",
        payment_qris_image: null,
    });

    // State untuk preview gambar baru
    const [preview, setPreview] = useState(null);
    // URL gambar lama dari database
    const currentQrisUrl = settings.payment_qris_image
        ? `/storage/${settings.payment_qris_image}`
        : null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("payment_qris_image", file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();

        // Gunakan router.post agar support upload file (FormData) otomatis via Inertia
        router.post(
            route("admin.payment_settings.update"),
            {
                _method: "post",
                ...data,
            },
            {
                preserveScroll: true,
                forceFormData: true, // Wajib true untuk upload file
                onSuccess: () => {
                    toast.success("Data pembayaran & QRIS disimpan!");
                    setPreview(null); // Reset preview
                },
                onError: () => toast.error("Gagal menyimpan data."),
            }
        );
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800">
                    Pengaturan Pembayaran
                </h2>
            }
        >
            <Head title="Atur Pembayaran" />
            <Toaster position="top-center" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-3xl border border-gray-100">
                        <div className="p-8">
                            <form onSubmit={submit} className="space-y-8">
                                {/* --- SECTION 1: TRANSFER BANK --- */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Wallet className="w-5 h-5 text-emerald-600" />{" "}
                                        Transfer Bank Manual
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div>
                                            <InputLabel value="Nama Bank" />
                                            <TextInput
                                                value={data.payment_bank_name}
                                                onChange={(e) =>
                                                    setData(
                                                        "payment_bank_name",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full"
                                                placeholder="Contoh: BCA"
                                            />
                                            <InputError
                                                message={
                                                    errors.payment_bank_name
                                                }
                                                className="mt-2"
                                            />
                                        </div>
                                        <div>
                                            <InputLabel value="Nomor Rekening" />
                                            <TextInput
                                                value={
                                                    data.payment_account_number
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "payment_account_number",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full font-mono"
                                                placeholder="1234567890"
                                            />
                                            <InputError
                                                message={
                                                    errors.payment_account_number
                                                }
                                                className="mt-2"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <InputLabel value="Atas Nama" />
                                            <TextInput
                                                value={
                                                    data.payment_account_holder
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "payment_account_holder",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full"
                                                placeholder="PT Titip Sini"
                                            />
                                            <InputError
                                                message={
                                                    errors.payment_account_holder
                                                }
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* --- SECTION 2: QRIS  --- */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <QrCode className="w-5 h-5 text-blue-600" />{" "}
                                        QRIS Code
                                    </h3>
                                    <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
                                        <InputLabel value="Upload Gambar QRIS (Opsional)" />

                                        <div className="mt-2 flex flex-col md:flex-row items-start gap-6">
                                            {/* Preview Image */}
                                            <div className="w-40 h-40 bg-white rounded-xl border-2 border-dashed border-blue-300 flex items-center justify-center overflow-hidden relative">
                                                {preview ? (
                                                    <img
                                                        src={preview}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : currentQrisUrl ? (
                                                    <img
                                                        src={currentQrisUrl}
                                                        alt="Current QRIS"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="text-center text-gray-400 p-2">
                                                        <QrCode className="w-8 h-8 mx-auto mb-1" />
                                                        <span className="text-xs">
                                                            Belum ada QRIS
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Input File */}
                                            <div className="flex-1">
                                                <label className="block w-full">
                                                    <span className="sr-only">
                                                        Choose profile photo
                                                    </span>
                                                    <input
                                                        type="file"
                                                        onChange={
                                                            handleFileChange
                                                        }
                                                        accept="image/*"
                                                        className="block w-full text-sm text-gray-500
                                                        file:mr-4 file:py-2 file:px-4
                                                        file:rounded-full file:border-0
                                                        file:text-sm file:font-semibold
                                                        file:bg-blue-100 file:text-blue-700
                                                        hover:file:bg-blue-200 cursor-pointer"
                                                    />
                                                </label>
                                                <p className="mt-2 text-xs text-gray-500">
                                                    Upload gambar QRIS terbaru
                                                    dari penyedia layanan
                                                    pembayaran Anda. Format:
                                                    JPG, PNG, WEBP (Max 2MB).
                                                </p>
                                                <InputError
                                                    message={
                                                        errors.payment_qris_image
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* --- SECTION 3: INSTRUKSI --- */}
                                <div>
                                    <InputLabel value="Instruksi Pembayaran" />
                                    <textarea
                                        value={data.payment_instruction}
                                        onChange={(e) =>
                                            setData(
                                                "payment_instruction",
                                                e.target.value
                                            )
                                        }
                                        className="mt-1 block w-full border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl shadow-sm"
                                        rows="3"
                                    ></textarea>
                                </div>

                                <div className="flex justify-end pt-4 border-t border-gray-100">
                                    <PrimaryButton
                                        disabled={processing}
                                        className="px-8 py-3 bg-gray-900 hover:bg-black rounded-xl"
                                    >
                                        <Save className="w-5 h-5 mr-2" /> Simpan
                                        Semua Pengaturan
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
