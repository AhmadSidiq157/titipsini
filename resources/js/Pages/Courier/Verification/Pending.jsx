import React from "react";
import { Head, Link } from "@inertiajs/react";
import CourierLayout from "@/Layouts/CourierLayout";
import { Clock } from "lucide-react";

export default function Pending({ auth }) {
    return (
        <CourierLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Menunggu Persetujuan
                </h2>
            }
        >
            <Head title="Menunggu Persetujuan" />

            <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-10 text-center">
                    <Clock className="mx-auto h-16 w-16 text-blue-500" />
                    <h3 className="mt-4 text-2xl font-semibold text-gray-900">
                        Data Anda Sedang Ditinjau
                    </h3>
                    <p className="mt-2 text-gray-600">
                        Data verifikasi Anda telah berhasil dikirim. Admin akan
                        segera meninjau data Anda.
                    </p>
                    <p className="mt-2 text-gray-600">
                        Anda akan dapat mengakses dashboard tugas setelah akun
                        Anda disetujui.
                    </p>
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="mt-6 inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700"
                    >
                        Logout
                    </Link>
                </div>
            </div>
        </CourierLayout>
    );
}
