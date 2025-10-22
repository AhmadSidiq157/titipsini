import React, { useState } from "react";
import { motion } from "framer-motion";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { Save, UploadCloud, Trash2 } from "lucide-react";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";

export default function LogoIndex({ settings, flash }) {
    const [logoPreview, setLogoPreview] = useState(null);

    const { data, setData, post, errors, processing, progress, reset } =
        useForm({
            logo: null,
        });

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("logo", file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.settings.logo.update"), {
            onSuccess: () => {
                reset("logo");
                setLogoPreview(null);
                const input = document.getElementById("logo-input");
                if (input) input.value = "";
            },
        });
    };

    return (
        <AdminLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Pengaturan / Logo Situs
                </h2>
            }
        >
            <Head title="Logo Situs" />

            <div className="py-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-2xl mx-auto sm:px-6 lg:px-8"
                >
                    <div className="bg-white/80 backdrop-blur-md shadow-lg ring-1 ring-gray-100 rounded-2xl overflow-hidden p-8 border border-gray-200">
                        <form onSubmit={submit} className="space-y-8">
                            {flash?.success && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-4 bg-green-100 text-green-700 rounded-md shadow-sm"
                                >
                                    {flash.success}
                                </motion.div>
                            )}

                            {/* Logo Saat Ini */}
                            <div>
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        Logo Saat Ini
                                    </h3>
                                    {settings.site_logo && (
                                        <Link
                                            href={route(
                                                "admin.settings.logo.destroy"
                                            )}
                                            method="delete"
                                            as="button"
                                            className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 transition-colors"
                                            onBefore={() =>
                                                confirm(
                                                    "Yakin ingin menghapus logo ini?"
                                                )
                                            }
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Hapus
                                        </Link>
                                    )}
                                </div>

                                {settings.site_logo ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.4 }}
                                        className="mt-4 p-4 border border-gray-200 rounded-xl shadow-sm bg-gray-50 inline-block"
                                    >
                                        <img
                                            src={`/storage/${settings.site_logo}`}
                                            alt="Logo Situs"
                                            className="h-24 w-auto object-contain"
                                        />
                                    </motion.div>
                                ) : (
                                    <p className="mt-2 text-sm text-gray-500 italic">
                                        Belum ada logo yang diunggah.
                                    </p>
                                )}
                            </div>

                            {/* Upload Baru */}
                            <div>
                                <label
                                    htmlFor="logo-input"
                                    className="block text-lg font-semibold text-gray-800"
                                >
                                    Unggah Logo Baru
                                </label>

                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="mt-3 relative border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center transition-all duration-300 hover:border-indigo-400 hover:bg-indigo-50/30 cursor-pointer"
                                >
                                    <UploadCloud className="h-12 w-12 text-indigo-500 mb-3" />
                                    <label
                                        htmlFor="logo-input"
                                        className="text-indigo-600 font-medium cursor-pointer hover:text-indigo-500"
                                    >
                                        Klik untuk memilih file
                                    </label>
                                    <p className="text-xs text-gray-500 mt-1">
                                        PNG, JPG, SVG, WEBP (maks. 2MB)
                                    </p>
                                    <input
                                        id="logo-input"
                                        name="logo"
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={handleLogoChange}
                                    />
                                </motion.div>

                                <InputError
                                    message={errors.logo}
                                    className="mt-2"
                                />
                            </div>

                            {/* Pratinjau */}
                            {logoPreview && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                        Pratinjau Logo Baru
                                    </h3>
                                    <div className="p-4 border border-indigo-100 rounded-xl bg-gradient-to-br from-indigo-50 to-white shadow-md inline-block">
                                        <img
                                            src={logoPreview}
                                            alt="Pratinjau Logo Baru"
                                            className="h-24 w-auto object-contain"
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {/* Progress */}
                            {progress && (
                                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{
                                            width: `${progress.percentage}%`,
                                        }}
                                        transition={{
                                            ease: "easeOut",
                                            duration: 0.4,
                                        }}
                                        className="bg-indigo-600 h-3 rounded-full"
                                    />
                                </div>
                            )}

                            {/* Tombol Simpan */}
                            <div className="flex justify-end">
                                <motion.div whileTap={{ scale: 0.97 }}>
                                    <PrimaryButton
                                        disabled={processing || !data.logo}
                                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition-colors"
                                    >
                                        <Save className="w-4 h-4" />
                                        Unggah & Simpan
                                    </PrimaryButton>
                                </motion.div>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </AdminLayout>
    );
}
