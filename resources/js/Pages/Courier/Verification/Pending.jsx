import React, { useEffect } from "react"; // <-- [BARU] Import useEffect
import { Head, Link, router } from "@inertiajs/react"; // <-- [BARU] Import router
import CourierLayout from "@/Layouts/CourierLayout";
import { Clock } from "lucide-react";

export default function Pending({ auth }) {
    // [BARU] Logika Polling
    useEffect(() => {
        // Tentukan interval (setiap 5 detik)
        const interval = setInterval(() => {
            // Panggil Inertia untuk me-reload data props halaman ini.
            // Kita hanya butuh 'auth' (yang berisi status verifikasi baru)
            router.reload({
                only: ["auth"], // Hanya minta prop 'auth', jangan refresh seluruh halaman
                preserveState: true,
                preserveScroll: true,
                onSuccess: (page) => {
                    // Cek di sini JIKA middleware GAGAL menangkap
                    // (Meskipun seharusnya middleware yang menangani ini)
                    const newStatus =
                        page.props.auth.user?.courier_verification?.status;
                    if (newStatus === "approved") {
                        router.visit(route("courier.dashboard"));
                    }
                },
            });
        }, 5000); // 5000 ms = 5 detik

        // Fungsi cleanup: Hentikan interval jika user pindah halaman
        return () => clearInterval(interval);
    }, []); // '[]' berarti jalankan efek ini sekali saja saat komponen dimuat

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
                    <Clock className="mx-auto h-16 w-16 text-blue-500 animate-spin" />
                    <h3 className="mt-4 text-2xl font-semibold text-gray-900">
                        Data Anda Sedang Ditinjau
                    </h3>
                    <p className="mt-2 text-gray-600">
                        Data verifikasi Anda telah berhasil dikirim. Admin akan
                        segera meninjau data Anda.
                    </p>
                    <p className="mt-2 text-gray-600">
                        {/* [MODIFIKASI] Beri tahu user bahwa ini otomatis */}
                        Halaman ini akan beralih secara otomatis setelah akun
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
