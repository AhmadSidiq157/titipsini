import { useEffect } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import Checkbox from "@/Components/Checkbox";
import { Head, Link, useForm } from "@inertiajs/react";
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
        <div className="min-h-screen w-full flex overflow-hidden bg-white">
            <Head title="Masuk Akun" />

            {/* --- BAGIAN KIRI (FORM) --- */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16 lg:p-24 shadow-xl z-10"
            >
                <div className="w-full max-w-md">
                    {/* LOGO SECTION */}
                    <div className="text-center mb-10">
                        <div href="/" className="inline-block mb-4">
                            {/* [OPSI 1] Logo Gambar (Recomended) */}
                            {/* Ganti '/images/logo.jpg' dengan path logo Anda yang sebenarnya */}
                            <img
                                src="/images/titipsini.com.png"
                                alt="Logo TitipSini"
                                className="h-12 md:h-14 mx-auto object-contain"
                            />

                            {/* [OPSI 2] Jika logo belum siap, pakai Teks ini (Komentari Opsi 1 jika pakai ini) */}
                            {/* <div className="flex items-center justify-center gap-1">
                                <span className="text-3xl font-black text-gray-800 tracking-tighter">
                                    Titipsini<span className="text-green-600">.com</span>
                                </span>
                            </div> 
                            */}
                        </div>

                        <h4 className="text-xl font-semibold text-gray-700 mt-2">
                            Selamat Datang
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                            Masuk untuk mengelola kiriman dan pesanan Anda.
                        </p>
                    </div>

                    {status && (
                        <div className="mb-6 font-medium text-sm text-green-700 bg-green-100 border border-green-200 p-4 rounded-xl text-center">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        {/* Email Input */}
                        <div>
                            <InputLabel
                                htmlFor="email"
                                value="Email"
                                className="text-gray-700 font-bold"
                            />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-500 focus:ring-green-500 transition-all"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                placeholder="nama@email.com"
                            />
                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <InputLabel
                                htmlFor="password"
                                value="Password"
                                className="text-gray-700 font-bold"
                            />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-500 focus:ring-green-500 transition-all"
                                autoComplete="current-password"
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                placeholder="••••••••"
                            />
                            <InputError
                                message={errors.password}
                                className="mt-2"
                            />
                        </div>

                        {/* Checkbox & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center cursor-pointer">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData("remember", e.target.checked)
                                    }
                                    className="text-green-600 focus:ring-green-500 rounded"
                                />
                                <span className="ms-2 text-sm text-gray-600">
                                    Ingat saya
                                </span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route("password.request")}
                                    className="text-sm text-green-600 hover:text-green-700 font-semibold hover:underline"
                                >
                                    Lupa password?
                                </Link>
                            )}
                        </div>

                        {/* Tombol Submit */}
                        <button
                            className="w-full py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                            disabled={processing}
                        >
                            {processing
                                ? "Sedang Memproses..."
                                : "Masuk Sekarang"}
                        </button>

                        {/* Register Link */}
                        <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-gray-100">
                            <p className="text-sm text-gray-500">
                                Belum punya akun?
                            </p>
                            <Link
                                href={route("register")}
                                className="text-sm font-bold text-red-500 hover:text-red-600 border border-red-200 hover:bg-red-50 px-4 py-1.5 rounded-lg transition-all"
                            >
                                BUAT AKUN
                            </Link>
                        </div>
                    </form>
                </div>
            </motion.div>

            {/* --- BAGIAN KANAN (GAMBAR / BRANDING) --- */}
            <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-800 relative overflow-hidden items-center justify-center">
                {/* Decorative Circles */}
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-black opacity-10 rounded-full blur-3xl"></div>

                {/* Content Text */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative z-10 text-white px-12 max-w-xl text-center"
                >
                    <h2 className="text-4xl font-bold mb-6 leading-tight">
                        Solusi Pindahan & Penitipan Terpercaya
                    </h2>
                    <p className="text-lg text-green-50 font-light leading-relaxed mb-8">
                        "Kami menjaga barang Anda seperti milik kami sendiri.
                        Nikmati kemudahan layanan logistik dengan pelacakan
                        real-time dan keamanan terjamin."
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
