import React, { useEffect } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import {
    Check,
    X,
    Clock,
    Package,
    Truck,
    User,
    Calendar,
    MapPin,
    ChevronRight,
    MessageCircle,
    Phone,
    Search,
    Box,
    ArrowLeft,
} from "lucide-react";

// --- Helper: Format Rupiah ---
const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number || 0);
};

// --- Helper: Status Badge ---
const StatusBadge = ({ status }) => {
    let style = "bg-gray-100 text-gray-600 border-gray-200";
    let icon = <Clock size={12} />;
    let label = status?.replace(/_/g, " ") || "Unknown";

    switch (status) {
        case "awaiting_payment":
            style = "bg-yellow-50 text-yellow-700 border-yellow-200";
            label = "Belum Bayar";
            break;
        case "awaiting_verification":
            style = "bg-blue-50 text-blue-700 border-blue-200 animate-pulse";
            label = "Verifikasi";
            break;
        case "processing":
            style = "bg-indigo-50 text-indigo-700 border-indigo-200";
            label = "Diproses";
            break;
        case "ready_for_pickup":
            style = "bg-cyan-50 text-cyan-700 border-cyan-200";
            label = "Menunggu Kurir";
            break;
        case "picked_up":
        case "on_delivery":
            style = "bg-orange-50 text-orange-700 border-orange-200";
            label = "Dalam Pengantaran";
            icon = <Truck size={12} />;
            break;
        case "completed":
        case "delivered":
            style = "bg-emerald-50 text-emerald-700 border-emerald-200";
            label = "Selesai";
            icon = <Check size={12} />;
            break;
        case "cancelled":
        case "rejected":
            style = "bg-red-50 text-red-700 border-red-200";
            label = "Dibatalkan";
            icon = <X size={12} />;
            break;
    }

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${style}`}
        >
            {icon} {label}
        </span>
    );
};

// --- Komponen Kartu Order Modern ---
const OrderCard = ({ order }) => {
    const details = order.user_form_details || {};
    const isPenitipan =
        order.orderable_type?.includes("Service") || !!details.branch_address;

    // Cek apakah pesanan sudah selesai/batal
    const isFinished = ["completed", "cancelled", "rejected"].includes(
        order.status
    );

    // Link WA Kurir yang Aman
    const getCourierWa = (phone) => {
        if (!phone) return "#";
        let number = phone.replace(/\D/g, "");
        if (number.startsWith("0")) number = "62" + number.slice(1);
        const userName = order.user?.name || "Pelanggan";
        return `https://wa.me/${number}?text=${encodeURIComponent(
            `Halo, saya ${userName} pemilik pesanan #${order.id}. Bagaimana statusnya?`
        )}`;
    };

    // Link Detail
    const detailLink = isFinished ? "#" : route("history.show", order.id);

    return (
        <div className="bg-white rounded-3xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-100 hover:border-emerald-200 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gray-50 to-transparent rounded-bl-full -mr-4 -mt-4 group-hover:from-emerald-50 transition-colors"></div>

            {/* Header Card */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 relative z-10 gap-4">
                <div className="flex items-center gap-4">
                    <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md ${
                            isPenitipan
                                ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                                : "bg-gradient-to-br from-blue-500 to-indigo-600"
                        }`}
                    >
                        {isPenitipan ? <Box size={28} /> : <Truck size={28} />}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                Order #{order.id}
                            </span>
                            <StatusBadge status={order.status} />
                        </div>
                        <h3 className="text-lg font-extrabold text-gray-900 mt-0.5">
                            {order.orderable?.name || "Layanan Custom"}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                            <Calendar size={14} className="mr-1.5" />
                            {new Date(order.created_at).toLocaleDateString(
                                "id-ID",
                                {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                }
                            )}
                        </p>
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-xs text-gray-400 font-bold uppercase mb-1">
                        Total Tagihan
                    </p>
                    <span className="text-xl font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                        {formatRupiah(order.final_amount)}
                    </span>
                </div>
            </div>

            {/* Info Kurir */}
            {order.courier && (
                <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-1 rounded-2xl border border-blue-100">
                    <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shadow-sm border-2 border-white">
                                <User size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] text-blue-500 uppercase font-bold tracking-wider mb-0.5">
                                    Kurir Anda
                                </p>
                                <p className="text-sm font-bold text-gray-900">
                                    {order.courier.name}
                                </p>
                                {order.courier.courier_verification && (
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                        <Truck size={10} />{" "}
                                        {
                                            order.courier.courier_verification
                                                .vehicle_brand
                                        }{" "}
                                        •{" "}
                                        <span className="font-mono bg-gray-200 px-1 rounded text-[10px]">
                                            {
                                                order.courier
                                                    .courier_verification
                                                    .plat_nomor
                                            }
                                        </span>
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* [MODIFIKASI] Tombol Kontak Kurir - Mati jika selesai */}
                        <div className="flex gap-2 w-full sm:w-auto">
                            {isFinished ? (
                                // Tampilan Disabled jika sudah selesai
                                <>
                                    <span className="flex-1 sm:flex-none inline-flex justify-center items-center gap-2 px-4 py-2 bg-gray-100 text-gray-400 text-xs font-bold rounded-xl cursor-not-allowed border border-gray-200">
                                        <MessageCircle size={14} /> WhatsApp
                                    </span>
                                    <span className="flex-1 sm:flex-none inline-flex justify-center items-center gap-2 px-4 py-2 bg-gray-100 text-gray-400 text-xs font-bold rounded-xl cursor-not-allowed border border-gray-200">
                                        <Phone size={14} /> Telpon
                                    </span>
                                </>
                            ) : (
                                // Tampilan Aktif jika masih proses
                                <>
                                    <a
                                        href={getCourierWa(order.courier.phone)}
                                        target="_blank"
                                        className="flex-1 sm:flex-none inline-flex justify-center items-center gap-2 px-4 py-2 bg-green-500 text-white text-xs font-bold rounded-xl hover:bg-green-600 transition-all shadow-sm hover:shadow-green-200"
                                    >
                                        <MessageCircle size={14} /> WhatsApp
                                    </a>
                                    {order.courier.phone && (
                                        <a
                                            href={`tel:${order.courier.phone}`}
                                            className="flex-1 sm:flex-none inline-flex justify-center items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-50 transition-all"
                                        >
                                            <Phone size={14} /> Telpon
                                        </a>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center text-xs text-gray-400">
                    <MapPin size={14} className="mr-1.5" />
                    <span className="max-w-[200px] truncate">
                        {details.alamat_penjemputan || "Lokasi sesuai detail"}
                    </span>
                </div>

                <div className="flex gap-3">
                    {order.status === "awaiting_payment" ? (
                        <Link
                            href={route("order.payment", order.id)}
                            className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-bold rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all"
                        >
                            Bayar Sekarang{" "}
                            <ChevronRight size={14} className="ml-1" />
                        </Link>
                    ) : isFinished ? (
                        <span className="inline-flex items-center px-5 py-2.5 bg-gray-100 text-gray-400 text-xs font-bold rounded-xl cursor-not-allowed border border-gray-200">
                            {order.status === "completed"
                                ? "Pesanan Selesai"
                                : "Dibatalkan"}
                        </span>
                    ) : (
                        <Link
                            href={detailLink}
                            className="inline-flex items-center px-5 py-2.5 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-gray-800 hover:shadow-lg transition-all"
                        >
                            {[
                                "on_delivery",
                                "ready_for_pickup",
                                "picked_up",
                            ].includes(order.status)
                                ? "Lacak Paket"
                                : "Lihat Detail"}
                            <ChevronRight size={14} className="ml-1" />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Komponen Pagination ---
const Pagination = ({ links }) => (
    <div className="mt-10 flex justify-center gap-2">
        {links.map((link, key) =>
            link.url === null ? (
                <div
                    key={key}
                    className="px-4 py-2 text-sm font-medium text-gray-400 bg-gray-50 rounded-xl"
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ) : (
                <Link
                    key={key}
                    href={link.url}
                    className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${
                        link.active
                            ? "bg-gray-900 text-white shadow-lg"
                            : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
                    }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            )
        )}
    </div>
);

// --- MAIN PAGE ---
export default function Index({ auth, orders }) {
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ["orders"], preserveScroll: true });
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans">
            <Head title="Riwayat Pesanan" />

            {/* --- CUSTOM HEADER (Sticky) --- */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-3 text-gray-600 hover:text-green-600 transition-colors group"
                    >
                        <div className="p-2 rounded-full bg-gray-50 group-hover:bg-green-50 transition-colors">
                            <ArrowLeft size={20} />
                        </div>
                        <span className="font-bold text-lg text-gray-800 group-hover:text-green-700">
                            Kembali
                        </span>
                    </Link>
                </div>
            </div>

            {/* --- CONTENT AREA --- */}
            <div className="flex-1 py-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                                Aktivitas Saya
                            </h1>
                            <p className="text-gray-500 mt-2">
                                Pantau status pengiriman dan riwayat transaksi
                                Anda.
                            </p>
                        </div>
                    </div>

                    {/* Order List */}
                    {orders.data.length > 0 ? (
                        <div className="space-y-6">
                            {orders.data.map((order) => (
                                <OrderCard key={order.id} order={order} />
                            ))}
                            <Pagination links={orders.links} />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-300 text-center shadow-sm">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                <Search size={32} className="text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">
                                Belum Ada Pesanan
                            </h3>
                            <p className="text-gray-500 mt-2 mb-8 max-w-sm">
                                Anda belum pernah melakukan transaksi. Yuk, coba
                                layanan penitipan atau pindahan kami!
                            </p>
                            <Link
                                href="/layanan"
                                className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all"
                            >
                                Mulai Pesan Sekarang
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* --- CUSTOM FOOTER --- */}
            <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
                <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
                    <p>
                        &copy; {new Date().getFullYear()} Titipsini.com. All
                        rights reserved.
                    </p>
                    <div className="mt-2 flex justify-center gap-4 text-xs font-medium">
                        <Link
                            href="#"
                            className="hover:text-green-600 transition"
                        >
                            Syarat & Ketentuan
                        </Link>
                        <Link
                            href="#"
                            className="hover:text-green-600 transition"
                        >
                            Kebijakan Privasi
                        </Link>
                        <Link
                            href="#"
                            className="hover:text-green-600 transition"
                        >
                            Bantuan
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
