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
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
// Import Modal Order & Verifikasi
import OrderModal from "@/Pages/Order/Partials/OrderModal";
import VerificationModal from "@/Pages/Order/Partials/VerificationModal"; // <-- Pastikan import ini ada

// --- 1. Komponen Hero (Tidak Berubah) ---
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
        <section className="bg-green-50/70 pt-28 pb-16">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                    <div className="text-center lg:text-left">
                        <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-green-800 bg-white border border-gray-200 rounded-full shadow-md">
                            Layanan Terpercaya
                        </span>
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
                            Pindahan Rumah, Kos, dan Barang? Titipsini Aja!
                        </h1>
                        <p className="mt-6 text-lg text-gray-600">
                            Solusi terpercaya untuk kebutuhan pindahan dan
                            penyimpanan barang Anda.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
                            >
                                Mulai Sekarang{" "}
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </a>
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center bg-white text-gray-800 px-6 py-3 rounded-lg font-semibold border border-gray-200 shadow-lg hover:bg-gray-100 transition-colors duration-300"
                            >
                                Konsultasi Gratis
                            </a>
                        </div>
                    </div>
                    <div>
                        <img
                            src="images/hero-services.jpg"
                            alt="Layanan Pindahan"
                            className="w-full h-auto rounded-lg shadow-lg"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- 2. Stats & Features (Tidak Berubah) ---
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
        <section className="py-16 sm:py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center"
                        >
                            <div className="flex justify-center text-green-600 mb-2">
                                {React.cloneElement(stat.icon, { size: 32 })}
                            </div>
                            <p className="text-3xl font-bold text-gray-900">
                                {stat.value}
                            </p>
                            <p className="text-gray-500 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-20">
                    <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
                        Kenapa Pilih Titipsini Aja?
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-gray-600">
                        Kami memberikan layanan terbaik dengan standar kualitas
                        tinggi.
                    </p>
                </div>
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center"
                        >
                            <div className="inline-flex justify-center items-center bg-green-100 rounded-full w-16 h-16 mb-4">
                                {React.cloneElement(feature.icon, {
                                    size: 32,
                                    className: "text-green-600",
                                })}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {feature.title}
                            </h3>
                            <p className="mt-2 text-sm text-gray-600">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- 3. How It Works (Tidak Berubah) ---
const HowItWorks = () => {
    const steps = [
        {
            num: "01",
            title: "Pesan Online",
            description:
                "Pilih layanan yang dibutuhkan melalui website atau aplikasi kami.",
        },
        {
            num: "02",
            title: "Jadwalkan Pickup",
            description:
                "Tentukan waktu dan lokasi pickup yang sesuai dengan jadwal Anda.",
        },
        {
            num: "03",
            title: "Tim Datang",
            description:
                "Tim profesional kami akan datang sesuai jadwal untuk mengambil barang.",
        },
        {
            num: "04",
            title: "Tracking & Delivery",
            description:
                "Pantau status barang real-time hingga sampai di tujuan dengan aman.",
        },
    ];
    return (
        <section className="py-16 sm:py-24 bg-green-600 text-white">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h2 className="text-4xl font-bold tracking-tight">
                        Cara Pakai Layanan Titipsini
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-green-200">
                        Proses mudah dalam 4 langkah sederhana.
                    </p>
                </div>
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step) => (
                        <div
                            key={step.num}
                            className="bg-green-700/50 p-6 rounded-xl border border-green-500/50 text-center"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-green-400 text-green-300 text-xl font-bold rounded-full mb-4">
                                {step.num}
                            </div>
                            <h3 className="text-xl font-semibold text-white">
                                {step.title}
                            </h3>
                            <p className="mt-2 text-sm text-green-200">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- 4. About Us (Tidak Berubah) ---
const AboutUs = () => (
    <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
                        Siapa Kami?
                    </h2>
                    <p className="mt-4 text-gray-600">
                        Titipsini adalah platform digital yang menghubungkan
                        Anda dengan layanan pindahan dan penyimpanan barang
                        terpercaya.
                    </p>
                    <p className="mt-4 text-gray-600">
                        Dengan pengalaman bertahun-tahun dan tim profesional,
                        kami berkomitmen memberikan layanan terbaik.
                    </p>
                    <div className="mt-6 flex items-center gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <PackageCheck className="w-10 h-10 text-green-600 flex-shrink-0" />
                        <div>
                            <h4 className="font-semibold text-gray-800">
                                Sertifikat ISO 9001:2015
                            </h4>
                            <p className="text-sm text-gray-500">
                                Standar kualitas internasional
                            </p>
                        </div>
                    </div>
                </div>
                <div>
                    <img
                        src="images/who-us.jpg"
                        alt="Tim Titipsini"
                        className="rounded-2xl shadow-xl w-full h-auto"
                    />
                </div>
            </div>
        </div>
    </section>
);

// --- 5. Testimonials (Tidak Berubah) ---
const Testimonials = () => {
    const reviews = [
        {
            name: "Rizki A.",
            text: '"Pelayanan sangat memuaskan! Barang sampai dengan aman."',
            img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
        },
        {
            name: "Lisa M.",
            text: '"Tim nya profesional dan harga transparan."',
            img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
        },
        {
            name: "Lina Y.",
            text: '"Sudah 3x pakai jasa Titipsini, selalu puas."',
            img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200",
        },
        {
            name: "Sari D.",
            text: '"Tracking real-time sangat membantu."',
            img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200",
        },
    ];
    const [currentIndex, setCurrentIndex] = useState(0);
    const goToPrevious = () =>
        setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
    const goToNext = () =>
        setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800">
                        Testimoni Pelanggan
                    </h2>
                </div>
                <div className="max-w-3xl mx-auto relative">
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 md:-left-16">
                        <button
                            onClick={goToPrevious}
                            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
                        >
                            <ChevronLeft className="text-gray-600" />
                        </button>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 text-center transition-opacity duration-500">
                        <div className="flex justify-center mb-4">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className="text-yellow-400 fill-current"
                                    size={20}
                                />
                            ))}
                        </div>
                        <p className="text-lg italic text-gray-700 mb-6 min-h-[100px]">
                            "{reviews[currentIndex].text}"
                        </p>
                        <div className="flex items-center justify-center">
                            <img
                                src={reviews[currentIndex].img}
                                alt={reviews[currentIndex].name}
                                className="w-12 h-12 rounded-full mr-4"
                            />
                            <div>
                                <p className="font-bold text-gray-800">
                                    {reviews[currentIndex].name}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 right-0 md:-right-16">
                        <button
                            onClick={goToNext}
                            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
                        >
                            <ChevronRight className="text-gray-600" />
                        </button>
                    </div>
                </div>
                <div className="flex justify-center mt-6 space-x-2">
                    {reviews.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-3 h-3 rounded-full transition-colors ${
                                currentIndex === index
                                    ? "bg-green-600"
                                    : "bg-gray-300 hover:bg-green-400"
                            }`}
                        ></button>
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- 6. Savings (Tidak Berubah) ---
const Savings = () => (
    <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
                        Hemat di Awal, Untung Berkali-Lipat!
                    </h2>
                    <ul className="mt-6 space-y-4">
                        <li className="flex items-start gap-3">
                            <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                            <span>
                                Hemat 30% biaya pindahan dengan paket bundling
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                            <span>
                                Gratis asuransi untuk barang bernilai tinggi
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                            <span>
                                Cashback hingga 50rb untuk pelanggan setia
                            </span>
                        </li>
                    </ul>
                    <div className="mt-8 bg-green-50/70 p-6 rounded-lg border border-green-200/80">
                        <p className="text-4xl font-bold text-green-600">95%</p>
                        <p className="text-gray-600">
                            Tingkat kepuasan pelanggan yang menggunakan layanan
                            kami
                        </p>
                    </div>
                </div>
                <div>
                    <img
                        src="images/kepuasan-pelanggan.jpg"
                        alt="Pelanggan Puas"
                        className="rounded-2xl shadow-xl w-full h-auto"
                    />
                </div>
            </div>
        </div>
    </section>
);

// --- 7. CTA Section (Tidak Berubah) ---
const CtaSection = () => {
    const { settings } = usePage().props;
    const phoneNumber = settings.contact_phone
        ? settings.contact_phone.replace(/\D/g, "")
        : "";
    const message = settings.whatsapp_message
        ? encodeURIComponent(settings.whatsapp_message)
        : "";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    return (
        <section className="py-16 sm:py-24 bg-green-600">
            <div className="container mx-auto px-4 text-center text-white">
                <h2 className="text-4xl font-bold tracking-tight">
                    Siap untuk Pindahan Tanpa Ribet?
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-green-200">
                    Hubungi kami sekarang dan dapatkan konsultasi gratis.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center bg-white text-green-700 px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-gray-100 transition-colors"
                    >
                        <Phone className="w-5 h-5 mr-2" /> Hubungi Sekarang
                    </a>
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center bg-transparent text-white px-6 py-3 rounded-full font-semibold border-2 border-green-400 hover:bg-green-500 transition-colors"
                    >
                        Chat WhatsApp
                    </a>
                </div>
            </div>
        </section>
    );
};

// --- 8. Pricing Section (MODIFIKASI UTAMA) ---
const Pricing = ({ packages, onOrderClick }) => {
    return (
        <section id="pricing" className="py-16 sm:py-24 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
                        Paket Pindahan Titipsini
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-gray-600">
                        Pilih paket yang paling sesuai dengan kebutuhan pindahan
                        Anda.
                    </p>
                </div>

                <div className="mt-12 flex flex-col lg:flex-row items-stretch justify-center gap-8">
                    {packages && packages.length > 0 ? (
                        packages.map((plan) => (
                            <div
                                key={plan.id}
                                className={`w-full max-w-md bg-white rounded-xl shadow-lg p-8 relative flex flex-col transition-transform duration-300 ${
                                    plan.popular
                                        ? "border-2 border-green-600"
                                        : "border border-gray-200"
                                }`}
                            >
                                {plan.popular && (
                                    <span className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                                        Paling Populer
                                    </span>
                                )}
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        {plan.name}
                                    </h3>
                                    <p className="text-gray-500 text-sm mt-1 min-h-[40px]">
                                        {plan.description}
                                    </p>
                                </div>

                                <ul className="mt-6 space-y-3 flex-grow">
                                    {Array.isArray(plan.features) &&
                                        plan.features.map((feature, i) => (
                                            <li
                                                key={i}
                                                className="flex items-center gap-3 text-gray-600"
                                            >
                                                <CheckCircle2
                                                    size={16}
                                                    className="text-green-500 flex-shrink-0"
                                                />
                                                {feature}
                                            </li>
                                        ))}
                                </ul>

                                {/* [PERBAIKAN FINAL] Tombol untuk trigger Modal */}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onOrderClick(plan); // Memanggil handler dari Layanan
                                    }}
                                    className="w-full inline-block text-center mt-8 font-semibold py-3 px-6 rounded-lg shadow-md transition-colors bg-gray-800 text-white hover:bg-gray-900 cursor-pointer"
                                >
                                    Pilih Paket
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-600 col-span-full">
                            Paket pindahan akan segera tersedia.
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};

// ==================================================================
// MAIN PAGE COMPONENT (KOMPONEN UTAMA)
// ==================================================================
const Layanan = ({ packages }) => {
    // Ambil props global dari backend
    const { auth, userVerificationStatus } = usePage().props;

    // State Modal
    const [isOrderModalOpen, setOrderModalOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [isVerificationModalOpen, setVerificationModalOpen] = useState(false);

    // Handler Klik Tombol (Logika 4 Kasus)
    const handleOrderClick = (pkg) => {
        // 1. Cek Login
        if (!auth.user) {
            router.get(route("login"));
            return;
        }

        // 2 & 3. Cek Verifikasi (Belum/Ditolak/Pending)
        // [PERBAIKAN] Buka modal verifikasi, jangan redirect
        if (userVerificationStatus !== "approved") {
            setVerificationModalOpen(true);
            return;
        }

        // 4. Verifikasi OK -> Buka Modal Order
        if (userVerificationStatus === "approved") {
            setSelectedPackage(pkg);
            setOrderModalOpen(true);
        }
    };

    return (
        <>
            <Head title="Layanan Pindahan & Penyimpanan" />

            <LayananHero />
            <StatsAndFeatures />
            <AboutUs />
            <HowItWorks />
            <Testimonials />
            <Savings />

            {/* Kirim handler ke Pricing */}
            <Pricing packages={packages} onOrderClick={handleOrderClick} />

            <CtaSection />

            {/* Render Modal Order */}
            <OrderModal
                show={isOrderModalOpen}
                onClose={() => setOrderModalOpen(false)}
                product={selectedPackage} // Kirim data paket sebagai 'product'
                productType="moving_package" // Beritahu modal ini adalah Pindahan
            />

            {/* Render Modal Verifikasi */}
            <VerificationModal
                show={isVerificationModalOpen}
                onClose={() => setVerificationModalOpen(false)}
                status={userVerificationStatus}
                // [BARU] Handler ketika verifikasi sukses (dari dalam modal)
                onVerificationSuccess={() => {
                    setVerificationModalOpen(false); // 1. Tutup modal verifikasi

                    // 2. Refresh data user (agar status 'approved' terbaca oleh Inertia)
                    router.reload({
                        only: ["userVerificationStatus", "auth"],
                        onSuccess: () => {
                            // 3. Buka modal order untuk paket yang tadi dipilih
                            // (Pastikan 'selectedPackage' masih ada isinya)
                            if (selectedPackage) {
                                setOrderModalOpen(true);
                            }
                        },
                    });
                }}
            />
        </>
    );
};

// Assign Layout
Layanan.layout = (page) => <GuestLayout children={page} />;

export default Layanan;
