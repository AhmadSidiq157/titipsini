import React, { useState, useEffect } from "react";
import Header from "./Partials/Header";
import Footer from "./Partials/Footer";

export default function GuestLayout({ children, ...props }) {
    const [isAuthPage, setIsAuthPage] = useState(false);

    // useEffect sekarang akan berjalan setiap kali 'children' (halaman) berubah
    useEffect(() => {
        const path = window.location.pathname;
        const authPaths = [
            "/login",
            "/register",
            "/forgot-password",
            "/reset-password",
        ];
        setIsAuthPage(authPaths.some((authPath) => path.startsWith(authPath)));
    }, [children]);

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            {/* Header hanya muncul jika bukan halaman auth */}
            {!isAuthPage && <Header />}

            <main className="flex-grow">
                {/* Kita gunakan React.cloneElement untuk meneruskan props */}
                {React.cloneElement(children, props)}
            </main>

            {/* Footer hanya muncul jika bukan halaman auth */}
            {!isAuthPage && <Footer />}
        </div>
    );
}
