import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import {
    Save,
    Phone,
    Mail,
    MapPin,
    MessageSquare,
    CheckCircle,
    Loader2,
} from "lucide-react";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";

// Komponen Input dengan Ikon dan gaya baru
const SettingsInput = ({
    id,
    label,
    error,
    icon,
    className = "",
    ...props
}) => (
    <div className={`relative group ${className}`}>
        <InputLabel
            htmlFor={id}
            value={label}
            className="text-gray-700 font-medium"
        />
        <div className="relative mt-1 flex items-center">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                {icon}
            </div>
            <input
                id={id}
                className="block w-full pl-11 pr-3 py-2.5 border border-gray-200 rounded-xl shadow-sm bg-gray-50 focus:bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                {...props}
            />
        </div>
        <InputError message={error} className="mt-2" />
    </div>
);

// Komponen Textarea dengan gaya baru
const SettingsTextarea = ({ id, label, error, icon, ...props }) => (
    <div className="md:col-span-2 relative group">
        <InputLabel
            htmlFor={id}
            value={label}
            className="text-gray-700 font-medium"
        />
        <div className="relative mt-1">
            <div className="absolute top-3 left-0 pl-3 flex items-start text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                {icon}
            </div>
            <textarea
                id={id}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl shadow-sm bg-gray-50 focus:bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 resize-none"
                rows="4"
                {...props}
            ></textarea>
        </div>
        <InputError message={error} className="mt-2" />
    </div>
);

export default function ContactIndex({ settings, flash }) {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const { data, setData, post, errors, processing } = useForm({
        contact_phone: settings.contact_phone || "",
        contact_email: settings.contact_email || "",
        contact_address: settings.contact_address || "",
        whatsapp_message: settings.whatsapp_message || "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.settings.update"));
    };

    return (
        <AdminLayout
            header={
                <h2 className="font-semibold text-2xl text-gray-800 leading-tight tracking-tight">
                    Pengaturan / Informasi Kontak
                </h2>
            }
        >
            <Head title="Informasi Kontak" />

            <div
                className={`py-12 transition-all duration-700 ease-out ${
                    isMounted
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                }`}
            >
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-white to-indigo-50 shadow-lg border border-gray-100 rounded-2xl overflow-hidden backdrop-blur-sm">
                        <form
                            onSubmit={submit}
                            className="p-8 md:p-10 space-y-6"
                        >
                            <div className="flex justify-between items-center border-b border-gray-200 pb-5">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <Phone className="w-5 h-5 text-indigo-600" />
                                    Edit Informasi Kontak
                                </h2>
                                <div className="h-1 w-16 bg-indigo-500 rounded-full"></div>
                            </div>

                            {flash?.success && (
                                <div className="mb-6 flex items-center p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 shadow-sm">
                                    <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                                    <span className="font-medium">
                                        {flash.success}
                                    </span>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SettingsInput
                                    id="contact_phone"
                                    label="Nomor Telepon (format 628...)"
                                    value={data.contact_phone}
                                    onChange={(e) =>
                                        setData("contact_phone", e.target.value)
                                    }
                                    error={errors.contact_phone}
                                    icon={<Phone size={16} />}
                                />
                                <SettingsInput
                                    id="contact_email"
                                    label="Alamat Email"
                                    type="email"
                                    value={data.contact_email}
                                    onChange={(e) =>
                                        setData("contact_email", e.target.value)
                                    }
                                    error={errors.contact_email}
                                    icon={<Mail size={16} />}
                                />
                                <SettingsInput
                                    id="contact_address"
                                    label="Alamat"
                                    value={data.contact_address}
                                    onChange={(e) =>
                                        setData(
                                            "contact_address",
                                            e.target.value
                                        )
                                    }
                                    error={errors.contact_address}
                                    icon={<MapPin size={16} />}
                                    className="md:col-span-2"
                                />

                                <SettingsTextarea
                                    id="whatsapp_message"
                                    label="Template Pesan WhatsApp"
                                    value={data.whatsapp_message}
                                    onChange={(e) =>
                                        setData(
                                            "whatsapp_message",
                                            e.target.value
                                        )
                                    }
                                    error={errors.whatsapp_message}
                                    icon={<MessageSquare size={16} />}
                                />
                            </div>

                            <div className="flex items-center justify-end mt-10 pt-6 border-t border-gray-200">
                                <PrimaryButton
                                    disabled={processing}
                                    className="flex items-center px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all"
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Simpan Perubahan
                                        </>
                                    )}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
