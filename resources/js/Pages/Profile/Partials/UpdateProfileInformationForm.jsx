import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";
import { Link, useForm, usePage } from "@inertiajs/react";
import { User, Mail, Save } from "lucide-react";

export default function UpdateProfileInformationForm({
    mustVerifyEmail,
    status,
    className = "",
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();
        // [PENTING] Menggunakan 'patch' agar sesuai dengan route Laravel (Route::patch)
        patch(route("profile.update"));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Informasi Profil
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Perbarui informasi profil akun dan alamat email Anda.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                {/* Input Nama */}
                <div>
                    <InputLabel
                        htmlFor="name"
                        value="Nama Lengkap"
                        className="mb-1"
                    />
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <TextInput
                            id="name"
                            className="pl-10 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                            isFocused
                            autoComplete="name"
                            placeholder="Nama Anda"
                        />
                    </div>
                    <InputError className="mt-2" message={errors.name} />
                </div>

                {/* Input Email */}
                <div>
                    <InputLabel
                        htmlFor="email"
                        value="Email"
                        className="mb-1"
                    />
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <TextInput
                            id="email"
                            type="email"
                            className="pl-10 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            required
                            autoComplete="username"
                            placeholder="nama@email.com"
                        />
                    </div>
                    <InputError className="mt-2" message={errors.email} />
                </div>

                {/* Verifikasi Email (Jika Diperlukan) */}
                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="text-sm mt-2 text-gray-800">
                            Alamat email Anda belum diverifikasi.
                            <Link
                                href={route("verification.send")}
                                method="post"
                                as="button"
                                className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                Klik di sini untuk mengirim ulang email
                                verifikasi.
                            </Link>
                        </p>

                        {status === "verification-link-sent" && (
                            <div className="mt-2 font-medium text-sm text-green-600">
                                Tautan verifikasi baru telah dikirim ke alamat
                                email Anda.
                            </div>
                        )}
                    </div>
                )}

                {/* Tombol Simpan */}
                <div className="flex items-center gap-4">
                    <PrimaryButton
                        disabled={processing}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 active:bg-green-800 focus:ring-green-500"
                    >
                        <Save className="w-4 h-4" />
                        Simpan
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition ease-in-out"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-green-600 font-medium">
                            Tersimpan.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
