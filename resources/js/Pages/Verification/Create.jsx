import React, { useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
// Kita akan gunakan <select> standar,
// kecuali Anda punya komponen <SelectInput> sendiri

export default function Create({ auth, verification }) {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        legal_name: "",
        id_card_type: "KTP",
        id_card_number: "",
        address_on_id: "",
        gender: "laki-laki",
        id_card_path: null,
    });

    // Jika user ditolak dan datanya dikirim balik, isi form-nya
    useEffect(() => {
        if (verification) {
            setData({
                ...data,
                legal_name: verification.legal_name || "",
                id_card_type: verification.id_card_type || "KTP",
                id_card_number: verification.id_card_number || "",
                address_on_id: verification.address_on_id || "",
                gender: verification.gender || "laki-laki",
            });
        }
    }, [verification]);

    const submit = (e) => {
        e.preventDefault();
        // Inertia otomatis menangani file upload saat kita POST
        post(route("verification.store"));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Verifikasi Data Diri
                </h2>
            }
        >
            <Head title="Verifikasi Data Diri" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <form
                            onSubmit={submit}
                            className="p-6 md:p-8 space-y-6"
                        >
                            <p className="text-gray-600">
                                Untuk melanjutkan pemesanan, kami perlu
                                memverifikasi identitas Anda. Mohon isi data
                                sesuai KTP/SIM.
                            </p>

                            {/* Notifikasi jika ditolak */}
                            {verification &&
                                verification.status === "rejected" && (
                                    <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
                                        <p className="font-bold">
                                            Verifikasi Ditolak
                                        </p>
                                        <p>
                                            Alasan:{" "}
                                            {verification.rejection_notes ||
                                                "Silakan periksa kembali data Anda dan kirim ulang."}
                                        </p>
                                    </div>
                                )}

                            {/* Notifikasi dari Middleware */}
                            {flash.error && (
                                <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
                                    <p>{flash.error}</p>
                                </div>
                            )}

                            <div>
                                <InputLabel
                                    htmlFor="legal_name"
                                    value="Nama Lengkap (Sesuai KTP/SIM)"
                                />
                                <TextInput
                                    id="legal_name"
                                    value={data.legal_name}
                                    onChange={(e) =>
                                        setData("legal_name", e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                    required
                                />
                                <InputError
                                    message={errors.legal_name}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel
                                        htmlFor="id_card_type"
                                        value="Jenis Identitas"
                                    />
                                    <select
                                        id="id_card_type"
                                        value={data.id_card_type}
                                        onChange={(e) =>
                                            setData(
                                                "id_card_type",
                                                e.target.value
                                            )
                                        }
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    >
                                        <option>KTP</option>
                                        <option>SIM</option>
                                        <option>Passport</option>
                                    </select>
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="id_card_number"
                                        value="Nomor Identitas (NIK/No. SIM)"
                                    />
                                    <TextInput
                                        id="id_card_number"
                                        value={data.id_card_number}
                                        onChange={(e) =>
                                            setData(
                                                "id_card_number",
                                                e.target.value
                                            )
                                        }
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError
                                        message={errors.id_card_number}
                                        className="mt-2"
                                    />
                                </div>
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
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                >
                                    <option>laki-laki</option>
                                    <option>perempuan</option>
                                </select>
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="address_on_id"
                                    value="Alamat (Sesuai Identitas)"
                                />
                                <textarea
                                    id="address_on_id"
                                    value={data.address_on_id}
                                    onChange={(e) =>
                                        setData("address_on_id", e.target.value)
                                    }
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    rows="3"
                                    required
                                ></textarea>
                                <InputError
                                    message={errors.address_on_id}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="id_card_path"
                                    value="Upload Foto KTP/SIM"
                                />
                                <input
                                    id="id_card_path"
                                    type="file"
                                    className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                                    onChange={(e) =>
                                        setData(
                                            "id_card_path",
                                            e.target.files[0]
                                        )
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.id_card_path}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex items-center justify-end">
                                <PrimaryButton disabled={processing}>
                                    Kirim Data Verifikasi
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
