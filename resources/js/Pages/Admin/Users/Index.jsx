import React, { useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, usePage } from "@inertiajs/react";
// [1] Import Toast & Icons
import { Toaster, toast } from "react-hot-toast";
import { ShieldCheck, Truck, User, ShieldAlert, Shield } from "lucide-react";

export default function Index({ auth, users }) {
    const { flash } = usePage().props;

    // Effect untuk Toast Notifikasi
    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success, {
                duration: 3000,
                position: "top-center",
                style: {
                    background: "#10B981",
                    color: "#fff",
                    borderRadius: "12px",
                },
            });
        }
        if (flash.error) {
            toast.error(flash.error, {
                duration: 3000,
                position: "top-center",
            });
        }
    }, [flash]);

    // [LOGIKA UTAMA] Fungsi untuk Menentukan Badge Status
    const getRoleBadge = (user) => {
        // Ambil semua role user dan ubah ke huruf kecil untuk pengecekan yang aman
        // Contoh: "Courier" -> "courier"
        const userRoles = user.roles
            ? user.roles.map((r) => r.name.toLowerCase())
            : [];

        if (userRoles.includes("admin")) {
            // Tampilan untuk ADMIN (Biru)
            return (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                    <Shield size={14} className="mr-1.5" />
                    Admin
                </span>
            );
        } else if (
            userRoles.includes("courier") ||
            userRoles.includes("kurir")
        ) {
            // Tampilan untuk KURIR (Oranye)
            return (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">
                    <Truck size={14} className="mr-1.5" />
                    Kurir
                </span>
            );
        } else {
            // Tampilan Default USER (Abu-abu)
            return (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                    <User size={14} className="mr-1.5" />
                    User
                </span>
            );
        }
    };

    // Helper cek apakah dia admin (untuk menyembunyikan/menampilkan tombol aksi)
    const isAdmin = (user) => {
        return user.roles && user.roles.some((r) => r.name === "admin");
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Manajemen User
                </h2>
            }
        >
            <Head title="Manajemen User" />
            <Toaster />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl shadow-gray-200/50 sm:rounded-3xl border border-gray-100">
                        <div className="p-8">
                            <h3 className="text-2xl font-black text-gray-800 mb-6">
                                Daftar Pengguna
                            </h3>

                            <div className="overflow-x-auto rounded-2xl border border-gray-100">
                                <table className="min-w-full divide-y divide-gray-100">
                                    <thead className="bg-gray-50/50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                                                Nama
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                                                Role / Status
                                            </th>
                                            <th className="px-6 py-4 text-right text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {users.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="hover:bg-gray-50/80 transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-bold text-gray-900 text-sm">
                                                        {user.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {user.email}
                                                </td>

                                                {/* Panggil fungsi status disini */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getRoleBadge(user)}
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                                                    {/* Jika bukan Admin, tampilkan tombol "Jadikan Admin" */}
                                                    {!isAdmin(user) && (
                                                        <Link
                                                            href={route(
                                                                "admin.users.makeAdmin",
                                                                {
                                                                    user: user.id,
                                                                }
                                                            )}
                                                            method="get"
                                                            as="button"
                                                            className="inline-flex items-center text-indigo-600 hover:text-indigo-900 font-bold text-xs bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors mr-2"
                                                        >
                                                            <ShieldCheck
                                                                size={14}
                                                                className="mr-1"
                                                            />{" "}
                                                            Jadikan Admin
                                                        </Link>
                                                    )}

                                                    {/* Jika Admin (dan bukan diri sendiri), tampilkan tombol "Cabut Admin" */}
                                                    {isAdmin(user) &&
                                                        user.id !==
                                                            auth.user.id && (
                                                            <Link
                                                                href={route(
                                                                    "admin.users.removeAdmin",
                                                                    {
                                                                        user: user.id,
                                                                    }
                                                                )}
                                                                method="get"
                                                                as="button"
                                                                className="inline-flex items-center text-red-600 hover:text-red-900 font-bold text-xs bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
                                                            >
                                                                <ShieldAlert
                                                                    size={14}
                                                                    className="mr-1"
                                                                />{" "}
                                                                Cabut Admin
                                                            </Link>
                                                        )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
