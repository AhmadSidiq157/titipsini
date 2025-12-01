import { useEffect } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import Checkbox from "@/Components/Checkbox";
import { Head, Link, useForm } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight } from "lucide-react";

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
        <div className="flex h-screen w-full bg-white overflow-hidden">
            <Head title="Masuk Akun" />

            {/* --- BAGIAN KIRI (FORM LOGIN) --- */}
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full md:w-1/2 h-full flex flex-col justify-center items-center p-8 relative z-10 bg-white shadow-2xl overflow-y-auto"
            >
                <div className="w-full max-w-[400px] space-y-5 my-auto">
                    {/* Header / Logo */}
                    <div className="text-center mb-8">
                        <div
                            // Memberi jarak ke bawah agar tidak menempel dengan teks
                            className="inline-block mb-6"
                        >
                            <img
                                src="/images/titipsini.com.png"
                                alt="Logo TitipSini"
                                className="h-14 mx-auto object-contain"
                            />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                            Selamat Datang
                        </h2>
                        <p className="text-gray-500 text-sm font-medium mt-2">
                            Masuk untuk mengelola kiriman Anda.
                        </p>
                    </div>

                    {status && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-bold text-center shadow-sm"
                        >
                            {status}
                        </motion.div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        {/* Email Input */}
                        <div className="space-y-1">
                            <InputLabel
                                htmlFor="email"
                                value="Email"
                                className="text-gray-700 font-bold text-xs uppercase tracking-wide ml-1"
                            />
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                                    <Mail size={18} strokeWidth={2} />
                                </div>
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    // [MODIFIKASI] Menggunakan warna Emerald (Hijau) untuk border saat fokus
                                    className="pl-11 pr-4 py-3 w-full border-gray-100 bg-gray-50/50 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 placeholder:text-gray-400 font-medium text-sm"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    placeholder="nama@email.com"
                                />
                            </div>
                            <InputError
                                message={errors.email}
                                className="ml-1"
                            />
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1">
                            <InputLabel
                                htmlFor="password"
                                value="Password"
                                className="text-gray-700 font-bold text-xs uppercase tracking-wide ml-1"
                            />
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                                    <Lock size={18} strokeWidth={2} />
                                </div>
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    // [MODIFIKASI] Menggunakan warna Emerald (Hijau) untuk border saat fokus
                                    className="pl-11 pr-4 py-3 w-full border-gray-100 bg-gray-50/50 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 placeholder:text-gray-400 font-medium text-sm"
                                    autoComplete="current-password"
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    placeholder="••••••••"
                                />
                            </div>
                            <InputError
                                message={errors.password}
                                className="ml-1"
                            />
                        </div>

                        {/* Checkbox & Forgot Password */}
                        <div className="flex items-center justify-between pt-1 px-1">
                            <label className="flex items-center cursor-pointer group select-none">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData("remember", e.target.checked)
                                    }
                                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300 transition-all cursor-pointer"
                                />
                                <span className="ml-2 text-xs sm:text-sm text-gray-500 group-hover:text-gray-800 font-medium transition-colors">
                                    Ingat saya
                                </span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route("password.request")}
                                    className="text-xs sm:text-sm font-bold text-emerald-600 hover:text-emerald-800 hover:underline transition-all"
                                >
                                    Lupa password?
                                </Link>
                            )}
                        </div>

                        {/* Tombol Submit */}
                        <motion.button
                            whileHover={{ scale: 1.01, translateY: -1 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={processing}
                            className="w-full group relative flex justify-center items-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 shadow-lg shadow-emerald-200/50 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                        >
                            {processing ? (
                                <span className="flex items-center gap-2">
                                    <svg
                                        className="animate-spin h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Memproses...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Masuk Sekarang{" "}
                                    <ArrowRight
                                        size={16}
                                        className="group-hover:translate-x-1 transition-transform duration-300"
                                    />
                                </span>
                            )}
                        </motion.button>

                        {/* Register Link */}
                        <div className="text-center pt-2">
                            <p className="text-xs sm:text-sm text-gray-500 font-medium">
                                Belum punya akun?{" "}
                                <Link
                                    href={route("register")}
                                    className="font-bold text-emerald-600 hover:text-emerald-800 transition-colors hover:underline decoration-2 underline-offset-4"
                                >
                                    Daftar Gratis
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>

                {/* Footer Kecil */}
                <div className="absolute bottom-4 text-[10px] text-gray-400 font-medium text-center w-full">
                    &copy; {new Date().getFullYear()} TitipSini. All rights
                    reserved.
                </div>
            </motion.div>

            {/* --- BAGIAN KANAN (GAMBAR FULL & IMMERSIVE) --- */}
            <div className="hidden md:flex md:w-1/2 h-full relative bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 items-center justify-center p-10 overflow-hidden">
                {/* Dekorasi Background (Blob) */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/60 rounded-full mix-blend-multiply filter blur-[60px] opacity-60 animate-blob"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-100/60 rounded-full mix-blend-multiply filter blur-[60px] opacity-60 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-50/60 rounded-full mix-blend-multiply filter blur-[60px] opacity-60 animate-blob animation-delay-4000"></div>

                {/* Container Gambar */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 w-full h-full flex items-center justify-center"
                >
                    <img
                        src="/images/titipsini.png"
                        alt="Ilustrasi TitipSini"
                        className="max-w-full max-h-[85%] object-contain drop-shadow-2xl"
                    />
                </motion.div>
            </div>
        </div>
    );
}
