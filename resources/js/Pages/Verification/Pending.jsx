import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { Clock } from "lucide-react";

export default function Pending({ auth }) {
    const { flash } = usePage().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Verifikasi Data Diri
                </h2>
            }
        >
            <Head title="Menunggu Verifikasi" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 md:p-8 text-gray-900 text-center">
                            <Clock className="w-20 h-20 text-blue-500 mx-auto mb-4" />

                            <h3 className="text-2xl font-bold text-gray-900">
                                Menunggu Verifikasi
                            </h3>

                            {flash.info && (
                                <p className="mt-4 text-gray-600 text-lg">
                                    {flash.info}
                                </p>
                            )}

                            <p className="mt-2 text-gray-600">
                                Tim kami akan meninjau data Anda dalam 1x24 jam.
                                Anda akan dapat melanjutkan pemesanan setelah
                                data Anda disetujui.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
