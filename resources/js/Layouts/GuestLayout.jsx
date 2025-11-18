import React, { useState, useEffect } from "react";
import Header from "./Partials/Header";
import Footer from "./Partials/Footer";

export default function GuestLayout({ children }) {
    const [isAuthPage, setIsAuthPage] = useState(false);

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
            {!isAuthPage && <Header />}

            <main className="flex-grow">{children}</main>

            {!isAuthPage && <Footer />}
        </div>
    );
}
