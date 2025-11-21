import React, { useState, useRef } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, usePage, router } from "@inertiajs/react";
import {
    Box,
    ShieldCheck,
    Clock,
    MapPin,
    ShoppingCart,
    CheckCircle,
    ArrowRight,
    Star,
    Package,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

// Import Modal Order & Verification
import OrderModal from "@/Pages/Order/Partials/OrderModal";
import VerificationModal from "@/Pages/Order/Partials/VerificationModal";

// Helper Format Rupiah
const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(number);
};

// --- Komponen: Service Card (Fresh Light Green Theme) ---
const ServiceCard = ({ service, onOrder }) => {
    const { title, description, price, features, illustration } = service;
    const featuresList = Array.isArray(features) ? features : [];

    return (
        <div className="group relative flex flex-col bg-white rounded-[2rem] p-5 border border-emerald-100 shadow-md hover:shadow-2xl hover:shadow-emerald-200/40 transition-all duration-500 hover:-translate-y-2 min-w-[320px] md:min-w-[350px] h-full snap-center">
            {/* Image Section - Soft Green Backdrop */}
            <div className="relative h-60 w-full rounded-[1.8rem] overflow-hidden bg-emerald-50 flex items-center justify-center mb-6">
                {illustration ? (
                    <img
                        src={illustration}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <Box className="w-24 h-24 text-emerald-300 group-hover:scale-110 group-hover:text-emerald-500 transition-all duration-500" />
                )}
            </div>

            {/* Content Section */}
            <div className="flex flex-col flex-1 px-2">
                <div className="mb-5">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-1">
                        {title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 h-10">
                        {description}
                    </p>
                </div>

                {/* Features List - Clean Layout */}
                <div className="mb-6 space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    {featuresList.length > 0 ? (
                        featuresList.slice(0, 3).map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white shadow-sm flex items-center justify-center border border-emerald-100">
                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                                </div>
                                <span className="text-sm text-gray-600 font-medium truncate">
                                    {feature}
                                </span>
                            </div>
                        ))
                    ) : (
                        <span className="text-sm text-gray-400 italic px-2">
                            Fitur standar tersedia
                        </span>
                    )}
                </div>

                {/* Bottom Action Area */}
                <div className="mt-auto pt-2 border-t border-gray-100">
                    <div className="flex items-end justify-between mb-5 pt-4">
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">
                                Mulai Dari
                            </p>
                            <p className="text-2xl font-extrabold text-emerald-600 tracking-tight">
                                {formatRupiah(price)}
                            </p>
                        </div>
                    </div>

                    {/* Tombol Hijau Cerah */}
                    <button
                        onClick={() => onOrder(service)}
                        className="group/btn w-full relative overflow-hidden bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 hover:shadow-emerald-600/40 transition-all active:scale-[0.98]"
                    >
                        <div className="relative z-10 flex items-center justify-center gap-2">
                            <ShoppingCart className="w-5 h-5" />
                            <span>Pesan Sekarang</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main Component: Penitipan ---
export default function Penitipan({ services, userVerificationStatus }) {
    const { auth } = usePage().props;
    const scrollContainerRef = useRef(null);

    // State Modals
    const [isOrderModalOpen, setOrderModalOpen] = useState(false);
    const [isVerificationModalOpen, setVerificationModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    // Scroll Handler
    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = 380;
            if (direction === "left") {
                current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: "smooth" });
            }
        }
    };

    // --- LOGIKA ORDER & VERIFIKASI ---
    const handleOrderClick = (service) => {
        if (!auth.user) {
            router.visit(route("login"));
            return;
        }
        if (userVerificationStatus !== "approved") {
            setVerificationModalOpen(true);
            return;
        }
        if (userVerificationStatus === "approved") {
            setSelectedService(service);
            setOrderModalOpen(true);
        }
    };

    return (
        <GuestLayout>
            <Head title="Layanan Penitipan" />

            {/* Background Putih Bersih */}
            <div className="bg-white min-h-screen font-sans selection:bg-emerald-100 selection:text-emerald-800">
                {/* HERO SECTION - Light & Airy */}
                <div className="relative bg-gradient-to-b from-emerald-50 via-white to-white py-24 overflow-hidden">
                    {/* Decoration Blobs - Soft Green */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-[80px] pointer-events-none -translate-y-1/4 translate-x-1/4"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-50/60 rounded-full blur-[60px] pointer-events-none translate-y-1/4 -translate-x-1/4"></div>

                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white border border-emerald-200 shadow-sm mb-8 hover:shadow-md transition-shadow cursor-default">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            <span className="text-xs font-bold text-emerald-700 tracking-[0.15em] uppercase">
                                Layanan Terpercaya
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
                            Pilih Paket{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
                                Penitipan
                            </span>
                        </h1>

                        <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
                            Solusi penyimpanan aman dengan harga terjangkau.
                            Pilih paket yang sesuai dan nikmati ketenangan
                            pikiran.
                        </p>
                    </div>
                </div>

                {/* LAYANAN CAROUSEL SECTION */}
                <div className="relative -mt-16 pb-32 z-20">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Carousel Container */}
                        <div className="relative">
                            {/* Navigation Buttons (Desktop) - Putih dengan Shadow */}
                            {services && services.length > 3 && (
                                <>
                                    <button
                                        onClick={() => scroll("left")}
                                        className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white rounded-full shadow-xl border border-gray-100 items-center justify-center text-gray-600 hover:text-emerald-600 hover:scale-110 transition-all"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={() => scroll("right")}
                                        className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white rounded-full shadow-xl border border-gray-100 items-center justify-center text-gray-600 hover:text-emerald-600 hover:scale-110 transition-all"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </>
                            )}

                            {/* Scrollable Area */}
                            <div
                                ref={scrollContainerRef}
                                className="flex gap-8 overflow-x-auto pb-12 pt-4 px-4 snap-x snap-mandatory hide-scrollbar"
                                style={{
                                    scrollbarWidth: "none",
                                    msOverflowStyle: "none",
                                }}
                            >
                                {services && services.length > 0 ? (
                                    services.map((service) => (
                                        <ServiceCard
                                            key={service.id}
                                            service={service}
                                            onOrder={handleOrderClick}
                                        />
                                    ))
                                ) : (
                                    <div className="w-full col-span-full bg-white rounded-[2.5rem] p-16 text-center shadow-lg border border-emerald-50 flex flex-col items-center justify-center min-h-[400px]">
                                        <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-50 rounded-full mb-8 animate-pulse">
                                            <Package className="w-12 h-12 text-emerald-400" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                            Layanan Belum Tersedia
                                        </h3>
                                        <p className="text-gray-500 max-w-md mx-auto">
                                            Saat ini kami sedang menyiapkan
                                            paket layanan terbaik. Silakan
                                            kembali lagi nanti.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mobile Swipe Indicator */}
                        {services && services.length > 1 && (
                            <div className="md:hidden flex justify-center mt-4 gap-2">
                                <span className="text-xs text-emerald-500 font-bold uppercase tracking-widest animate-pulse">
                                    Geser untuk melihat lainnya &rarr;
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* MODALS */}
                <OrderModal
                    show={isOrderModalOpen}
                    onClose={() => setOrderModalOpen(false)}
                    product={selectedService}
                    productType="service"
                />

                <VerificationModal
                    show={isVerificationModalOpen}
                    onClose={() => setVerificationModalOpen(false)}
                    status={userVerificationStatus}
                    onVerificationSuccess={() => {
                        setVerificationModalOpen(false);
                        router.reload({ only: ["userVerificationStatus"] });
                    }}
                />
            </div>
        </GuestLayout>
    );
}
