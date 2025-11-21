import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AdminLayout from "@/Layouts/AdminLayout";
import CourierLayout from "@/Layouts/CourierLayout";

import { Head, useForm, usePage, router } from "@inertiajs/react";

import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";

// Icons
import {
    User,
    Mail,
    Phone,
    MapPin,
    Save,
    Lock,
    ShieldAlert,
} from "lucide-react";

import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";

export default function Edit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;

    const { data, setData, processing, errors, recentlySuccessful } = useForm({
        name: auth.user.name || "",
        email: auth.user.email || "",
        phone: auth.user.phone || "",
        address: auth.user.address || "",
    });

    const submit = (e) => {
        e.preventDefault();
        router.patch(route("profile.update"), data);
    };

    return (
        <>
            <Head title="Pengaturan Profil" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="mx-auto max-w-4xl space-y-8 px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h2 className="text-3xl font-extrabold text-gray-900">
                            Pengaturan Akun
                        </h2>
                        <p className="mt-2 text-gray-600">
                            Kelola informasi profil, keamanan, dan preferensi
                            akun Anda.
                        </p>
                    </div>

                    {/* === INFORMASI PRIBADI === */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 sm:p-8 border-b border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                    <User size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">
                                        Informasi Pribadi
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Perbarui detail profil dan informasi
                                        kontak Anda.
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Nama */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nama Lengkap
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={(e) =>
                                                    setData(
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                                className="pl-10 block w-full border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150 ease-in-out"
                                                placeholder="Nama Anda"
                                            />
                                        </div>
                                        <InputError
                                            message={errors.name}
                                            className="mt-2"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData(
                                                        "email",
                                                        e.target.value
                                                    )
                                                }
                                                className="pl-10 block w-full border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                                placeholder="nama@email.com"
                                            />
                                        </div>
                                        <InputError
                                            message={errors.email}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                {/* Telepon */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nomor Telepon
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            value={data.phone}
                                            onChange={(e) =>
                                                setData("phone", e.target.value)
                                            }
                                            className="pl-10 block w-full border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                            placeholder="0812..."
                                        />
                                    </div>
                                    <InputError
                                        message={errors.phone}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Alamat */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Alamat Lengkap
                                    </label>
                                    <div className="relative">
                                        <div className="absolute top-3 left-3 pointer-events-none">
                                            <MapPin className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <textarea
                                            rows="3"
                                            value={data.address}
                                            onChange={(e) =>
                                                setData(
                                                    "address",
                                                    e.target.value
                                                )
                                            }
                                            className="pl-10 block w-full border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                            placeholder="Alamat lengkap Anda..."
                                        ></textarea>
                                    </div>
                                    <InputError
                                        message={errors.address}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Tombol simpan */}
                                <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
                                    {recentlySuccessful && (
                                        <p className="text-sm text-green-600 font-medium animate-pulse">
                                            Berhasil disimpan.
                                        </p>
                                    )}
                                    <PrimaryButton
                                        disabled={processing}
                                        className="flex items-center gap-2"
                                    >
                                        <Save className="w-4 h-4" />
                                        Simpan Perubahan
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* GANTI PASSWORD */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 sm:p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                    <Lock size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">
                                        Keamanan Akun
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Perbarui kata sandi Anda untuk menjaga
                                        keamanan akun.
                                    </p>
                                </div>
                            </div>
                            <div className="max-w-xl">
                                <UpdatePasswordForm />
                            </div>
                        </div>
                    </div>

                    {/* HAPUS AKUN */}
                    <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
                        <div className="p-6 sm:p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-red-100 rounded-lg text-red-600">
                                    <ShieldAlert size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">
                                        Zona Bahaya
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Tindakan ini tidak dapat dibatalkan.
                                        Hati-hati.
                                    </p>
                                </div>
                            </div>

                            <div className="max-w-xl">
                                <DeleteUserForm />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// === DYNAMIC LAYOUT ===
Edit.layout = (page) => {
    const { auth } = page.props;
    const user = auth.user;

    const header = "Pengaturan Profil";

    const hasRole = (roleName) => {
        return user.roles?.some((role) => role.name === roleName);
    };

    if (hasRole("admin")) {
        return (
            <AdminLayout user={user} header={header}>
                {page}
            </AdminLayout>
        );
    }

    if (hasRole("kurir")) {
        return (
            <CourierLayout user={user} header={header}>
                {page}
            </CourierLayout>
        );
    }

    return (
        <AuthenticatedLayout
            user={user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    {header}
                </h2>
            }
        >
            {page}
        </AuthenticatedLayout>
    );
};
