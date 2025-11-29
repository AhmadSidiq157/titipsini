import React, { useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { Toaster, toast } from "react-hot-toast";
import {
    CheckCircle2,
    XCircle,
    Clock,
    Truck,
    Search,
    AlertCircle,
} from "lucide-react";

// --- Komponen Status Badge Modern ---
const StatusBadge = ({ status }) => {
    let style = "";
    let icon = null;
    const label = status || "unknown";

    switch (label) {
        case "pending":
            style = "bg-yellow-100 text-yellow-800 border-yellow-200";
            icon = <Clock className="w-3.5 h-3.5 mr-1.5" />;
            break;
        case "approved":
            style = "bg-emerald-100 text-emerald-800 border-emerald-200";
            icon = <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />;
            break;
        case "rejected":
            style = "bg-red-100 text-red-800 border-red-200";
            icon = <XCircle className="w-3.5 h-3.5 mr-1.5" />;
            break;
        default:
            style = "bg-gray-100 text-gray-800 border-gray-200";
            icon = <AlertCircle className="w-3.5 h-3.5 mr-1.5" />;
            break;
    }

    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${style} capitalize whitespace-nowrap shadow-sm`}
        >
            {icon}
            {label.replace("_", " ")}
        </span>
    );
};

// --- [MODIFIKASI] Pagination Tema Hijau ---
const Pagination = ({ links }) => {
    if (!links || links.length <= 1) return null;
    return (
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 mt-8">
            {links.map((link, index) => {
                let label = link.label
                    .replace("&laquo; Previous", "«")
                    .replace("Next &raquo;", "»");
                const baseClasses =
                    "px-3 py-2 text-sm font-medium border rounded-xl transition-all shadow-sm flex items-center justify-center min-w-[40px]";

                if (link.url === null) {
                    return (
                        <span
                            key={index}
                            className={`${baseClasses} bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed`}
                            dangerouslySetInnerHTML={{ __html: label }}
                        />
                    );
                }
                return (
                    <Link
                        key={index}
                        href={link.url}
                        preserveState
                        preserveScroll
                        className={`${baseClasses} ${
                            link.active
                                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-transparent shadow-emerald-200 shadow-md"
                                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-emerald-600 hover:border-emerald-200"
                        }`}
                        dangerouslySetInnerHTML={{ __html: label }}
                    />
                );
            })}
        </div>
    );
};

export default function Index({ auth, verifications }) {
    const { flash } = usePage().props;

    // Effect untuk Toast Notifikasi
    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success, {
                duration: 4000,
                position: "top-center",
                style: {
                    background: "#10B981",
                    color: "#fff",
                    borderRadius: "12px",
                    fontWeight: "bold",
                },
                iconTheme: {
                    primary: "#fff",
                    secondary: "#10B981",
                },
            });
        }
        if (flash.error) {
            toast.error(flash.error, {
                duration: 4000,
                position: "top-center",
            });
        }
    }, [flash]);

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Verifikasi Kurir
                </h2>
            }
        >
            <Head title="Verifikasi Kurir" />

            {/* Render Toaster */}
            <Toaster />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl shadow-gray-200/50 sm:rounded-3xl border border-gray-100">
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-2xl font-black text-gray-800">
                                        Daftar Pengajuan Verifikasi
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Tinjau data kendaraan dan dokumen mitra
                                        kurir.
                                    </p>
                                </div>
                            </div>

                            <div className="overflow-x-auto rounded-2xl border border-gray-100">
                                <table className="min-w-full bg-white">
                                    <thead className="bg-gray-50/50">
                                        <tr>
                                            <th className="py-4 px-6 border-b border-gray-100 text-left text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                                                Nama Kurir
                                            </th>
                                            <th className="py-4 px-6 border-b border-gray-100 text-left text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                                                Kendaraan
                                            </th>
                                            <th className="py-4 px-6 border-b border-gray-100 text-left text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                                                Plat Nomor
                                            </th>
                                            <th className="py-4 px-6 border-b border-gray-100 text-left text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="py-4 px-6 border-b border-gray-100 text-right text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {verifications.data.map((v) => (
                                            <tr
                                                key={v.id}
                                                className="hover:bg-gray-50/80 transition-colors"
                                            >
                                                <td className="py-4 px-6">
                                                    <div className="font-bold text-gray-900 text-sm">
                                                        {v.user.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-0.5">
                                                        {v.user.email}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-sm text-gray-700">
                                                    <div className="flex items-center gap-2">
                                                        <Truck
                                                            size={16}
                                                            className="text-gray-400"
                                                        />
                                                        <span>
                                                            {v.vehicle_brand}{" "}
                                                            {v.vehicle_model}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-sm font-mono text-gray-700">
                                                    <span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold">
                                                        {v.plat_nomor}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <StatusBadge
                                                        status={v.status}
                                                    />
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <Link
                                                        href={route(
                                                            "admin.courier_verifications.show",
                                                            v.id
                                                        )}
                                                        className="inline-flex items-center px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors"
                                                    >
                                                        <Search
                                                            size={14}
                                                            className="mr-1.5"
                                                        />
                                                        Tinjau
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                        {verifications.data.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    className="py-12 text-center text-gray-400 italic"
                                                >
                                                    Tidak ada data verifikasi
                                                    baru.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <Pagination links={verifications.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
