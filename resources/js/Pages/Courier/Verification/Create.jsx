import React from "react";
import { Head, useForm } from "@inertiajs/react";
import CourierLayout from "@/Layouts/CourierLayout"; // Menggunakan alias
import PrimaryButton from "@/Components/PrimaryButton";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";

export default function Create({ auth, verificationData }) {
    // Cek apakah ada alasan penolakan dari data sebelumnya
    const rejectionReason =
        verificationData?.status === "rejected"
            ? verificationData.rejection_reason
            : null;

    const { data, setData, post, processing, errors, progress } = useForm({
        vehicle_brand: verificationData?.vehicle_brand || "",
        vehicle_model: verificationData?.vehicle_model || "",
        plat_nomor: verificationData?.plat_nomor || "",
        no_bpkb: verificationData?.no_bpkb || "",
        no_sim: verificationData?.no_sim || "",

        // File kita set ke null, user harus upload ulang jika mau ganti
        foto_ktp: null,
        foto_sim: null,
        foto_kendaraan: null,
    });

    const submit = (e) => {
        e.preventDefault();
        // Kita gunakan 'post' karena ada file, Laravel akan handle ini
        post(route("courier.verification.store"), {
            forceFormData: true, // Wajib untuk upload file
        });
    };

    // Helper untuk menampilkan path file lama jika ada
    const FileInfo = ({ path, label }) =>
        path ? (
            <div className="text-xs text-gray-500 mt-1">
                {label} sebelumnya:{" "}
                <span className="font-medium text-green-600">
                    Sudah ter-upload
                </span>
                . (Upload file baru untuk mengganti)
            </div>
        ) : (
            <div className="text-xs text-gray-500 mt-1">
                {label}:{" "}
                <span className="font-medium text-red-600">
                    Wajib di-upload
                </span>
                .
            </div>
        );

    return (
        <CourierLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Verifikasi Akun Kurir
                </h2>
            }
        >
            <Head title="Verifikasi Kurir" />

            <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                    {/* Jika ditolak, tampilkan alasan */}
                    {rejectionReason && (
                        <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md">
                            <h4 className="font-bold">
                                Verifikasi Anda Ditolak
                            </h4>
                            <p className="mt-1">
                                Harap perbaiki data Anda dan kirim ulang.
                                Alasan:{" "}
                                <span className="font-medium">
                                    {rejectionReason}
                                </span>
                            </p>
                        </div>
                    )}

                    {!rejectionReason && (
                        <p className="mb-4 text-gray-600">
                            Anda harus melengkapi data verifikasi berikut
                            sebelum dapat mengambil tugas. Data Anda akan
                            ditinjau oleh Admin.
                        </p>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        {/* Data Kendaraan */}
                        <div>
                            <InputLabel
                                htmlFor="vehicle_brand"
                                value="Merek Kendaraan (Cth: Honda)"
                            />
                            <TextInput
                                id="vehicle_brand"
                                name="vehicle_brand"
                                value={data.vehicle_brand}
                                className="mt-1 block w-full"
                                onChange={(e) =>
                                    setData("vehicle_brand", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.vehicle_brand}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="vehicle_model"
                                value="Model Kendaraan (Cth: Vario 150)"
                            />
                            <TextInput
                                id="vehicle_model"
                                name="vehicle_model"
                                value={data.vehicle_model}
                                className="mt-1 block w-full"
                                onChange={(e) =>
                                    setData("vehicle_model", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.vehicle_model}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="plat_nomor"
                                value="Plat Nomor Kendaraan (Cth: B 1234 XYZ)"
                            />
                            <TextInput
                                id="plat_nomor"
                                name="plat_nomor"
                                value={data.plat_nomor}
                                className="mt-1 block w-full"
                                onChange={(e) =>
                                    setData("plat_nomor", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.plat_nomor}
                                className="mt-2"
                            />
                        </div>

                        {/* Data Dokumen */}
                        <div>
                            <InputLabel htmlFor="no_bpkb" value="Nomor BPKB" />
                            <TextInput
                                id="no_bpkb"
                                name="no_bpkb"
                                value={data.no_bpkb}
                                className="mt-1 block w-full"
                                onChange={(e) =>
                                    setData("no_bpkb", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.no_bpkb}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="no_sim"
                                value="Nomor SIM (Surat Izin Mengemudi)"
                            />
                            <TextInput
                                id="no_sim"
                                name="no_sim"
                                value={data.no_sim}
                                className="mt-1 block w-full"
                                onChange={(e) =>
                                    setData("no_sim", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.no_sim}
                                className="mt-2"
                            />
                        </div>

                        {/* Upload File */}
                        <div>
                            <InputLabel htmlFor="foto_ktp" value="Foto KTP" />
                            <input
                                type="file"
                                id="foto_ktp"
                                className="mt-1 block w-full text-sm"
                                onChange={(e) =>
                                    setData("foto_ktp", e.target.files[0])
                                }
                            />
                            <FileInfo
                                path={verificationData?.foto_ktp_path}
                                label="Foto KTP"
                            />
                            <InputError
                                message={errors.foto_ktp}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="foto_sim" value="Foto SIM" />
                            <input
                                type="file"
                                id="foto_sim"
                                className="mt-1 block w-full text-sm"
                                onChange={(e) =>
                                    setData("foto_sim", e.target.files[0])
                                }
                            />
                            <FileInfo
                                path={verificationData?.foto_sim_path}
                                label="Foto SIM"
                            />
                            <InputError
                                message={errors.foto_sim}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="foto_kendaraan"
                                value="Foto Kendaraan (Tampak Plat Nomor)"
                            />
                            <input
                                type="file"
                                id="foto_kendaraan"
                                className="mt-1 block w-full text-sm"
                                onChange={(e) =>
                                    setData("foto_kendaraan", e.target.files[0])
                                }
                            />
                            <FileInfo
                                path={verificationData?.foto_kendaraan_path}
                                label="Foto Kendaraan"
                            />
                            <InputError
                                message={errors.foto_kendaraan}
                                className="mt-2"
                            />
                        </div>

                        {/* Progress Bar untuk Upload */}
                        {progress && (
                            <div className="w-full bg-gray-200 rounded-full">
                                <div
                                    className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                                    style={{ width: `${progress.percentage}%` }}
                                >
                                    {progress.percentage}%
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-end mt-4">
                            <PrimaryButton
                                className="ms-4"
                                disabled={processing}
                            >
                                {rejectionReason
                                    ? "Kirim Ulang Verifikasi"
                                    : "Kirim Verifikasi"}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </CourierLayout>
    );
}
