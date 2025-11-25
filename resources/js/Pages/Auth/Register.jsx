import { useEffect } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import { Head, Link, useForm } from "@inertiajs/react";
import { User, Mail, Lock, Phone, Key } from "lucide-react";
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
        <div className="min-h-screen w-full flex overflow-hidden bg-white">
            <Head title="Daftar Akun" />

            {/* --- BAGIAN KIRI (FORM) --- */}
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12 lg:p-16 shadow-2xl z-20 bg-white overflow-y-auto"
            >
                <div className="w-full max-w-md py-10">
                    {/* Header & Logo (Mobile Only) */}
                    <div className="text-center mb-10">
                        {/* Logo hanya tampil di mobile, karena desktop sudah ada di kanan */}
                        <Link href="/" className="inline-block mb-4 md:hidden">
                            <img
                                src="/images/titipsini.com.png"
                                alt="Logo TitipSini"
                                className="h-12 mx-auto object-contain"
                            />
                        </Link>

                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            Buat Akun Baru
                        </h2>
                        <p className="text-sm text-gray-500 mt-2">
                            Bergabunglah untuk menikmati layanan penitipan dan
                            pindahan terbaik.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        {/* Input Nama */}
                        <div>
                            <InputLabel
                                htmlFor="name"
                                value="Nama Lengkap"
                                className="sr-only"
                            />
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all"
                                    placeholder="Nama Lengkap"
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
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all"
                                    placeholder="Alamat Email"
                                    autoComplete="username"
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>

                        {/* Input Phone */}
                        <div>
                            <InputLabel
                                htmlFor="phone"
                                value="No. Telepon"
                                className="sr-only"
                            />
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <TextInput
                                    id="phone"
                                    type="text"
                                    name="phone"
                                    value={data.phone}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all"
                                    placeholder="No. WhatsApp / Telepon"
                                    autoComplete="tel"
                                    onChange={(e) =>
                                        setData("phone", e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <InputError
                                message={errors.phone}
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
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all"
                                    placeholder="Kata Sandi"
                                    autoComplete="new-password"
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
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
                                value="Konfirmasi Password"
                                className="sr-only"
                            />
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Key className="h-5 w-5 text-gray-400" />
                                </div>
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all"
                                    placeholder="Ulangi Kata Sandi"
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
                                className="mt-2"
                            />
                        </div>

                        {/* Tombol Daftar */}
                        <div className="pt-2">
                            <button
                                className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-200 hover:shadow-green-300 transition-all transform hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <svg
                                            className="animate-spin h-5 w-5 text-white"
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
                                    </>
                                ) : (
                                    "Daftar Sekarang"
                                )}
                            </button>
                        </div>

                        {/* Link Masuk */}
                        <div className="text-center mt-6">
                            <p className="text-sm text-gray-500">
                                Sudah punya akun?{" "}
                                <Link
                                    href={route("login")}
                                    className="font-bold text-green-600 hover:text-green-700 hover:underline transition-colors"
                                >
                                    Masuk disini
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </motion.div>

            {/* --- BAGIAN KANAN (BRANDING LOGO) --- */}
            <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-800 relative overflow-hidden items-center justify-center">
                {/* Decorative Circles */}
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-black opacity-10 rounded-full blur-3xl"></div>

                {/* Konten Utama */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative z-10 text-white px-12 max-w-2xl text-center"
                >
                    {/* Branding Box */}
                    <div className="flex items-center justify-center gap-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl mb-8 mx-auto w-fit">
                        {/* Gambar Logo */}
                        <img
                            src="/images/titipsini.com.png"
                            alt="Logo Titipsini"
                            className="h-20 w-auto object-contain drop-shadow-lg"
                        />

                        {/* Garis Pembatas */}
                        <div className="h-12 w-0.5 bg-white/30 rounded-full"></div>

                        {/* Teks Brand */}
                        <div className="text-left">
                            <span className="block text-4xl font-black text-white tracking-tighter leading-none drop-shadow-sm">
                                Titipsini
                            </span>
                            <span className="block text-xl font-bold text-green-300 tracking-widest">
                                .com
                            </span>
                        </div>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight tracking-tight">
                        Bergabung Bersama Kami <br />
                    </h2>
                    <p className="text-lg text-green-50 font-light leading-relaxed">
                        Nikmati pengalaman logistik yang aman, cepat, dan
                        transparan. Mulai perjalanan Anda bersama Titipsini hari
                        ini.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
