import React from "react";
import { Head, useForm, usePage, router, Link } from "@inertiajs/react";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    MapPin,
    Save,
    Lock,
    ShieldAlert,
} from "lucide-react";

export default function Edit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    const user = auth.user;

    const { data, setData, processing, errors, recentlySuccessful } = useForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
    });

    const submit = (e) => {
        e.preventDefault();
        router.patch(route("profile.update"), data);
    };

    // Logika tombol kembali sesuai role
    const getDashboardRoute = () => {
        const roles = user.roles || [];
        if (roles.some((r) => r.name === "admin"))
            return route("admin.dashboard");
        if (roles.some((r) => r.name === "kurir"))
            return route("courier.dashboard");
        return route("dashboard");
    };

    return (
        <div className="min-h-screen bg-gray-50/80 font-sans pb-20">
            <Head title="Pengaturan Profil" />

            {/* --- 1. HEADER SIMPLE --- */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
                <div className="flex items-center gap-4">
                    <Link
                        href={getDashboardRoute()}
                        className="p-3 rounded-2xl bg-white border border-gray-200 text-gray-500 hover:text-emerald-600 hover:border-emerald-200 hover:shadow-md transition-all duration-200"
                        title="Kembali ke Dashboard"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                            Pengaturan Akun
                        </h1>
                        <p className="text-sm text-gray-500">
                            Kelola informasi profil dan keamanan Anda.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* --- 2. KARTU PROFIL (DATA DIRI) --- */}
                <section className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="md:flex">
                        {/* Sisi Kiri: Visual */}
                        <div className="md:w-1/3 bg-emerald-50/50 p-8 border-r border-gray-100 flex flex-col justify-center items-center md:items-start text-center md:text-left">
                            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-emerald-600 mb-4 shadow-sm border border-emerald-100">
                                <User size={40} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">
                                Data Diri
                            </h3>
                            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                                Perbarui nama, email, dan kontak agar kami mudah
                                menghubungi Anda.
                            </p>
                        </div>

                        {/* Sisi Kanan: Form */}
                        <div className="md:w-2/3 p-8">
                            <form onSubmit={submit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Nama */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                                            Nama Lengkap
                                        </label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={(e) =>
                                                    setData(
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                                                placeholder="Nama Lengkap"
                                            />
                                        </div>
                                        <InputError message={errors.name} />
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                                            Email
                                        </label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData(
                                                        "email",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                                                placeholder="email@anda.com"
                                            />
                                        </div>
                                        <InputError message={errors.email} />
                                    </div>
                                </div>

                                {/* Telepon */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                                        No. WhatsApp
                                    </label>
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                        <input
                                            type="text"
                                            value={data.phone}
                                            onChange={(e) =>
                                                setData("phone", e.target.value)
                                            }
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                                            placeholder="0812..."
                                        />
                                    </div>
                                    <InputError message={errors.phone} />
                                </div>

                                {/* Alamat */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                                        Alamat Domisili
                                    </label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                        <textarea
                                            rows="2"
                                            value={data.address}
                                            onChange={(e) =>
                                                setData(
                                                    "address",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none font-medium"
                                            placeholder="Alamat lengkap..."
                                        ></textarea>
                                    </div>
                                    <InputError message={errors.address} />
                                </div>

                                <div className="pt-4 flex items-center justify-between border-t border-gray-100">
                                    <div className="text-sm">
                                        {recentlySuccessful && (
                                            <span className="text-emerald-600 font-bold animate-pulse">
                                                ✓ Perubahan tersimpan!
                                            </span>
                                        )}
                                    </div>
                                    <PrimaryButton
                                        disabled={processing}
                                        className="bg-emerald-600 hover:bg-emerald-700 border-0 shadow-lg shadow-emerald-200 rounded-xl px-6 py-3 h-auto"
                                    >
                                        <Save size={18} className="mr-2" />
                                        Simpan Profil
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>

                {/* --- 3. GRID KEAMANAN (Password & Delete) --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Kartu Password */}
                    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 h-full flex flex-col">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100">
                                <Lock size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    Kata Sandi
                                </h3>
                                <p className="text-xs text-gray-500">
                                    Amankan akun Anda.
                                </p>
                            </div>
                        </div>
                        <div className="flex-1">
                            {/* Komponen Password Bawaan */}
                            <div className="bg-gray-50/50 rounded-xl p-1">
                                <UpdatePasswordForm className="max-w-full" />
                            </div>
                        </div>
                    </div>

                    {/* Kartu Hapus Akun */}
                    <div className="bg-white rounded-[2rem] shadow-sm border border-red-100 p-8 h-full flex flex-col">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 border border-red-100">
                                <ShieldAlert size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    Zona Bahaya
                                </h3>
                                <p className="text-xs text-gray-500">
                                    Hapus akun permanen.
                                </p>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                            <div className="text-sm text-gray-600 mb-6 bg-red-50 p-4 rounded-xl border border-red-100 leading-relaxed">
                                Hati-hati. Menghapus akun akan menghilangkan
                                semua data riwayat pesanan dan tidak dapat
                                dikembalikan.
                            </div>
                            {/* Komponen Delete Bawaan */}
                            <DeleteUserForm className="max-w-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
