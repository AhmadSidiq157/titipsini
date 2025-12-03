import React, { useState, useEffect, useRef } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, usePage, router } from "@inertiajs/react";
import {
    Eye,
    Truck,
    CheckCircle2,
    XCircle,
    Clock,
    Package,
    Wallet,
    Search,
    Filter,
    ArrowRightLeft,
    MapPin,
    ChevronDown, // Pastikan icon ini diimport
} from "lucide-react";

// --- Helper: Format Rupiah ---
const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(number || 0);
};

// --- KAMUS STATUS ---
const STATUS_LABELS = {
    awaiting_payment: "Menunggu Bayar",
    awaiting_verification: "Verifikasi Bayar",
    processing: "Perlu Kurir",
    ready_for_pickup: "Kurir Menjemput",
    picked_up: "Barang Diangkut",
    on_delivery: "Dalam Perjalanan",
    delivered: "Sampai Tujuan",
    completed: "Selesai",
    cancelled: "Dibatalkan",
    rejected: "Ditolak",
};

const getStatusLabel = (status) => {
    return STATUS_LABELS[status] || status.replace(/_/g, " ");
};

// --- Helper: Status Badge ---
const StatusBadge = ({ status }) => {
    let style = "";
    let icon = null;
    const label = getStatusLabel(status);

    switch (status) {
        case "awaiting_payment":
            style = "bg-amber-100 text-amber-700 border-amber-200";
            icon = <Wallet className="w-3.5 h-3.5 mr-1.5" />;
            break;
        case "awaiting_verification":
            style = "bg-blue-100 text-blue-700 border-blue-200 animate-pulse";
            icon = <Clock className="w-3.5 h-3.5 mr-1.5" />;
            break;
        case "processing":
            style = "bg-pink-100 text-pink-700 border-pink-200 font-bold";
            icon = <Package className="w-3.5 h-3.5 mr-1.5" />;
            break;
        case "ready_for_pickup":
            style = "bg-indigo-100 text-indigo-700 border-indigo-200";
            icon = <Truck className="w-3.5 h-3.5 mr-1.5" />;
            break;
        case "picked_up":
        case "on_delivery":
            style = "bg-purple-100 text-purple-700 border-purple-200";
            icon = <MapPin className="w-3.5 h-3.5 mr-1.5" />;
            break;
        case "completed":
            style = "bg-emerald-100 text-emerald-700 border-emerald-200";
            icon = <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />;
            break;
        case "cancelled":
        case "rejected":
            style = "bg-red-100 text-red-700 border-red-200";
            icon = <XCircle className="w-3.5 h-3.5 mr-1.5" />;
            break;
        default:
            style = "bg-gray-100 text-gray-700 border-gray-200";
            icon = <Clock className="w-3.5 h-3.5 mr-1.5" />;
    }

    return (
        <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${style} whitespace-nowrap transition-transform hover:scale-105`}
        >
            {icon}
            {label}
        </span>
    );
};

// --- Pagination Component ---
const Pagination = ({ links }) => {
    if (!links || links.length <= 1) return null;
    return (
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 mt-6">
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

export default function Index({ auth, orders, couriers, flash, filters }) {
    const [search, setSearch] = useState(filters?.search || "");
    const [status, setStatus] = useState(filters?.status || "all");
    const isFirstRender = useRef(true);

    // Auto-search effect (Debounce)
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const timer = setTimeout(() => {
            router.get(
                route("admin.pindahan.index"),
                { search, status },
                { preserveState: true, preserveScroll: true, replace: true }
            );
        }, 300);
        return () => clearTimeout(timer);
    }, [search, status]);

    const filterOptions = [
        { value: "all", label: "Semua Status" },
        { value: "awaiting_payment", label: "Belum Bayar" },
        { value: "awaiting_verification", label: "Verifikasi" },
        { value: "processing", label: "Perlu Kurir" },
        { value: "ready_for_pickup", label: "Dijemput" },
        { value: "on_delivery", label: "Di Jalan" },
        { value: "completed", label: "Selesai" },
        { value: "cancelled", label: "Dibatalkan" },
    ];

    return (
        <AdminLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="font-black text-2xl text-gray-800 leading-tight tracking-tight">
                            Pesanan Pindahan
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            Monitoring armada & status pengiriman
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200 text-sm font-bold text-gray-600 flex items-center gap-2 whitespace-nowrap">
                            <Truck className="w-4 h-4 text-emerald-500" />
                            Total Order:{" "}
                            <span className="text-emerald-600 text-lg">
                                {orders.total}
                            </span>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Manajemen Pesanan Pindahan" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flash.success && (
                        <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl flex items-center shadow-sm animate-in slide-in-from-top-2">
                            <CheckCircle2 className="w-5 h-5 mr-2 bg-emerald-200 rounded-full p-0.5" />{" "}
                            {flash.success}
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-xl shadow-gray-200/50 sm:rounded-3xl border border-gray-100">
                        {/* --- CONTROL BAR MODERN & MINIMALIS (Gaya Dropdown) --- */}
                        <div className="p-6 border-b border-gray-100 bg-gradient-to-b from-white to-gray-50/50">
                            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                                {/* 1. Search Bar */}
                                <div className="relative w-full md:flex-1 group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        placeholder="Cari ID Pesanan, Nama User..."
                                        className="pl-11 pr-4 py-3.5 border-gray-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 w-full transition-all shadow-sm group-hover:shadow-md bg-white"
                                    />
                                </div>

                                {/* 2. Filter Dropdown (Menggantikan tombol horizontal) */}
                                <div className="relative w-full md:w-64 group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Filter className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                    </div>
                                    <select
                                        value={status}
                                        onChange={(e) =>
                                            setStatus(e.target.value)
                                        }
                                        className="pl-11 pr-10 py-3.5 w-full border-gray-200 rounded-2xl text-sm font-bold text-gray-700 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 appearance-none bg-white shadow-sm cursor-pointer hover:border-emerald-300 transition-all"
                                    >
                                        {filterOptions.map((opt) => (
                                            <option
                                                key={opt.value}
                                                value={opt.value}
                                            >
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                                        <ChevronDown className="h-4 w-4" />
                                    </div>
                                </div>

                                {/* 3. Reset Button (Muncul jika filter aktif) */}
                                {(search || status !== "all") && (
                                    <button
                                        onClick={() => {
                                            setSearch("");
                                            setStatus("all");
                                        }}
                                        className="p-3.5 rounded-2xl bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors border border-gray-200 shadow-sm"
                                        title="Reset Filter"
                                    >
                                        <ArrowRightLeft className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* TABLE CONTENT */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50/80 backdrop-blur-sm">
                                    <tr>
                                        {[
                                            "ID",
                                            "Klien",
                                            "Paket Pindahan",
                                            "Total Biaya",
                                            "Status",
                                            "Kurir",
                                            "Aksi",
                                        ].map((head) => (
                                            <th
                                                key={head}
                                                className="py-4 px-6 text-left text-xs font-extrabold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                                            >
                                                {head}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {orders.data.length > 0 ? (
                                        orders.data.map((order) => {
                                            const isUrgent = [
                                                "awaiting_verification",
                                                "processing",
                                            ].includes(order.status);

                                            return (
                                                <tr
                                                    key={order.id}
                                                    className={`group transition-colors duration-200 ${
                                                        isUrgent
                                                            ? "bg-blue-50/40 hover:bg-blue-50/70"
                                                            : "hover:bg-gray-50/80"
                                                    }`}
                                                >
                                                    <td className="py-4 px-6 whitespace-nowrap">
                                                        <span className="font-mono text-sm font-bold text-gray-700 group-hover:text-emerald-600 transition-colors">
                                                            #{order.id}
                                                        </span>
                                                        <div className="text-[10px] text-gray-400 mt-1">
                                                            {new Date(
                                                                order.created_at
                                                            ).toLocaleDateString(
                                                                "id-ID"
                                                            )}
                                                        </div>
                                                    </td>

                                                    <td className="py-4 px-6 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center text-indigo-700 font-bold text-sm mr-3 shadow-sm border border-indigo-200 flex-shrink-0">
                                                                {order.user.name.charAt(
                                                                    0
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-bold text-gray-900">
                                                                    {
                                                                        order
                                                                            .user
                                                                            .name
                                                                    }
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    {
                                                                        order
                                                                            .user
                                                                            .email
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="py-4 px-6 whitespace-nowrap">
                                                        <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded-md">
                                                            {order.orderable
                                                                ?.name ||
                                                                "Paket Custom"}
                                                        </span>
                                                    </td>

                                                    <td className="py-4 px-6 whitespace-nowrap">
                                                        <span className="text-sm font-extrabold text-gray-900">
                                                            {formatRupiah(
                                                                order.final_amount
                                                            )}
                                                        </span>
                                                    </td>

                                                    <td className="py-4 px-6 whitespace-nowrap">
                                                        <StatusBadge
                                                            status={
                                                                order.status
                                                            }
                                                        />
                                                    </td>

                                                    <td className="py-4 px-6 whitespace-nowrap">
                                                        {order.courier ? (
                                                            <div className="flex items-center gap-2">
                                                                <Truck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                                                <span className="text-sm font-bold text-gray-800">
                                                                    {
                                                                        order
                                                                            .courier
                                                                            .name
                                                                    }
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-gray-400 italic">
                                                                Belum ditugaskan
                                                            </span>
                                                        )}
                                                    </td>

                                                    <td className="py-4 px-6 text-right text-sm font-medium whitespace-nowrap">
                                                        <Link
                                                            href={route(
                                                                "admin.pindahan.show",
                                                                order.id
                                                            )}
                                                            className={`inline-flex items-center px-4 py-2 border text-sm leading-4 font-bold rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all transform hover:-translate-y-0.5 ${
                                                                isUrgent
                                                                    ? "border-transparent text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-200"
                                                                    : "border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:border-emerald-300 hover:text-emerald-600"
                                                            }`}
                                                        >
                                                            <Eye className="ml-2 -mr-0.5 h-4 w-4" />
                                                            {isUrgent
                                                                ? "Tindak"
                                                                : "Detail"}
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="py-20 text-center"
                                            >
                                                <div className="flex flex-col items-center justify-center text-gray-400 animate-in fade-in zoom-in duration-500">
                                                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-dashed border-gray-200">
                                                        <Search className="w-10 h-10 text-gray-300" />
                                                    </div>
                                                    <p className="text-xl font-bold text-gray-600">
                                                        Tidak ada pesanan
                                                        ditemukan.
                                                    </p>
                                                    <button
                                                        onClick={() => {
                                                            setSearch("");
                                                            setStatus("all");
                                                        }}
                                                        className="mt-6 text-emerald-600 font-bold hover:underline flex items-center text-sm"
                                                    >
                                                        <ArrowRightLeft className="w-4 h-4 mr-2" />{" "}
                                                        Reset Filter
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                            <Pagination links={orders.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
