import React, { useState, useEffect } from "react";
import PrimaryButton from "@/Components/PrimaryButton";
import axios from "axios";
import {
    Check,
    X,
    Clock,
    Package,
    RefreshCw,
    ArrowRight,
    Home,
} from "lucide-react"; // Tambah Icon Home

export default function StepSuccess({ orderId, initialStatus, onClose }) {
    const [status, setStatus] = useState(initialStatus);

    useEffect(() => {
        // Hentikan polling jika status sudah bukan 'awaiting_verification'
        if (status !== "awaiting_verification") return;

        const interval = setInterval(() => {
            axios
                .get(route("order.status", orderId))
                .then((response) => {
                    if (response.data.status !== "awaiting_verification") {
                        setStatus(response.data.status);
                        clearInterval(interval);
                    }
                })
                .catch(() => clearInterval(interval));
        }, 3000); // Cek setiap 3 detik

        return () => clearInterval(interval);
    }, [status, orderId]);

    // --- TAMPILAN MENUNGGU VERIFIKASI ---
    if (status === "awaiting_verification") {
        return (
            <div className="p-8 md:p-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
                {/* Icon Animasi */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-ping"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-blue-50 to-white rounded-full flex items-center justify-center shadow-lg border-4 border-blue-100">
                        <Clock className="w-10 h-10 text-blue-600 animate-pulse" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-blue-600 rounded-full p-2 border-4 border-white shadow-sm">
                        <RefreshCw className="w-4 h-4 text-white animate-spin" />
                    </div>
                </div>

                <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-3">
                    Menunggu Verifikasi
                </h3>
                <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                    Terima kasih! Bukti pembayaran Anda sedang diverifikasi oleh
                    sistem kami secara otomatis.
                </p>

                <div className="mt-8 w-full max-w-xs">
                    {/* UPDATE: Tombol lebih modern (Soft Blue) */}
                    <PrimaryButton
                        onClick={onClose}
                        className="w-full justify-center py-3.5 text-base font-bold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 hover:text-blue-800 shadow-sm rounded-xl transition-all transform hover:-translate-y-0.5"
                    >
                        <Home className="w-4 h-4 mr-2" />
                        Tutup & Cek Nanti
                    </PrimaryButton>
                    <p className="text-xs text-blue-400 mt-4 animate-pulse font-medium">
                        Halaman ini akan refresh otomatis...
                    </p>
                </div>
            </div>
        );
    }

    // --- TAMPILAN SELESAI (SUKSES / GAGAL) ---
    else {
        const isApproved = [
            "processing",
            "completed",
            "ready_for_pickup",
        ].includes(status);

        return (
            <div className="p-8 md:p-12 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
                {isApproved ? (
                    // SUKSES
                    <>
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-emerald-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                            <div className="relative w-28 h-28 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-xl shadow-emerald-200 ring-4 ring-white">
                                <Check
                                    className="w-14 h-14 text-white"
                                    strokeWidth={3}
                                />
                            </div>
                        </div>

                        <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
                            Pesanan Dikonfirmasi!
                        </h3>
                        <p className="text-gray-500 max-w-sm mx-auto mb-6">
                            Pembayaran berhasil. Tim kami akan segera memproses
                            layanan titipan/pindahan Anda.
                        </p>

                        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 w-full max-w-sm mb-8 shadow-sm">
                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                                Status Pesanan Saat Ini
                            </p>
                            <div className="flex items-center justify-center gap-2 text-emerald-800 font-bold text-lg">
                                <Package className="w-5 h-5" />
                                {status.replace(/_/g, " ").toUpperCase()}
                            </div>
                        </div>

                        <div className="w-full max-w-xs">
                            <PrimaryButton
                                onClick={onClose}
                                className="w-full justify-center py-4 text-base font-bold rounded-xl shadow-lg shadow-emerald-200 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transform hover:-translate-y-1 transition-all"
                            >
                                Selesai <ArrowRight className="ml-2 w-5 h-5" />
                            </PrimaryButton>
                        </div>
                    </>
                ) : (
                    // GAGAL
                    <>
                        <div className="mb-8 relative">
                            <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-20"></div>
                            <div className="relative w-24 h-24 bg-gradient-to-br from-red-50 to-white rounded-full flex items-center justify-center mx-auto shadow-lg border-4 border-red-50">
                                <X className="w-12 h-12 text-red-500" />
                            </div>
                        </div>

                        <h3 className="text-2xl font-black text-gray-900 mb-2">
                            Pembayaran Ditolak
                        </h3>
                        <p className="text-gray-500 max-w-sm mx-auto mb-8">
                            Maaf, bukti pembayaran tidak valid atau ditolak oleh
                            admin. Silakan cek detail pesanan Anda.
                        </p>

                        <div className="w-full max-w-xs">
                            <PrimaryButton
                                onClick={onClose}
                                className="w-full justify-center py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                            >
                                Tutup
                            </PrimaryButton>
                        </div>
                    </>
                )}
            </div>
        );
    }
}
