import React from "react"; // <-- Import React
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AdminLayout from "@/Layouts/AdminLayout"; // <-- [BARU] Import layout Admin
import CourierLayout from "@/Layouts/CourierLayout"; // <-- [BARU] Import layout Kurir
import { Head, useForm, usePage } from "@inertiajs/react"; // <-- [BARU] Import usePage
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";

// [MODIFIKASI] Hapus 'auth' dari props
export default function Edit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props; // <-- Ambil 'auth' dari global props

    const { data, setData, post, processing, errors } = useForm({
        name: auth.user.name || "",
        email: auth.user.email || "",
        phone: auth.user.phone || "",
        address: auth.user.address || "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("profile.update"));
    };

    // [MODIFIKASI] Hapus pembungkus <AuthenticatedLayout>
    return (
        <>
            <Head title="Edit Profil" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {/* === FORM CUSTOM UPDATE PROFIL === */}
                    <div className="bg-white p-6 shadow sm:rounded-lg sm:p-8">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">
                            Informasi Pribadi
                        </h3>

                        <form onSubmit={submit} className="space-y-4">
                            {/* Nama */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Nama Lengkap
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
                                />
                                {errors.name && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
                                />
                                {errors.email && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Nomor HP */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Nomor HP
                                </label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) =>
                                        setData("phone", e.target.value)
                                    }
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
                                />
                                {errors.phone && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {errors.phone}
                                    </p>
                                )}
                            </div>

                            {/* Alamat */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Alamat
                                </label>
                                <textarea
                                    rows="3"
                                    value={data.address}
                                    onChange={(e) =>
                                        setData("address", e.target.value)
                                    }
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
                                ></textarea>
                                {errors.address && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {errors.address}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50"
                                >
                                    Simpan Perubahan
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* === FORM GANTI PASSWORD === */}
                    <div className="bg-white p-6 shadow sm:rounded-lg sm:p-8">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">
                            Ganti Password
                        </h3>
                        {/* File Anda sudah benar */}
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    {/* === FORM HAPUS AKUN === */}
                    <div className="bg-white p-6 shadow sm:rounded-lg sm:p-8">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">
                            Hapus Akun
                        </h3>
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </>
    );
}

// --- [LOGIKA PINTAR] ---
// Tambahkan resolver layout dinamis di bagian bawah
Edit.layout = (page) => {
    // Ambil 'user' dari props halaman
    const { auth } = page.props;
    const user = auth.user;

    // Header default (string, bukan <h2>)
    const header = "Edit Profil";

    // Helper untuk cek role (lebih aman)
    const hasRole = (roleName) => {
        // 'roles' sekarang dijamin ada oleh HandleInertiaRequests
        return user.roles?.some((role) => role.name === roleName);
    };

    // 1. Cek jika Admin
    if (hasRole("admin")) {
        return (
            <AdminLayout user={user} header={header}>
                {page}
            </AdminLayout>
        );
    }

    // 2. Cek jika Kurir
    if (hasRole("kurir")) {
        return (
            <CourierLayout user={user} header={header}>
                {page}
            </CourierLayout>
        );
    }

    // 3. Default untuk Klien (Publik)
    // [PERBAIKAN] Kita gunakan AuthenticatedLayout (layout klien)
    // dan kita berikan header h2 seperti aslinya
    return (
        <AuthenticatedLayout
            user={user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    {header}
                </h2>
            }
        >
            {page}
        </AuthenticatedLayout>
    );
};
