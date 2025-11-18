import React, { useEffect, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";

// [MODIFIKASI] Hapus GuestLayout, kita buat layout sendiri
// import GuestLayout from "@/Layouts/GuestLayout";

// Import komponen (sudah benar semua)
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
// [MODIFIKASI] Checkbox tidak dipakai di register, hapus saja
// import Checkbox from "@/Components/Checkbox";

// [BARU] Import ikon-ikon yang dibutuhkan
import { Mail, Lock, User, Truck, FileText, Tag, Camera } from "lucide-react";

export default function Register() {
    const { data, setData, post, processing, errors, progress, reset } =
        useForm({
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
            vehicle_brand: "",
            vehicle_model: "",
            plat_nomor: "",
            no_bpkb: "",
            no_sim: "",
            foto_ktp: null,
            foto_sim: null,
            foto_stnk: null,
            foto_kendaraan: null,
        });

    const [preview, setPreview] = useState({
        foto_ktp: null,
        foto_sim: null,
        foto_stnk: null,
        foto_kendaraan: null,
    });

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    const handleImageUpload = (e, id) => {
        const file = e.target.files[0];
        if (!file) return;

        setData(id, file);
        setPreview((prev) => ({
            ...prev,
            [id]: URL.createObjectURL(file),
        }));
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("courier.register.store"), { forceFormData: true });
    };

    const uploadFields = [
        ["foto_ktp", "Foto KTP"],
        ["foto_sim", "Foto SIM"],
        ["foto_stnk", "Foto STNK"],
        ["foto_kendaraan", "Foto Kendaraan (Nampak Plat Nomor)"],
    ];

    return (
        // [MODIFIKASI] Layout satu halaman penuh (sama seperti Login)
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center py-12 px-4 antialiased">
            <Head title="Register Kurir" />

            {/* [BARU] Branding Logo (sama seperti Login) */}
            <div className="mb-6 text-center">
                <div href="/" className="text-4xl font-bold text-gray-800">
                    Titipsini<span className="text-green-500">.com</span>
                </div>
                <p className="text-lg text-gray-600 mt-1">
                    Pendaftaran Partner Kurir
                </p>
            </div>

            {/* [MODIFIKASI] Kartu Register yang Modern */}
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden border-t-4 border-green-500">
                <div className="p-6 sm:p-8">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                        Buat Akun Anda
                    </h2>
                    <p className="text-center text-gray-500 mt-2 mb-8 text-sm">
                        Isi data Anda dengan lengkap untuk proses verifikasi.
                    </p>

                    <form onSubmit={submit} className="space-y-6">
                        {/* --- DATA AKUN --- */}
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                            Data Akun
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* [MODIFIKASI] Input Nama dengan Ikon */}
                            <div>
                                <InputLabel
                                    htmlFor="name"
                                    value="Nama Lengkap"
                                    className="font-semibold text-gray-700"
                                />
                                <div className="relative mt-1">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </span>
                                    <TextInput
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        className="mt-1 block w-full pl-10 pr-3 py-2.5 rounded-md"
                                        isFocused={true}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            {/* [MODIFIKASI] Input Email dengan Ikon */}
                            <div>
                                <InputLabel
                                    htmlFor="email"
                                    value="Email"
                                    className="font-semibold text-gray-700"
                                />
                                <div className="relative mt-1">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </span>
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="mt-1 block w-full pl-10 pr-3 py-2.5 rounded-md"
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        {/* [MODIFIKASI] Input Password dengan Ikon */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputLabel
                                    htmlFor="password"
                                    value="Password"
                                    className="font-semibold text-gray-700"
                                />
                                <div className="relative mt-1">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </span>
                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="mt-1 block w-full pl-10 pr-3 py-2.5 rounded-md"
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <InputError
                                    message={errors.password}
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="password_confirmation"
                                    value="Konfirmasi Password"
                                    className="font-semibold text-gray-700"
                                />
                                <div className="relative mt-1">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </span>
                                    <TextInput
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className="mt-1 block w-full pl-10 pr-3 py-2.5 rounded-md"
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                </div>
                                <InputError
                                    message={errors.password_confirmation}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        {/* --- DATA KENDARAAN --- */}
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 pt-4">
                            Data Kendaraan & Dokumen
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* [MODIFIKASI] Input Kendaraan dengan Ikon */}
                            <div>
                                <InputLabel
                                    htmlFor="vehicle_brand"
                                    value="Merek Kendaraan"
                                    className="font-semibold text-gray-700"
                                />
                                <div className="relative mt-1">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Truck className="h-5 w-5 text-gray-400" />
                                    </span>
                                    <TextInput
                                        id="vehicle_brand"
                                        value={data.vehicle_brand}
                                        className="mt-1 block w-full pl-10 pr-3 py-2.5 rounded-md"
                                        onChange={(e) =>
                                            setData(
                                                "vehicle_brand",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                </div>
                                <InputError
                                    message={errors.vehicle_brand}
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="vehicle_model"
                                    value="Model Kendaraan"
                                    className="font-semibold text-gray-700"
                                />
                                <div className="relative mt-1">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Truck className="h-5 w-5 text-gray-400" />
                                    </span>
                                    <TextInput
                                        id="vehicle_model"
                                        value={data.vehicle_model}
                                        className="mt-1 block w-full pl-10 pr-3 py-2.5 rounded-md"
                                        onChange={(e) =>
                                            setData(
                                                "vehicle_model",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                </div>
                                <InputError
                                    message={errors.vehicle_model}
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="plat_nomor"
                                    value="Plat Nomor"
                                    className="font-semibold text-gray-700"
                                />
                                <div className="relative mt-1">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Tag className="h-5 w-5 text-gray-400" />
                                    </span>
                                    <TextInput
                                        id="plat_nomor"
                                        value={data.plat_nomor}
                                        className="mt-1 block w-full pl-10 pr-3 py-2.5 rounded-md"
                                        onChange={(e) =>
                                            setData(
                                                "plat_nomor",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                </div>
                                <InputError
                                    message={errors.plat_nomor}
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="no_bpkb"
                                    value="Nomor BPKB"
                                    className="font-semibold text-gray-700"
                                />
                                <div className="relative mt-1">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <FileText className="h-5 w-5 text-gray-400" />
                                    </span>
                                    <TextInput
                                        id="no_bpkb"
                                        value={data.no_bpkb}
                                        className="mt-1 block w-full pl-10 pr-3 py-2.5 rounded-md"
                                        onChange={(e) =>
                                            setData("no_bpkb", e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <InputError
                                    message={errors.no_bpkb}
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="no_sim"
                                    value="Nomor SIM"
                                    className="font-semibold text-gray-700"
                                />
                                <div className="relative mt-1">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <FileText className="h-5 w-5 text-gray-400" />
                                    </span>
                                    <TextInput
                                        id="no_sim"
                                        value={data.no_sim}
                                        className="mt-1 block w-full pl-10 pr-3 py-2.5 rounded-md"
                                        onChange={(e) =>
                                            setData("no_sim", e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <InputError
                                    message={errors.no_sim}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        {/* [MODIFIKASI] UPLOAD GAMBAR MODERN */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            {uploadFields.map(([id, label]) => (
                                <div key={id}>
                                    <InputLabel
                                        htmlFor={id}
                                        value={label}
                                        className="font-semibold text-gray-700"
                                    />

                                    <label
                                        htmlFor={id}
                                        className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer bg-gray-50 hover:bg-green-50 hover:border-green-500 transition-all"
                                    >
                                        {preview[id] ? (
                                            <img
                                                src={preview[id]}
                                                alt="Preview"
                                                className="h-32 object-contain rounded-lg shadow-sm"
                                            />
                                        ) : (
                                            <div className="text-center">
                                                <Camera className="text-4xl text-gray-400 mx-auto mb-2" />
                                                <span className="text-sm text-gray-600">
                                                    Klik untuk unggah
                                                </span>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    PNG, JPG (MAX. 2MB)
                                                </p>
                                            </div>
                                        )}
                                    </label>

                                    <input
                                        type="file"
                                        id={id}
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) =>
                                            handleImageUpload(e, id)
                                        }
                                        required
                                    />

                                    <InputError
                                        message={errors[id]}
                                        className="mt-2"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* [MODIFIKASI] PROGRESS BAR */}
                        {progress && (
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-green-600 h-3 rounded-full text-xs text-white text-center transition-all duration-300"
                                    style={{
                                        width: `${progress.percentage}%`,
                                    }}
                                ></div>
                            </div>
                        )}

                        {/* [MODIFIKASI] Tombol & Link (sama seperti Login) */}
                        <div className="flex flex-col items-center justify-end mt-6 pt-4 border-t">
                            <PrimaryButton
                                className="w-full justify-center py-3 text-base font-semibold tracking-wider bg-green-600 hover:bg-green-700 focus:bg-green-700 active:bg-green-800 focus:ring-green-500"
                                disabled={processing}
                            >
                                {processing
                                    ? "MEMPROSES..."
                                    : "DAFTAR & KIRIM VERIFIKASI"}
                            </PrimaryButton>

                            <Link
                                href={route("courier.login")}
                                className="mt-6 underline text-sm text-gray-600 hover:text-gray-900"
                            >
                                Sudah punya akun? Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
