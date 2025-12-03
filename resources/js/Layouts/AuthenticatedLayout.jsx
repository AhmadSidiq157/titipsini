import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link, usePage } from "@inertiajs/react";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth?.user;

    // Jika user belum login → tampilkan layout sederhana (untuk login/register)
    if (!user) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                    <div className="flex justify-center mb-6">
                        <Link href="/">
                            <ApplicationLogo className="w-30 h-16 text-indigo-600" />
                        </Link>
                    </div>
                    {children}
                </div>
            </div>
        );
    }

    // Jika user sudah login → tampilkan layout utama TANPA Navbar
    return (
        <div className="min-h-screen bg-gray-100">
            {/* [MODIFIKASI] Navbar (Logo, Dashboard Link, User Menu) SUDAH DIHAPUS.
                Hanya menyisakan Header (Judul Halaman) dan Konten Utama.
            */}

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
