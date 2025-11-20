import React, { useEffect } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
    Check,
    X,
    Clock,
    Package,
    Truck,
    DollarSign,
    User,
    Calendar,
    MapPin,
    ChevronRight,
    AlertCircle,
} from "lucide-react";

const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number || 0);
};

const StatusBadge = ({ status }) => {
    const styles = {
        awaiting_payment: "bg-yellow-50 text-yellow-700 border-yellow-200",
        awaiting_verification: "bg-blue-50 text-blue-700 border-blue-200",
        processing: "bg-cyan-50 text-cyan-700 border-cyan-200",
        ready_for_pickup: "bg-indigo-50 text-indigo-700 border-indigo-200",
        picked_up: "bg-purple-50 text-purple-700 border-purple-200",
        on_delivery:
            "bg-orange-50 text-orange-700 border-orange-200 animate-pulse",
        completed: "bg-green-50 text-green-700 border-green-200",
        cancelled: "bg-red-50 text-red-700 border-red-200",
    };
    const styleClass =
        styles[status] || "bg-gray-50 text-gray-700 border-gray-200";

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${styleClass}`}
        >
            {status.replace("_", " ")}
        </span>
    );
};

// [BARU] Komponen Kartu Order Modern
const OrderCard = ({ order }) => {
    const details = order.user_form_details || {};
    const isPindahan = !!details.alamat_penjemputan;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100 mb-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="flex items-center gap-4">
                    <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm ${
                            isPindahan ? "bg-blue-500" : "bg-green-500"
                        }`}
                    >
                        {isPindahan ? (
                            <Truck size={24} />
                        ) : (
                            <Package size={24} />
                        )}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">
                            {order.orderable
                                ? order.orderable.name || order.orderable.title
                                : "Layanan Tidak Tersedia"}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {new Date(order.created_at).toLocaleDateString(
                                "id-ID",
                                { dateStyle: "long" }
                            )}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <StatusBadge status={order.status} />
                    <span className="text-lg font-bold text-green-600 bg-green-50 px-3 py-1 rounded-lg">
                        {formatRupiah(order.final_amount)}
                    </span>
                </div>
            </div>

            {/* Info Kurir (Jika Ada) */}
            {order.courier && (
                <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 shadow-sm">
                        <User size={20} />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-gray-500 uppercase font-bold">
                            Kurir Bertugas
                        </p>
                        <p className="text-sm font-bold text-gray-900">
                            {order.courier.name}
                        </p>
                        {order.courier.courier_verification && (
                            <p className="text-xs text-gray-600 mt-0.5">
                                {
                                    order.courier.courier_verification
                                        .vehicle_brand
                                }{" "}
                                •{" "}
                                {order.courier.courier_verification.plat_nomor}
                            </p>
                        )}
                    </div>
                    {/* Tombol Chat WA Kurir */}
                    <a
                        href={`https://wa.me/${order.courier.phone}`}
                        target="_blank"
                        className="text-green-600 hover:text-green-700 font-semibold text-sm"
                    >
                        Chat WA
                    </a>
                </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                {/* Tracking Terakhir */}
                <div className="text-sm text-gray-500">
                    {order.trackings && order.trackings.length > 0 ? (
                        <span className="flex items-center text-blue-600">
                            <Clock size={14} className="mr-1.5" />
                            {order.trackings[0].description}
                        </span>
                    ) : (
                        <span>Belum ada update tracking.</span>
                    )}
                </div>

                {/* Tombol Aksi */}
                <div>
                    {order.status === "awaiting_payment" ? (
                        <Link
                            href={route("order.payment", order.id)}
                            className="px-4 py-2 bg-green-600 text-white text-xs font-semibold rounded-md hover:bg-green-700"
                        >
                            Bayar Sekarang
                        </Link>
                    ) : (
                        // [PERBAIKAN] Tombol Detail sekarang aktif dan mengarah ke history.show
                        <Link
                            href={route("history.show", order.id)} // <-- Rute baru
                            className="px-4 py-2 bg-blue-50 text-blue-600 text-xs font-semibold rounded-md hover:bg-blue-100 border border-blue-200"
                        >
                            Detail & Lacak
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

const Pagination = ({ links }) => (
    <div className="mt-8 flex justify-center gap-2">
        {links.map((link, key) =>
            link.url === null ? (
                <div
                    key={key}
                    className="px-4 py-2 text-sm text-gray-400 border border-transparent rounded-lg"
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ) : (
                <Link
                    key={key}
                    href={link.url}
                    className={`px-4 py-2 text-sm font-bold border rounded-lg transition-all ${
                        link.active
                            ? "bg-green-600 text-white border-green-600 shadow-md"
                            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            )
        )}
    </div>
);

export default function Index({ auth, orders }) {
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({
                only: ["orders"],
                preserveState: true,
                preserveScroll: true,
            });
        }, 7000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Head title="Riwayat Pesanan" />
            <div className="py-12 md:py-20 bg-gray-50/50 min-h-screen">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                    <div className="mb-10 text-center sm:text-left">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                            Riwayat Pesanan
                        </h1>
                        <p className="mt-2 text-lg text-gray-600">
                            Pantau status pesanan Anda secara real-time di sini.
                        </p>
                    </div>

                    {orders.data.length > 0 ? (
                        <div>
                            {orders.data.map((order) => (
                                <OrderCard key={order.id} order={order} />
                            ))}
                            <Pagination links={orders.links} />
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-dashed border-gray-300">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Package size={32} className="text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">
                                Belum Ada Pesanan
                            </h3>
                            <p className="text-gray-500 mt-2 mb-6">
                                Anda belum melakukan pemesanan layanan apapun.
                            </p>
                            <Link
                                href="/layanan"
                                className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-200"
                            >
                                Pesan Sekarang
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Index.layout = (page) => <GuestLayout children={page} />;
