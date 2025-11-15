import React from "react"; // <-- [BARU] Import React
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout"; // <-- [PERBAIKAN] Ganti ke alias @/
import { Head, Link, useForm } from "@inertiajs/react";

export default function RegisterCourier() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("register.courier"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    // [MODIFIKASI] Kita tidak lagi membungkusnya dengan <GuestLayout>
    // Kita bungkus dengan React.Fragment <> ... </> agar bisa mengembalikan 2 elemen
    return (
        <>
            <Head title="Daftar Kurir" />

            {/* Tambahkan margin atas & bawah agar tidak menempel di header/footer */}
            <form
                onSubmit={submit}
                className="max-w-md mx-auto my-16 sm:my-20 p-8 bg-white shadow-md rounded-lg"
            >
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                    Daftar Sebagai Kurir
                </h2>
                <p className="text-center text-gray-600 mb-6 text-sm">
                    Daftar untuk menjadi mitra kurir Titipsini. Setelah
                    mendaftar, Anda akan diarahkan untuk melengkapi data
                    verifikasi.
                </p>

                <div>
                    <InputLabel htmlFor="name" value="Nama Lengkap" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Alamat Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData("email", e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData("password", e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Konfirmasi Password"
                    />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        required
                    />
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="mt-6 flex items-center justify-between">
                    <Link
                        href={route("login")}
                        className="text-sm text-indigo-600 hover:underline"
                    >
                        Sudah punya akun?
                    </Link>

                    <PrimaryButton disabled={processing}>
                        Daftar Kurir
                    </PrimaryButton>
                </div>

                <div className="mt-6 text-center border-t pt-4">
                    <Link
                        href={route("register")}
                        className="text-sm text-gray-600 hover:text-indigo-600 hover:underline"
                    >
                        Bukan kurir? Daftar sebagai Klien
                    </Link>
                </div>
            </form>
        </>
    );
}

// [MODIFIKASI UTAMA] Tugaskan layout di sini, sama seperti Welcome.jsx
RegisterCourier.layout = (page) => <GuestLayout children={page} />;
