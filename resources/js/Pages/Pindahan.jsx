import React, { useState } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, usePage, router } from "@inertiajs/react";
import {
    ArrowRight,
    CheckCircle2,
    Phone,
    ShieldCheck,
    Users,
    Zap,
    Wallet,
    Star,
    Truck,
    PackageCheck,
    MessageCircle,
} from "lucide-react";

// Import Modal Order & Verifikasi
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

// --- 1. HERO SECTION (Light Green - Opening) ---
const LayananHero = () => {
    const { settings } = usePage().props;
    const phoneNumber = settings.contact_phone
        ? settings.contact_phone.replace(/\D/g, "")
        : "";
    const message = settings.whatsapp_message
        ? encodeURIComponent(settings.whatsapp_message)
        : "";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    return (
        <section className="relative bg-emerald-100 pt-32 pb-24 overflow-hidden rounded-b-[3rem]">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-200/50 rounded-full blur-[80px] pointer-events-none -translate-y-1/4 translate-x-1/4"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-200/50 rounded-full blur-[80px] pointer-events-none translate-y-1/4 -translate-x-1/4"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white border border-emerald-200 shadow-sm mb-8">
                            <Truck className="w-4 h-4 text-emerald-600" />
                            <span className="text-xs font-bold text-emerald-700 tracking-[0.2em] uppercase">
                                Jasa Pindahan Premium
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-extrabold text-emerald-950 leading-tight tracking-tight mb-6">
                            Pindahan Rumah & Kos? <br />
                            <span className="text-emerald-600">
                                Titipsini Aja!
                            </span>
                        </h1>

                        <p className="text-lg text-emerald-800 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                            Solusi <em>all-in-one</em> untuk kebutuhan pindahan
                            dan penyimpanan barang Anda. Cepat, aman, dan
                            ditangani oleh profesional.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-emerald-700 transition-colors"
                            >
                                Konsultasi Gratis
                                <MessageCircle className="w-5 h-5 ml-2" />
                            </a>
                            <button
                                onClick={() =>
                                    document
                                        .getElementById("pricing")
                                        .scrollIntoView({ behavior: "smooth" })
                                }
                                className="inline-flex items-center justify-center bg-white text-emerald-700 px-8 py-4 rounded-2xl font-bold text-lg border border-emerald-200 shadow-sm hover:bg-emerald-50 transition-colors"
                            >
                                Lihat Paket
                            </button>
                        </div>
                    </div>

                    <div className="relative hidden lg:block">
                        <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                            <img
                                src="images/hero-services.jpg"
                                alt="Layanan Pindahan"
                                className="w-full h-auto object-cover"
                                onError={(e) => {
                                    e.target.src =
                                        "https://placehold.co/600x500/064e3b/ffffff?text=Moving+Service";
                                }}
                            />
                            <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-emerald-100 flex items-center gap-4">
                                <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-emerald-900 font-bold text-lg">
                                        Garansi Keamanan
                                    </p>
                                    <p className="text-emerald-600 text-sm font-medium">
                                        Barang diasuransikan penuh
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- 2. STATS & FEATURES (Clean White) ---
const StatsAndFeatures = () => {
    const stats = [
        { icon: <Users />, value: "10K+", label: "Pelanggan Puas" },
        { icon: <Truck />, value: "500+", label: "Pengiriman/Bulan" },
        { icon: <ShieldCheck />, value: "99%", label: "Tingkat Keamanan" },
        { icon: <Phone />, value: "24/7", label: "Layanan Support" },
    ];

    const features = [
        {
            icon: <ShieldCheck />,
            title: "Aman & Terpercaya",
            description:
                "Barang Anda dijamin aman dengan asuransi penuh dan tracking real-time.",
        },
        {
            icon: <Users />,
            title: "Tim Profesional",
            description:
                "Tenaga ahli berpengalaman dalam menangani berbagai jenis barang.",
        },
        {
            icon: <Wallet />,
            title: "Harga Transparan",
            description:
                "Tidak ada biaya tersembunyi, semua tarif jelas dan kompetitif.",
        },
        {
            icon: <Zap />,
            title: "Layanan Cepat",
            description:
                "Proses pickup dan delivery yang efisien sesuai jadwal Anda.",
        },
    ];

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 border-b-2 border-emerald-100 pb-12">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="inline-flex justify-center text-emerald-600 mb-3">
                                {React.cloneElement(stat.icon, { size: 32 })}
                            </div>
                            <p className="text-3xl md:text-4xl font-extrabold text-emerald-950 mb-1">
                                {stat.value}
                            </p>
                            <p className="text-emerald-600 font-bold uppercase tracking-wider text-xs">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <span className="text-emerald-600 font-bold tracking-widest uppercase text-xs">
                        Keunggulan Kami
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-emerald-950 mt-3 tracking-tight">
                        Kenapa Pilih Titipsini Aja?
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-white text-emerald-600 flex items-center justify-center mb-6 shadow-sm border border-emerald-100">
                                {React.cloneElement(feature.icon, { size: 24 })}
                            </div>
                            <h3 className="text-xl font-bold text-emerald-900 mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-emerald-800 text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- 3. HOW IT WORKS (Solid Green - Contrast Break) ---
const HowItWorks = () => {
    const steps = [
        {
            num: "01",
            title: "Pesan Online",
            description: "Pilih layanan melalui website atau aplikasi.",
        },
        {
            num: "02",
            title: "Jadwalkan Pickup",
            description: "Tentukan waktu dan lokasi yang sesuai.",
        },
        {
            num: "03",
            title: "Tim Datang",
            description: "Tim profesional kami mengambil barang.",
        },
        {
            num: "04",
            title: "Tracking & Delivery",
            description: "Pantau status hingga sampai tujuan.",
        },
    ];

    return (
        // Background Solid Emerald 600 agar kontras dengan section atas & bawah
        <section className="py-24 bg-emerald-600 text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-emerald-200 font-bold tracking-widest uppercase text-xs">
                        Proses Mudah
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 tracking-tight">
                        Cara Pakai Layanan
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="relative p-8 rounded-[2rem] bg-white shadow-xl text-left group"
                        >
                            {/* Angka Solid Hijau Muda */}
                            <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl font-bold text-emerald-600 mb-6">
                                {step.num}
                            </div>

                            <div className="relative z-10 pt-4">
                                <h3 className="text-xl font-bold text-emerald-900 mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- 4. PRICING SECTION (Light Green Background) ---
const Pricing = ({ packages, onOrderClick }) => {
    return (
        <section id="pricing" className="py-24 bg-emerald-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-emerald-600 font-bold tracking-widest uppercase text-xs">
                        Pilihan Paket
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-emerald-950 tracking-tight mt-3 mb-4">
                        Paket Pindahan Titipsini
                    </h2>
                    <p className="text-emerald-800 max-w-2xl mx-auto text-lg">
                        Pilih paket yang paling sesuai dengan kebutuhan dan
                        anggaran Anda.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row items-stretch justify-center gap-8">
                    {packages && packages.length > 0 ? (
                        packages.map((plan) => (
                            <div
                                key={plan.id}
                                className={`w-full max-w-md bg-white rounded-[2.5rem] p-8 relative flex flex-col h-auto ${
                                    plan.popular == 1
                                        ? "border-4 border-emerald-400 shadow-2xl shadow-emerald-200 z-10"
                                        : "border border-emerald-200 shadow-lg"
                                }`}
                            >
                                {plan.popular == 1 && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-600 text-white text-xs font-bold px-6 py-2 rounded-full shadow-lg uppercase tracking-wider">
                                        Paling Populer
                                    </div>
                                )}

                                <div className="mb-6 text-center mt-4">
                                    <h3 className="text-2xl font-bold text-emerald-950 mb-2">
                                        {plan.name}
                                    </h3>
                                    <p className="text-emerald-600 text-sm min-h-[40px]">
                                        {plan.description}
                                    </p>
                                </div>

                                {plan.price > 0 && (
                                    <div className="text-center mb-6 pb-6 border-b border-emerald-100">
                                        <p className="text-xs text-emerald-600 uppercase font-bold tracking-widest mb-1">
                                            Mulai Dari
                                        </p>
                                        <p className="text-3xl font-extrabold text-emerald-700">
                                            {formatRupiah(plan.price)}
                                        </p>
                                    </div>
                                )}
                                {!plan.price && (
                                    <div className="w-full h-px bg-emerald-100 mb-6"></div>
                                )}

                                <ul className="space-y-4 flex-grow mb-8">
                                    {Array.isArray(plan.features) &&
                                        plan.features.map((feature, i) => (
                                            <li
                                                key={i}
                                                className="flex items-start gap-3 text-emerald-800 text-sm font-medium"
                                            >
                                                <CheckCircle2
                                                    size={18}
                                                    className="text-emerald-600 flex-shrink-0 mt-0.5"
                                                />
                                                {feature}
                                            </li>
                                        ))}
                                </ul>

                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onOrderClick(plan);
                                    }}
                                    className={`w-full py-4 rounded-xl font-bold text-sm shadow-md transition-colors ${
                                        plan.popular == 1
                                            ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                            : "bg-emerald-100 text-emerald-800 border-2 border-emerald-200 hover:bg-emerald-200"
                                    }`}
                                >
                                    Pilih Paket Ini
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="w-full p-12 bg-white rounded-3xl text-center shadow-sm border border-emerald-200">
                            <p className="text-emerald-600">
                                Paket pindahan akan segera tersedia.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

// --- 5. SAVINGS SECTION (White Background) ---
const Savings = () => (
    <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-emerald-800 rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl shadow-emerald-200">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-700/50 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 text-white">
                            Hemat di Awal, <br />{" "}
                            <span className="text-emerald-200">
                                Untung Berkali-Lipat!
                            </span>
                        </h2>
                        <ul className="space-y-5">
                            {[
                                "Hemat 30% biaya pindahan dengan paket bundling",
                                "Gratis asuransi untuk barang bernilai tinggi",
                                "Cashback hingga 50rb untuk pelanggan setia",
                            ].map((item, idx) => (
                                <li
                                    key={idx}
                                    className="flex items-center gap-4"
                                >
                                    <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-emerald-50 font-medium">
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex justify-center lg:justify-end">
                        <div className="bg-emerald-900/50 p-8 rounded-3xl border border-emerald-600 text-center w-full max-w-sm shadow-lg backdrop-blur-sm">
                            <p className="text-6xl font-extrabold text-white mb-2">
                                95%
                            </p>
                            <p className="text-emerald-200 font-medium">
                                Tingkat kepuasan pelanggan <br /> layanan
                                pindahan kami
                            </p>
                            <div className="flex justify-center gap-1 mt-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className="w-5 h-5 text-yellow-400 fill-yellow-400"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

// --- 6. ABOUT US (Soft Green) ---
const AboutUs = () => (
    <section className="py-24 bg-emerald-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                    <span className="text-emerald-600 font-bold tracking-widest uppercase text-xs">
                        Tentang Kami
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-emerald-950 mt-3 mb-6 tracking-tight">
                        Partner Pindahan Terpercaya
                    </h2>
                    <p className="text-emerald-800 text-lg mb-8 leading-relaxed font-light">
                        Titipsini adalah platform digital yang menghubungkan
                        Anda dengan layanan pindahan dan penyimpanan barang
                        terpercaya. Kami berkomitmen memberikan keamanan dan
                        kenyamanan terbaik.
                    </p>

                    <div className="bg-white p-6 rounded-2xl border border-emerald-100 flex items-center gap-5 shadow-sm">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                            <PackageCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-emerald-900">
                                Sertifikat ISO 9001:2015
                            </h4>
                            <p className="text-sm text-emerald-700">
                                Standar kualitas internasional
                            </p>
                        </div>
                    </div>
                </div>
                <div className="relative">
                    <div className="absolute -inset-4 bg-emerald-100 rounded-[2.5rem]"></div>
                    <img
                        src="images/who-us.jpg"
                        alt="Tim Titipsini"
                        className="relative rounded-[2rem] shadow-xl w-full h-auto object-cover border-4 border-white"
                        onError={(e) => {
                            e.target.src =
                                "https://placehold.co/600x500/059669/ffffff?text=About+Us";
                        }}
                    />
                </div>
            </div>
        </div>
    </section>
);

// --- 7. CTA SECTION (White) ---
const CtaSection = () => {
    const { settings } = usePage().props;
    const phoneNumber = settings.contact_phone
        ? settings.contact_phone.replace(/\D/g, "")
        : "";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        "Halo, saya butuh bantuan pindahan."
    )}`;

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 pb-16">
                <div className="bg-emerald-100 rounded-[3rem] p-12 md:p-20 text-center border-2 border-emerald-100 shadow-xl relative overflow-hidden">
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold text-emerald-950 mb-6">
                            Siap Pindah Sekarang?
                        </h2>
                        <p className="text-emerald-700 text-xl mb-10">
                            Jangan biarkan barang berat membebani Anda. Hubungi
                            kami dan kami yang akan kerjakan sisanya.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center bg-emerald-600 text-white px-10 py-5 rounded-full font-bold text-lg shadow-xl hover:bg-emerald-700 transition-colors"
                            >
                                <Phone className="w-6 h-6 mr-3" /> Hubungi Tim
                                Kami
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// ==================================================================
// MAIN PAGE COMPONENT
// ==================================================================
const Layanan = ({ packages }) => {
    const { auth, userVerificationStatus } = usePage().props;

    const [isOrderModalOpen, setOrderModalOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [isVerificationModalOpen, setVerificationModalOpen] = useState(false);

    const handleOrderClick = (pkg) => {
        if (!auth.user) {
            router.get(route("login"));
            return;
        }
        if (userVerificationStatus !== "approved") {
            setVerificationModalOpen(true);
            return;
        }
        if (userVerificationStatus === "approved") {
            setSelectedPackage(pkg);
            setOrderModalOpen(true);
        }
    };

    return (
        <GuestLayout>
            <Head title="Layanan Pindahan & Penyimpanan" />
            <div className="font-sans bg-white selection:bg-emerald-200 selection:text-emerald-900">
                {/* URUTAN SUDAH DISESUAIKAN DENGAN ALUR TERBAIK */}
                <LayananHero />
                <StatsAndFeatures />
                <HowItWorks />
                <Pricing packages={packages} onOrderClick={handleOrderClick} />
                <Savings />
                <AboutUs />
                <CtaSection />

                {/* Modals */}
                <OrderModal
                    show={isOrderModalOpen}
                    onClose={() => setOrderModalOpen(false)}
                    product={selectedPackage}
                    productType="moving_package"
                />
                <VerificationModal
                    show={isVerificationModalOpen}
                    onClose={() => setVerificationModalOpen(false)}
                    status={userVerificationStatus}
                    onVerificationSuccess={() => {
                        setVerificationModalOpen(false);
                        router.reload({
                            only: ["userVerificationStatus", "auth"],
                            onSuccess: () => {
                                if (selectedPackage) {
                                    setOrderModalOpen(true);
                                }
                            },
                        });
                    }}
                />
            </div>
        </GuestLayout>
    );
};

export default Layanan;
