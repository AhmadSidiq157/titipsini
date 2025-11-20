import React from "react";
import { usePage, Link } from "@inertiajs/react";
import Header from "./Partials/Header";
import Footer from "./Partials/Footer";

export default function GuestLayout({ children }) {
    const { url } = usePage();

    // Daftar halaman Auth yang tampilannya polosan (tanpa navbar/footer)
    const authPaths = [
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
        "/courier/login",
        "/courier/register",
    ];

    // Cek apakah halaman saat ini adalah halaman Auth
    const isAuthPage = authPaths.some((path) => url.startsWith(path));

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col font-sans text-gray-900 antialiased">
            {/* Navbar hanya muncul jika BUKAN halaman Auth */}
            {!isAuthPage && <Header />}

            <main
                className={`flex-grow ${
                    isAuthPage
                        ? "flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
                        : ""
                }`}
            >
                <div className={isAuthPage ? "w-full max-w-md" : "w-full"}>
                    {children}
                </div>
            </main>

            {/* Footer hanya muncul jika BUKAN halaman Auth */}
            {!isAuthPage && <Footer />}
        </div>
    );
}
