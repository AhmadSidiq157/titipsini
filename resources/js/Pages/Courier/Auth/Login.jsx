import React, { useEffect } from "react";
// [MODIFIKASI] Link dihapus dari import header, karena sudah tidak dipakai di logo
import { Head, Link, useForm } from "@inertiajs/react";

// [MODIFIKASI] Hapus GuestLayout, kita buat layout sendiri
// import GuestLayout from "@/Layouts/GuestLayout";

// Import komponen (sudah benar semua)
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import Checkbox from "@/Components/Checkbox";

// [BARU] Import ikon untuk input field
import { Mail, Lock } from "lucide-react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        // [PERBAIKAN] Gunakan route('login') standar.
        // AuthController backend kita sudah pintar untuk redirect kurir.
        post(route("login"));
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4 antialiased">
            <Head title="Login Kurir" />

            {/* Logo */}
            <div className="mb-6 text-center">
                <div className="text-4xl font-bold text-gray-800">
                    Titipsini<span className="text-green-500">.com</span>
                </div>
                <p className="text-lg text-gray-600 mt-1">Partner Kurir</p>
            </div>

            {/* [MODIFIKASI] Kartu Login yang Modern */}
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden border-t-4 border-green-500">
                <div className="p-6 sm:p-8">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                        Selamat Datang
                    </h2>
                    <p className="text-center text-gray-600 mb-6">
                        Login ke akun Anda.
                    </p>

                    {status && (
                        <div className="mb-4 font-medium text-sm text-green-600">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
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
                                    className="mt-1 block w-full pl-10 pr-3 py-2.5 border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-md shadow-sm"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                />
                            </div>
                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>

                        {/* [MODIFIKASI] Input Password dengan Ikon */}
                        <div className="mt-4">
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
                                    className="mt-1 block w-full pl-10 pr-3 py-2.5 border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-md shadow-sm"
                                    autoComplete="current-password"
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                />
                            </div>
                            <InputError
                                message={errors.password}
                                className="mt-2"
                            />
                        </div>

                        {/* [MODIFIKASI] Checkbox dengan warna hijau */}
                        <div className="block mt-4">
                            <label className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    className="rounded text-green-600 focus:ring-green-500"
                                    onChange={(e) =>
                                        setData("remember", e.target.checked)
                                    }
                                />
                                <span className="ms-2 text-sm text-gray-600">
                                    Ingat saya
                                </span>
                            </label>
                        </div>

                        {/* [MODIFIKASI] Tombol Login Full-Width */}
                        <div className="flex flex-col items-center justify-end mt-6">
                            <PrimaryButton
                                className="w-full justify-center py-3 text-base font-semibold tracking-wider bg-green-600 hover:bg-green-700 focus:bg-green-700 active:bg-green-800 focus:ring-green-500"
                                disabled={processing}
                            >
                                {processing ? "MEMPROSES..." : "LOGIN"}
                            </PrimaryButton>

                            {/* [MODIFIKASI] Link Daftar dipindah ke bawah, center */}
                            {/* [PERBAIKAN] Gunakan 'register.courier' */}
                            <Link
                                href={route("register.courier")}
                                className="mt-6 underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Belum punya akun? Daftar sebagai Kurir
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
