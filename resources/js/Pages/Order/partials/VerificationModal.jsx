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
} from "lucide-react";
import axios from "axios"; // [PENTING] Import Axios

export default function VerificationModal({
    show,
    onClose,
    status,
    verificationData,
    onVerificationSuccess,
}) {
    // State tampilan: 'form', 'pending', atau 'success'
    const [view, setView] = useState("form");

    // Sinkronisasi state dengan props 'status'
    useEffect(() => {
        if (status === "approved") {
            setView("success"); // Jika dibuka saat sudah approved (jarang terjadi, tapi jaga-jaga)
        } else if (status === "pending") {
            setView("pending");
        } else {
            setView("form");
        }
    }, [status, show]);

    // [BARU] Logika Polling saat status 'pending'
    useEffect(() => {
        let interval = null;

        if (show && view === "pending") {
            interval = setInterval(() => {
                axios
                    .get(route("verification.check_status"))
                    .then((res) => {
                        if (res.data.status === "approved") {
                            // 1. Ubah tampilan jadi Centang Hijau
                            setView("success");

                            // 2. Tunggu 1.5 detik, lalu panggil callback parent
                            setTimeout(() => {
                                if (onVerificationSuccess) {
                                    onVerificationSuccess(); // <-- INI KUNCINYA
                                }
                            }, 1500);
                        } else if (res.data.status === "rejected") {
                            // Jika ditolak, reload halaman agar data rejection terambil (atau handle manual)
                            window.location.reload();
                        }
                    })
                    .catch((err) => console.error("Polling error:", err));
            }, 3000); // Cek setiap 3 detik
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [show, view]);

    // Setup Form
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            legal_name: verificationData?.legal_name || "",
            id_card_type: verificationData?.id_card_type || "KTP",
            id_card_number: verificationData?.id_card_number || "",
            address_on_id: verificationData?.address_on_id || "",
            gender: verificationData?.gender || "laki-laki",
            id_card_path: null,
        });

    const handleFileChange = (e) => {
        setData("id_card_path", e.target.files[0]);
    };

    const submit = (e) => {
        e.preventDefault();
        clearErrors();
        post(route("verification.store"), {
            preserveScroll: true,
            onSuccess: () => {
                setView("pending"); // Pindah ke tampilan pending & mulai polling
                reset();
            },
        });
    };

    // --- TAMPILAN 1: SUKSES (TRANSISI) ---
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
                    {/* Form fields (Sama persis seperti sebelumnya) */}
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

                    <div>
                        <InputLabel
                            htmlFor="id_card_number"
                            value="Nomor Identitas (NIK / No. SIM)"
                        />
                        <TextInput
                            id="id_card_number"
                            value={data.id_card_number}
                            onChange={(e) =>
                                setData("id_card_number", e.target.value)
                            }
                            className="mt-1 block w-full"
                            placeholder="Contoh: 3201234567890001"
                            required
                        />
                        <InputError
                            message={errors.id_card_number}
                            className="mt-2"
                        />
                    </div>

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

                    <div>
                        <InputLabel
                            htmlFor="id_card_path"
                            value="Foto KTP/SIM"
                        />
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-green-500 transition-colors bg-gray-50">
                            <div className="space-y-1 text-center">
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600 justify-center">
                                    <label
                                        htmlFor="id_card_path"
                                        className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none"
                                    >
                                        <span>Upload file</span>
                                        <input
                                            id="id_card_path"
                                            type="file"
                                            className="sr-only"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            required={!verificationData}
                                        />
                                    </label>
                                    <p className="pl-1">atau drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                    PNG, JPG, GIF up to 2MB
                                </p>
                                {data.id_card_path && (
                                    <p className="text-sm text-green-600 font-semibold mt-2">
                                        File terpilih: {data.id_card_path.name}
                                    </p>
                                )}
                            </div>
                        </div>
                        <InputError
                            message={errors.id_card_path}
                            className="mt-2"
                        />
                    </div>

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
