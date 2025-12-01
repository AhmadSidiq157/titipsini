import { useEffect } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import { Head, Link, useForm } from "@inertiajs/react";
import { User, Mail, Lock, Phone, Key, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        phone: "",
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
        <div className="flex h-screen w-full bg-white overflow-hidden">
            <Head title="Daftar Akun" />

            {/* --- BAGIAN KIRI (FORM DAFTAR) --- */}
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full md:w-1/2 h-full flex flex-col justify-center items-center p-8 relative z-10 bg-white shadow-2xl overflow-y-auto"
            >
                <div className="w-full max-w-[400px] space-y-5 my-auto">
                    {/* Header / Logo */}
                    <div className="text-center mb-4">
                        {" "}
                        <div
                            // Menambahkan mb-6 agar ada jarak dengan judul "Buat Akun Baru"
                            className="inline-block mb-6"
                        >
                            <img
                                src="/images/titipsini.com.png"
                                alt="Logo TitipSini"
                                className="h-12 mx-auto object-contain"
                            />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                            Buat Akun Baru
                        </h2>
                        <p className="text-gray-500 text-sm font-medium mt-1">
                            Bergabunglah untuk menikmati layanan kami.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-3">
                        {/* Input Nama */}
                        <div className="space-y-1">
                            <InputLabel
                                htmlFor="name"
                                value="Nama Lengkap"
                                className="text-gray-700 font-bold text-xs uppercase tracking-wide ml-1"
                            />
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                                    <User size={18} strokeWidth={2} />
                                </div>
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="pl-11 pr-4 py-3 w-full border-gray-100 bg-gray-50/50 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 placeholder:text-gray-400 font-medium text-sm"
                                    placeholder="Nama Lengkap Anda"
                                    autoComplete="name"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <InputError
                                message={errors.name}
                                className="ml-1"
                            />
                        </div>

                        {/* Input Email */}
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
                                    className="pl-11 pr-4 py-3 w-full border-gray-100 bg-gray-50/50 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 placeholder:text-gray-400 font-medium text-sm"
                                    placeholder="nama@email.com"
                                    autoComplete="username"
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <InputError
                                message={errors.email}
                                className="ml-1"
                            />
                        </div>

                        {/* Input Phone */}
                        <div className="space-y-1">
                            <InputLabel
                                htmlFor="phone"
                                value="No. Telepon"
                                className="text-gray-700 font-bold text-xs uppercase tracking-wide ml-1"
                            />
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                                    <Phone size={18} strokeWidth={2} />
                                </div>
                                <TextInput
                                    id="phone"
                                    type="text"
                                    name="phone"
                                    value={data.phone}
                                    className="pl-11 pr-4 py-3 w-full border-gray-100 bg-gray-50/50 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 placeholder:text-gray-400 font-medium text-sm"
                                    placeholder="0812..."
                                    autoComplete="tel"
                                    onChange={(e) =>
                                        setData("phone", e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <InputError
                                message={errors.phone}
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
                                    className="pl-11 pr-4 py-3 w-full border-gray-100 bg-gray-50/50 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 placeholder:text-gray-400 font-medium text-sm"
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <InputError
                                message={errors.password}
                                className="ml-1"
                            />
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1">
                            <InputLabel
                                htmlFor="password_confirmation"
                                value="Konfirmasi Password"
                                className="text-gray-700 font-bold text-xs uppercase tracking-wide ml-1"
                            />
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                                    <Key size={18} strokeWidth={2} />
                                </div>
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="pl-11 pr-4 py-3 w-full border-gray-100 bg-gray-50/50 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 placeholder:text-gray-400 font-medium text-sm"
                                    placeholder="Ulangi password"
                                    autoComplete="new-password"
                                    onChange={(e) =>
                                        setData(
                                            "password_confirmation",
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                            </div>
                            <InputError
                                message={errors.password_confirmation}
                                className="ml-1"
                            />
                        </div>

                        {/* Submit Button */}
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
                                    Mendaftarkan...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Daftar Sekarang
                                    <ArrowRight
                                        size={16}
                                        className="group-hover:translate-x-1 transition-transform duration-300"
                                    />
                                </span>
                            )}
                        </motion.button>

                        {/* Login Link */}
                        <div className="text-center pt-2">
                            <p className="text-xs sm:text-sm text-gray-500 font-medium">
                                Sudah punya akun?{" "}
                                <Link
                                    href={route("login")}
                                    className="font-bold text-emerald-600 hover:text-emerald-800 transition-colors hover:underline decoration-2 underline-offset-4"
                                >
                                    Masuk Disini
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

            {/* --- BAGIAN KANAN (GAMBAR DENGAN BACKGROUND HIJAU ELEGAN) --- */}
            <div className="hidden md:flex md:w-1/2 h-full relative bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 items-center justify-center p-10 overflow-hidden">
                {/* Dekorasi Background (Glow Effect untuk Dark Mode) */}
                <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/30 rounded-full blur-[120px] mix-blend-overlay animate-pulse"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-teal-400/20 rounded-full blur-[120px] mix-blend-overlay"></div>

                {/* Pattern Overlay Halus */}
                <div
                    className="absolute inset-0 opacity-[0.05]"
                    style={{
                        backgroundImage:
                            "radial-gradient(#ffffff 1px, transparent 1px)",
                        backgroundSize: "32px 32px",
                    }}
                ></div>

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
                        // max-h-[85%] agar ada breathing room atas-bawah
                        // drop-shadow-2xl agar gambar 'pop' di background gelap
                        className="max-w-full max-h-[85%] object-contain drop-shadow-2xl"
                    />
                </motion.div>
            </div>
        </div>
    );
}
