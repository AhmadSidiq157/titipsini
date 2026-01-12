import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import { Truck, Box } from "lucide-react";
import FormPenitipan from "./FormPenitipan";
import FormPindahan from "./FormPindahan";

// Helper Format Rupiah
const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(number || 0);
};

export default function StepForm(props) {
    const { product, productModelClass } = props;
    const isPindahan = productModelClass.includes("MovingPackage");

    // [BARU] State untuk menyimpan harga dinamis dari child component
    // Default pakai harga produk, nanti diupdate sama form di bawah
    const [currentPrice, setCurrentPrice] = useState(
        parseFloat(product.price) || 0
    );

    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* --- HEADER --- */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                        Detail Pesanan
                    </h2>
                    <p className="text-sm text-gray-500">
                        Lengkapi data untuk melanjutkan
                    </p>
                </div>
                <div className="px-4 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                    Step 1/3
                </div>
            </div>

            {/* --- PRODUCT CARD (DYNAMIC PRICE) --- */}
            <div className="relative overflow-hidden rounded-3xl bg-gray-900 text-white shadow-2xl shadow-gray-200 transition-all duration-300">
                {/* Background Blobs */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-emerald-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div
                    className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"
                    style={{ animationDelay: "1s" }}
                ></div>

                <div className="relative p-6 flex items-center justify-between z-10">
                    <div className="flex items-center gap-5">
                        <div
                            className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg border border-white/10 ${
                                isPindahan
                                    ? "bg-blue-600/80"
                                    : "bg-emerald-600/80"
                            } backdrop-blur-md`}
                        >
                            {isPindahan ? (
                                <Truck size={32} className="text-white" />
                            ) : (
                                <Box size={32} className="text-white" />
                            )}
                        </div>
                        <div>
                            <h4 className="text-xl font-bold">
                                {product.name || product.title}
                            </h4>
                            <p className="text-white/60 text-sm font-medium uppercase tracking-widest mt-1">
                                {isPindahan
                                    ? "Moving Service"
                                    : "Storage Service"}
                            </p>
                        </div>
                    </div>

                    {/* [BARU] Harga Total Estimasi (Realtime Update) */}
                    <div className="text-right hidden sm:block">
                        <p className="text-xs text-white/50 font-bold uppercase mb-1">
                            Total Estimasi
                        </p>
                        <p className="text-3xl font-black tracking-tight text-emerald-400 drop-shadow-md transition-all duration-300">
                            {formatRupiah(currentPrice)}
                        </p>
                    </div>
                </div>
            </div>

            {/* --- FORM LOGIC --- */}
            {isPindahan ? (
                // Untuk Pindahan, kita passing setter juga kalau mau dinamis (opsional)
                // Tapi fokus kita sekarang di Penitipan dulu
                <FormPindahan {...props} onPriceUpdate={setCurrentPrice} />
            ) : (
                // [PENTING] Passing function onPriceUpdate ke FormPenitipan
                <FormPenitipan {...props} onPriceUpdate={setCurrentPrice} />
            )}
        </div>
    );
}
