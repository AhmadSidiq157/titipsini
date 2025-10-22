import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import AdminSidebar from "./Partials/AdminSidebar";
import { Menu, X, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout({ user, header, children }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="relative flex h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 overflow-hidden">
            {/* Sidebar untuk Desktop */}
            <div className="hidden md:flex">
                <AdminSidebar />
            </div>
            {/* Sidebar untuk Mobile */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            className="fixed inset-0 bg-black/40 z-40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)}
                        />

                        {/* Sidebar Slide */}
                        <motion.div
                            className="fixed z-50 inset-y-0 left-0 w-72 bg-white shadow-xl md:hidden flex flex-col"
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ type: "spring", stiffness: 80 }}
                        >
                            <div className="flex justify-between items-center px-4 py-4 border-b">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Menu
                                </h2>
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    <X size={22} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                <AdminSidebar />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            {/* Konten Utama */}
            <div className="flex-1 flex flex-col overflow-hidden backdrop-blur-xl">
                {/* Navbar */}
                <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-30 border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Tombol Mobile Menu */}
                            <div className="md:hidden">
                                <button
                                    onClick={() =>
                                        setSidebarOpen(!isSidebarOpen)
                                    }
                                    className="text-gray-600 hover:text-indigo-600 transition"
                                >
                                    <Menu size={24} />
                                </button>
                            </div>

                            {/* Judul Halaman */}
                            <motion.div
                                className="flex-1 flex justify-center md:justify-start"
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                {header && (
                                    <h1 className="font-semibold text-xl text-gray-800 tracking-tight">
                                        {header}
                                    </h1>
                                )}
                            </motion.div>

                            {/* User Info */}
                            <div className="flex items-center space-x-4">
                                <motion.span
                                    className="text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-full shadow-sm"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    👋 {user ? user.name : "Admin"}
                                </motion.span>
                                <Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                    className="flex items-center space-x-1 text-sm text-gray-500 hover:text-red-600 transition-colors"
                                >
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Konten */}
                <motion.main
                    className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="max-w-7xl mx-auto p-6 sm:p-8">
                        <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.4 }}
                        >
                            {children}
                        </motion.div>
                    </div>
                </motion.main>
            </div>
        </div>
    );
}
