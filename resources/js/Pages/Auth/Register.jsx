import { useEffect } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import { User, Mail, Lock } from "lucide-react";
// [1] Import Motion
import { motion } from "framer-motion";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("register"));
    };

    return (
        <GuestLayout>
            <Head title="Daftar Akun" />

            <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
                {/* Header Animasi */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 text-center"
                >
                    <Link
                        href="/"
                        className="text-4xl font-extrabold text-gray-800 tracking-tight flex items-center justify-center gap-1"
                    >
                        Titipsini
                        <span className="text-green-600">.com</span>
                    </Link>
                    <h2 className="text-2xl font-bold text-gray-800 mt-4">
                        Buat Akun Baru
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Bergabunglah untuk menikmati layanan kami.
                    </p>
                </motion.div>

                {/* Kartu Animasi */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden border-t-4 border-green-500"
                >
                    <div className="p-6 sm:p-8">
                        <form onSubmit={submit} className="space-y-5">
                            {/* Input Nama */}
                            <div>
                                <InputLabel
                                    htmlFor="name"
                                    value="Nama Lengkap"
                                    className="sr-only"
                                />
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <TextInput
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 transition"
                                        autoComplete="name"
                                        isFocused={true}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        placeholder="Nama Lengkap"
                                        required
                                    />
                                </div>
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

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
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        placeholder="Alamat Email"
                                        required
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
                                        autoComplete="new-password"
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        placeholder="Kata Sandi"
                                        required
                                    />
                                </div>
                                <InputError
                                    message={errors.password}
                                    className="mt-2"
                                />
                            </div>

                            {/* Input Confirm Password */}
                            <div>
                                <InputLabel
                                    htmlFor="password_confirmation"
                                    value="Confirm Password"
                                    className="sr-only"
                                />
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <TextInput
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 transition"
                                        autoComplete="new-password"
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Ulangi Kata Sandi"
                                        required
                                    />
                                </div>
                                <InputError
                                    message={errors.password_confirmation}
                                    className="mt-2"
                                />
                            </div>

                            {/* Tombol Daftar */}
                            <div className="pt-2">
                                <PrimaryButton
                                    className="w-full justify-center py-3 text-lg font-bold bg-green-600 hover:bg-green-700 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                                    disabled={processing}
                                >
                                    Daftar Sekarang
                                </PrimaryButton>
                            </div>

                            {/* Link Masuk */}
                            <div className="flex items-center justify-center mt-6 border-t pt-6 border-gray-100">
                                <span className="text-sm text-gray-600 mr-1">
                                    Sudah punya akun?
                                </span>
                                <Link
                                    href={route("login")}
                                    className="text-sm font-bold text-green-600 hover:text-green-700 hover:underline transition-colors"
                                >
                                    Masuk disini
                                </Link>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </GuestLayout>
    );
}
