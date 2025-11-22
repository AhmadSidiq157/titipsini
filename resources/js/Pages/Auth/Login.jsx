import { useEffect } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import Checkbox from "@/Components/Checkbox";
import { Head, Link, useForm } from "@inertiajs/react";
import { Mail, Lock } from "lucide-react";
// [1] Import Motion
import { motion } from "framer-motion";

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
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Masuk Akun" />

            <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
                {/* Logo & Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 text-center"
                >
                    <div className="text-4xl font-extrabold text-gray-800 tracking-tight flex items-center justify-center gap-1">
                        Titipsini
                        <span className="text-green-600">.com</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mt-4">
                        Selamat Datang
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Silakan masuk ke akun Anda.
                    </p>
                </motion.div>

                {/* [2] Bungkus Kartu dengan Motion Div */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden border-t-4 border-green-500"
                >
                    <div className="p-6 sm:p-8">
                        {status && (
                            <div className="mb-4 text-sm font-medium text-green-600 text-center py-2 px-4 bg-green-50 rounded-lg">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            {/* Input Email */}
                            <div>
                                <InputLabel
                                    htmlFor="email"
                                    value="Email"
                                    className="sr-only"
                                />
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 transition"
                                        autoComplete="username"
                                        isFocused={true}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        placeholder="Alamat Email Anda"
                                    />
                                </div>
                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />
                            </div>

                            {/* Input Password */}
                            <div>
                                <InputLabel
                                    htmlFor="password"
                                    value="Password"
                                    className="sr-only"
                                />
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 transition"
                                        autoComplete="current-password"
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        placeholder="Kata Sandi Anda"
                                    />
                                </div>
                                <InputError
                                    message={errors.password}
                                    className="mt-2"
                                />
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between mt-4">
                                <label className="flex items-center text-sm">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData(
                                                "remember",
                                                e.target.checked
                                            )
                                        }
                                        className="text-green-600 focus:ring-green-500 rounded"
                                    />
                                    <span className="ms-2 text-gray-600">
                                        Ingat saya
                                    </span>
                                </label>
                                {canResetPassword && (
                                    <Link
                                        href={route("password.request")}
                                        className="text-sm text-green-600 hover:text-green-700 hover:underline font-medium transition"
                                    >
                                        Lupa Kata Sandi?
                                    </Link>
                                )}
                            </div>

                            {/* Tombol Login */}
                            <PrimaryButton
                                className="w-full justify-center py-3 text-lg font-bold bg-green-600 hover:bg-green-700 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                                disabled={processing}
                            >
                                Masuk Akun
                            </PrimaryButton>
                        </form>

                        {/* Link Daftar */}
                        <div className="mt-8 text-center text-sm border-t pt-6 border-gray-100">
                            <p className="text-gray-600 mb-2">
                                Belum punya akun?
                            </p>
                            <Link
                                href={route("register")}
                                className="font-bold text-green-600 hover:text-green-700 hover:underline transition-colors text-base"
                            >
                                Daftar Sekarang
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </GuestLayout>
    );
}
