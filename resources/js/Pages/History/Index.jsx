import React, { useEffect } from "react"; // <-- [BARU] Import useEffect
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, router } from "@inertiajs/react"; // <-- [BARU] Import router
import { Check, X, Clock, Package, Truck, DollarSign } from "lucide-react";

// ... (Helper formatRupiah, StatusBadge, Pagination tidak berubah)
const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number || 0);
};

const StatusBadge = ({ status }) => {
    let bgColor = "bg-gray-100 text-gray-800";
    let Icon = Clock;

    switch (status) {
        case "awaiting_payment":
            bgColor = "bg-yellow-100 text-yellow-800";
            Icon = DollarSign;
            break;
        case "awaiting_verification":
            bgColor = "bg-blue-100 text-blue-800";
            Icon = Clock;
            break;
        case "processing":
            bgColor = "bg-cyan-100 text-cyan-800";
            Icon = Package;
            break;
        case "ready_for_pickup":
            bgColor = "bg-indigo-100 text-indigo-800";
            Icon = Truck;
            break;
        case "on_delivery":
            bgColor = "bg-purple-100 text-purple-800";
            Icon = Truck;
            break;
        case "completed":
            bgColor = "bg-green-100 text-green-800";
            Icon = Check;
            break;
        case "cancelled":
        case "rejected":
            bgColor = "bg-red-100 text-red-800";
            Icon = X;
            break;
    }

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor}`}
        >
            <Icon className="w-3 h-3" />
            {status.replace("_", " ").charAt(0).toUpperCase() +
                status.replace("_", " ").slice(1)}
        </span>
    );
};

const Pagination = ({ links }) => (
    <div className="mt-6 flex justify-between items-center">
        <div className="flex flex-wrap">
            {links.map((link, key) =>
                link.url === null ? (
                    <div
                        key={key}
                        className="mr-1 mb-1 px-4 py-2 text-sm leading-4 text-gray-400 border rounded"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <Link
                        key={key}
                        className={`mr-1 mb-1 px-4 py-2 text-sm leading-4 border rounded hover:bg-white focus:border-indigo-500 focus:text-indigo-500 ${
                            link.active ? "bg-white" : ""
                        }`}
                        href={link.url}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                )
            )}
        </div>
    </div>
);
// --- Akhir Helper ---

export default function Index({ auth, orders }) {
    // [BARU] Logika Polling
    useEffect(() => {
        // Tentukan interval (setiap 7 detik)
        const interval = setInterval(() => {
            // Panggil Inertia untuk me-reload HANYA data 'orders'
            router.reload({
                only: ["orders"],
                preserveState: true,
                preserveScroll: true,
            });
        }, 7000); // 7000 ms = 7 detik

        // Hentikan interval jika user pindah halaman
        return () => clearInterval(interval);
    }, []); // '[]' berarti jalankan sekali saja

    return (
        <>
            <Head title="Riwayat Pesanan Saya" />

            <div className="py-12 md:py-20 bg-gray-50 min-h-screen">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Judul Halaman */}
                    <div className="mb-12">
                        <h1 className="text-4xl font-extrabold text-gray-800">
                            Riwayat Pesanan Saya
                        </h1>
                        <p className="mt-2 text-lg text-gray-600">
                            Lihat semua riwayat transaksi penitipan dan pindahan
                            Anda.
                        </p>
                        {/* [BARU] Teks indikator polling */}
                        <p className="mt-2 text-sm text-gray-500 flex items-center">
                            <Clock className="w-4 h-4 mr-1.5 animate-spin" />
                            Status pesanan akan diperbarui secara otomatis.
                        </p>
                    </div>

                    {/* Tabel Riwayat */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="py-3 px-4 border-b text-left">
                                                Layanan
                                            </th>
                                            <th className="py-3 px-4 border-b text-left">
                                                Tanggal
                                            </th>
                                            <th className="py-3 px-4 border-b text-left">
                                                Total
                                            </th>
                                            <th className="py-3 px-4 border-b text-left">
                                                Status Pesanan
                                            </th>
                                            <th className="py-3 px-4 border-b text-left">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.data.length > 0 ? (
                                            orders.data.map((order) => (
                                                <tr
                                                    key={order.id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="py-4 px-4 border-b font-medium">
                                                        {order.orderable
                                                            ? order.orderable
                                                                  .name ||
                                                              order.orderable
                                                                  .title
                                                            : "Layanan Dihapus"}
                                                    </td>
                                                    <td className="py-4 px-4 border-b text-sm text-gray-600">
                                                        {new Date(
                                                            order.created_at
                                                        ).toLocaleDateString(
                                                            "id-ID",
                                                            {
                                                                dateStyle:
                                                                    "long",
                                                            }
                                                        )}
                                                    </td>
                                                    <td className="py-4 px-4 border-b font-semibold">
                                                        {formatRupiah(
                                                            order.final_amount
                                                        )}
                                                    </td>
                                                    <td className="py-4 px-4 border-b">
                                                        <StatusBadge
                                                            status={
                                                                order.status
                                                            }
                                                        />
                                                    </td>
                                                    <td className="py-4 px-4 border-b">
                                                        {/* Tombol Aksi Dinamis */}
                                                        {order.status ===
                                                        "awaiting_payment" ? (
                                                            <Link
                                                                href={route(
                                                                    "order.payment",
                                                                    order.id
                                                                )}
                                                                className="px-4 py-2 bg-green-600 text-white text-xs font-semibold rounded-md hover:bg-green-700"
                                                            >
                                                                Bayar Sekarang
                                                            </Link>
                                                        ) : (
                                                            <button
                                                                disabled
                                                                className="px-4 py-2 bg-gray-200 text-gray-500 text-xs font-semibold rounded-md cursor-not-allowed"
                                                            >
                                                                Detail
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    className="py-10 px-4 border-b text-center text-gray-500"
                                                >
                                                    Anda belum memiliki riwayat
                                                    pesanan.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <Pagination links={orders.links} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// Tugaskan GuestLayout
Index.layout = (page) => <GuestLayout children={page} />;
