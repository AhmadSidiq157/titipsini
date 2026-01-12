import React, { useState, useEffect } from "react";
import Modal from "@/Components/Modal";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { useForm } from "@inertiajs/react";
import {
    Clock,
    FileText,
    User,
    MapPin,
    Upload,
    AlertCircle,
    CheckCircle,
    Phone,
    X,
    ImageIcon,
} from "lucide-react";
import axios from "axios";

export default function VerificationModal({
    show,
    onClose,
    status,
    verificationData,
    onVerificationSuccess,
}) {
    const [view, setView] = useState("form");

    // State untuk menyimpan URL preview gambar
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        if (status === "approved") {
            setView("success");
        } else if (status === "pending") {
            setView("pending");
        } else {
            setView("form");
        }
    }, [status, show]);

    // Cleanup memory saat komponen unmount atau preview berubah
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    useEffect(() => {
        let interval = null;
        if (show && view === "pending") {
            interval = setInterval(() => {
                axios
                    .get(route("verification.check_status"))
                    .then((res) => {
                        if (res.data.status === "approved") {
                            setView("success");
                            setTimeout(() => {
                                if (onVerificationSuccess) {
                                    onVerificationSuccess();
                                }
                            }, 1500);
                        } else if (res.data.status === "rejected") {
                            window.location.reload();
                        }
                    })
                    .catch((err) => console.error("Polling error:", err));
            }, 3000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [show, view]);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            legal_name: verificationData?.legal_name || "",
            id_card_type: verificationData?.id_card_type || "KTP",
            id_card_number: verificationData?.id_card_number || "",
            phone: verificationData?.phone || "",
            address_on_id: verificationData?.address_on_id || "",
            gender: verificationData?.gender || "laki-laki",
            id_card_path: null,
        });

    // Logic saat file dipilih untuk generate preview
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("id_card_path", file);
            // Buat URL sementara untuk preview
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    // Fungsi untuk menghapus gambar yang dipilih
    const removeImage = () => {
        setData("id_card_path", null);
        setPreviewUrl(null);
        // Reset value input file agar bisa pilih file yang sama lagi jika mau
        const fileInput = document.getElementById("id_card_path");
        if (fileInput) fileInput.value = "";
    };

    const submit = (e) => {
        e.preventDefault();
        clearErrors();
        post(route("verification.store"), {
            preserveScroll: true,
            onSuccess: () => {
                setView("pending");
                setPreviewUrl(null);
                reset();
            },
        });
    };

    // --- TAMPILAN 1: SUKSES ---
    if (view === "success") {
        return (
            <Modal show={show} onClose={() => {}} maxWidth="sm">
                <div className="p-8 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-green-700 mb-2">
                        Verifikasi Berhasil!
                    </h2>
                    <p className="text-gray-600">Mengarahkan ke pemesanan...</p>
                </div>
            </Modal>
        );
    }

    // --- TAMPILAN 2: MENUNGGU (PENDING) ---
    if (view === "pending") {
        return (
            <Modal show={show} onClose={onClose} maxWidth="md">
                <div className="p-8 text-center">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Clock className="w-10 h-10 text-blue-600 animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Menunggu Verifikasi
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Admin sedang meninjau data Anda. <br />
                        <span className="font-semibold text-blue-600">
                            Halaman ini akan otomatis tertutup saat disetujui.
                        </span>
                    </p>
                    <div className="flex justify-center">
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 underline text-sm"
                        >
                            Tutup & Tunggu Nanti
                        </button>
                    </div>
                </div>
            </Modal>
        );
    }

    // --- TAMPILAN 3: FORMULIR ---
    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <div className="p-6 md:p-8">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                        <FileText className="w-6 h-6 mr-2 text-green-600" />
                        Verifikasi Data Diri
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Mohon lengkapi data sesuai KTP/SIM untuk melanjutkan
                        pemesanan.
                    </p>
                </div>

                {status === "rejected" && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-start">
                        <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                            <h4 className="font-bold text-red-800 text-sm">
                                Verifikasi Ditolak
                            </h4>
                            <p className="text-sm text-red-700 mt-1">
                                Alasan:{" "}
                                {verificationData?.rejection_notes ||
                                    "Data tidak valid."}
                            </p>
                        </div>
                    </div>
                )}

                <form onSubmit={submit} className="space-y-5">
                    {/* Nama Lengkap */}
                    <div>
                        <InputLabel
                            htmlFor="legal_name"
                            value="Nama Lengkap (Sesuai Identitas)"
                        />
                        <div className="relative mt-1">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <User className="h-4 w-4 text-gray-400" />
                            </span>
                            <TextInput
                                id="legal_name"
                                value={data.legal_name}
                                onChange={(e) =>
                                    setData("legal_name", e.target.value)
                                }
                                className="pl-9 block w-full"
                                placeholder="Nama lengkap Anda"
                                required
                            />
                        </div>
                        <InputError
                            message={errors.legal_name}
                            className="mt-2"
                        />
                    </div>

                    {/* Jenis Identitas & Kelamin */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <InputLabel
                                htmlFor="id_card_type"
                                value="Jenis Identitas"
                            />
                            <select
                                id="id_card_type"
                                value={data.id_card_type}
                                onChange={(e) =>
                                    setData("id_card_type", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-md shadow-sm"
                            >
                                <option value="KTP">KTP</option>
                                <option value="SIM">SIM</option>
                                <option value="Passport">Passport</option>
                            </select>
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="gender"
                                value="Jenis Kelamin"
                            />
                            <select
                                id="gender"
                                value={data.gender}
                                onChange={(e) =>
                                    setData("gender", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-md shadow-sm"
                            >
                                <option value="laki-laki">Laki-laki</option>
                                <option value="perempuan">Perempuan</option>
                            </select>
                        </div>
                    </div>

                    {/* Nomor Identitas & Telepon */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <InputLabel
                                htmlFor="id_card_number"
                                value="Nomor Identitas (NIK / SIM)"
                            />
                            <TextInput
                                id="id_card_number"
                                value={data.id_card_number}
                                onChange={(e) =>
                                    setData("id_card_number", e.target.value)
                                }
                                className="mt-1 block w-full"
                                placeholder="Contoh: 320123..."
                                required
                            />
                            <InputError
                                message={errors.id_card_number}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="phone"
                                value="Nomor Telepon / WhatsApp"
                            />
                            <div className="relative mt-1">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                </span>
                                <TextInput
                                    id="phone"
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) =>
                                        setData("phone", e.target.value)
                                    }
                                    className="pl-9 block w-full"
                                    placeholder="0812..."
                                    required
                                />
                            </div>
                            <InputError
                                message={errors.phone}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    {/* Alamat */}
                    <div>
                        <InputLabel
                            htmlFor="address_on_id"
                            value="Alamat (Sesuai Identitas)"
                        />
                        <div className="relative mt-1">
                            <span className="absolute top-3 left-3">
                                <MapPin className="h-4 w-4 text-gray-400" />
                            </span>
                            <textarea
                                id="address_on_id"
                                value={data.address_on_id}
                                onChange={(e) =>
                                    setData("address_on_id", e.target.value)
                                }
                                className="pl-9 mt-1 block w-full border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-md shadow-sm"
                                rows="2"
                                required
                            ></textarea>
                        </div>
                        <InputError
                            message={errors.address_on_id}
                            className="mt-2"
                        />
                    </div>

                    {/* Foto KTP dengan Preview */}
                    <div>
                        <InputLabel
                            htmlFor="id_card_path"
                            value="Foto KTP/SIM"
                        />

                        {/* Jika ada preview gambar, tampilkan gambar. Jika tidak, tampilkan kotak upload */}
                        {previewUrl ? (
                            <div className="mt-2 relative group w-full h-48 bg-gray-100 rounded-lg border-2 border-green-500 overflow-hidden shadow-sm">
                                <img
                                    src={previewUrl}
                                    alt="Preview KTP"
                                    className="w-full h-full object-contain"
                                />
                                {/* Overlay Gelap saat hover */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all transform hover:scale-110 shadow-lg"
                                        title="Hapus foto"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow">
                                    Terpilih
                                </div>
                            </div>
                        ) : (
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-green-500 transition-colors bg-gray-50 hover:bg-green-50/30">
                                <div className="space-y-1 text-center">
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600 justify-center">
                                        <label
                                            htmlFor="id_card_path"
                                            className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                        >
                                            <span className="px-2">
                                                Upload file
                                            </span>
                                            <input
                                                id="id_card_path"
                                                type="file"
                                                className="sr-only"
                                                onChange={handleFileChange}
                                                accept="image/*"
                                                required={!verificationData}
                                            />
                                        </label>
                                        <p className="pl-1">
                                            atau drag and drop
                                        </p>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        PNG, JPG, GIF up to 2MB
                                    </p>
                                </div>
                            </div>
                        )}

                        <InputError
                            message={errors.id_card_path}
                            className="mt-2"
                        />
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50"
                            disabled={processing}
                        >
                            Batal
                        </button>
                        <PrimaryButton
                            disabled={processing}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {processing ? "Mengirim..." : "Kirim Data"}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
