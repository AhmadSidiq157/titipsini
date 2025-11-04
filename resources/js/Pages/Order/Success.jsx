import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { CheckCircle } from "lucide-react";

export default function Success({ auth, orderStatus }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Pesanan Diterima
                </h2>
            }
        >
            <Head title="Pesanan Sukses" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 md:p-8 text-gray-900 text-center">
                            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />

                            <h3 className="text-2xl font-bold text-gray-900">
                                Terima Kasih!
                            </h3>

                            <p className="mt-4 text-gray-600 text-lg">
                                Bukti pembayaran Anda telah kami terima.
                            </p>
                            <p className="mt-2 text-gray-600">
                                Admin kami akan segera melakukan verifikasi
                                pembayaran Anda. Status pesanan Anda saat ini:{" "}
                                <span className="font-semibold text-yellow-600">
                                    {orderStatus.replace("_", " ")}
                                </span>
                            </p>

                            <div className="mt-8">
                                <Link
                                    href={route("dashboard")}
                                    className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    Kembali ke Dashboard
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
