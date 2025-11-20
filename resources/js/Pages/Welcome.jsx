import React, { useState } from "react";
import {
    ShieldCheck,
    Clock,
    MapPin,
    Package,
    Car,
    Users,
    Star,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    CheckCircle,
} from "lucide-react";
import GuestLayout from "@/Layouts/GuestLayout";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { usePage, Link, router } from "@inertiajs/react";
// Import KEDUA Modal
import OrderModal from "@/Pages/Order/Partials/OrderModal";
import VerificationModal from "@/Pages/Order/Partials/VerificationModal"; // <-- [BARU]

// Helper function
const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number);
};

// --- 1. Komponen Kartu Layanan ---
const ServiceCard = ({ service, onOrderClick }) => {
    const { id, illustration, title, description, features, price } = service;

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-gray-100">
            <div className="w-full h-48 overflow-hidden">
                <img
                    src={illustration}
                    alt={`Ilustrasi untuk ${title}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {title}
                </h3>
                <p className="text-gray-600 mb-4 flex-grow">{description}</p>

                <div className="mb-4">
                    <span className="text-gray-500 text-sm">Mulai dari</span>
                    <p className="text-2xl font-bold text-green-600">
                        {formatRupiah(price)}
                    </p>
                </div>

                <ul className="space-y-3 mb-6">
                    {features.map((feature, index) => (
                        <li
                            key={index}
                            className="flex items-center text-gray-700"
                        >
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                            {feature}
                        </li>
                    ))}
                </ul>

                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        onOrderClick(service);
                    }}
                    className="mt-auto w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 text-center cursor-pointer"
                    disabled={price <= 0}
                >
                    {price <= 0 ? "Tidak Tersedia" : "Pilih Layanan"}
                </button>
            </div>
        </div>
    );
};

// --- 2. Komponen Fitur ---
const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 h-full">
        <div className="flex items-center justify-center bg-green-100 rounded-full w-12 h-12 mb-4">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
    </div>
);

// --- 3. Komponen FAQ Item ---
const FaqItem = ({ question, answer, isOpen, onClick }) => (
    <div className="border-b border-gray-200 py-4">
        <button
            onClick={onClick}
            className="w-full flex justify-between items-center text-left"
        >
            <h4 className="font-semibold text-gray-800 text-lg">{question}</h4>
            <ChevronDown
                className={`transform transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-green-600" : ""
                }`}
            />
        </button>
        <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
                isOpen ? "max-h-screen mt-4" : "max-h-0"
            }`}
        >
            <p className="text-gray-600 pt-2 pr-4">{answer}</p>
        </div>
    </div>
);

// --- 4. Sections (Hero, Stats, WhyUs, Testimonials, FAQ) ---
// (Bagian ini sama persis, saya singkat agar fokus ke logika modal)

const Hero = () => {
    const { settings } = usePage().props;
    const phoneNumber = settings.contact_phone
        ? settings.contact_phone.replace(/\D/g, "")
        : "";
    const message = settings.whatsapp_message
        ? encodeURIComponent(settings.whatsapp_message)
        : "";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    return (
        <section className="bg-gray-50 py-12 md:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="text-center md:text-left">
                        <span className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-4 py-1 rounded-full mb-4">
                            Terpercaya & Aman Sejak 2020
                        </span>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
                            Penitipan Barang <br />
                            <span className="text-green-600">
                                Terpercaya
                            </span>{" "}
                            untuk Anda
                        </h1>
                        <p className="mt-4 text-lg text-gray-600">
                            Solusi aman dan fleksibel untuk menyimpan barang
                            saat traveling, pindahan kost, atau kendaraan.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all text-center shadow-md hover:shadow-lg"
                            >
                                Titip Sekarang
                            </a>
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white text-gray-800 px-8 py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-100 transition-all text-center"
                            >
                                Lihat Harga
                            </a>
                        </div>
                    </div>
                    <div>
                        <img
                            src="images/hero-home.jpg"
                            alt="Ilustrasi Penitipan"
                            className="rounded-lg shadow-lg mx-auto"
                        />
                    </div>
                </div>
                <div className="mt-16 bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="p-4">
                        <Package
                            size={40}
                            className="mx-auto text-green-600 mb-2"
                        />
                        <h3 className="font-bold text-lg">Berbagai Ukuran</h3>
                        <p className="text-gray-600">
                            Mulai dari dokumen, koper, hingga motor
                        </p>
                    </div>
                    <div className="p-4">
                        <Clock
                            size={40}
                            className="mx-auto text-green-600 mb-2"
                        />
                        <h3 className="font-bold text-lg">Waktu Fleksibel</h3>
                        <p className="text-gray-600">Harian hingga bulanan</p>
                    </div>
                    <div className="p-4">
                        <Car
                            size={40}
                            className="mx-auto text-green-600 mb-2"
                        />
                        <h3 className="font-bold text-lg">Layanan Antar</h3>
                        <p className="text-gray-600">Pengiriman tersedia</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

const Services = ({ services, onOrderClick }) => {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800">
                        Layanan Penitipan Kami
                    </h2>
                    <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
                        Kami menyediakan layanan penitipan barang yang lengkap
                        dan fleksibel.
                    </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service) => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            onOrderClick={onOrderClick}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

const Stats = () => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
    const stats = [
        { value: 5, suffix: "+", label: "Tahun Beroperasi" },
        { value: 1500, suffix: "+", label: "Pelanggan Setia" },
        { value: 5000, suffix: "+", label: "Barang Dititipkan" },
        { value: 4.8, decimals: 1, suffix: "/5", label: "Rating Kepuasan" },
    ];
    return (
        <section ref={ref} className="bg-green-600 text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((stat, index) => (
                        <div key={index}>
                            <p className="text-4xl font-bold">
                                {inView ? (
                                    <CountUp
                                        end={stat.value}
                                        duration={2.5}
                                        decimals={stat.decimals || 0}
                                    />
                                ) : (
                                    "0"
                                )}
                                {stat.suffix}
                            </p>
                            <p className="text-green-200">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const WhyUs = () => {
    const features = [
        {
            icon: <ShieldCheck size={24} className="text-green-600" />,
            title: "Keamanan Terjamin",
            description:
                "Sistem keamanan 24/7 dengan CCTV dan akses terkontrol.",
        },
        {
            icon: <Clock size={24} className="text-green-600" />,
            title: "Fleksibilitas Waktu",
            description:
                "Penitipan harian hingga bulanan sesuai kebutuhan Anda.",
        },
        {
            icon: <MapPin size={24} className="text-green-600" />,
            title: "Lokasi Strategis",
            description: "Mudah dijangkau dengan akses transportasi yang baik.",
        },
        {
            icon: <Car size={24} className="text-green-600" />,
            title: "Layanan Antar Jemput",
            description: "Tersedia layanan pengiriman untuk kemudahan Anda.",
        },
        {
            icon: <Users size={24} className="text-green-600" />,
            title: "Tim Profesional",
            description: "Didukung tim yang berpengalaman dan terlatih.",
        },
        {
            icon: <Star size={24} className="text-green-600" />,
            title: "Kepercayaan Pelanggan",
            description:
                "Telah dipercaya ribuan pelanggan dengan rating tinggi.",
        },
    ];
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800">
                        Mengapa Pilih Titipsini?
                    </h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const Testimonials = () => {
    const reviews = [
        {
            name: "Rizki A.",
            text: '"Pelayanan sangat memuaskan!"',
            img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
        },
        {
            name: "Lisa M.",
            text: '"Tim nya profesional."',
            img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
        },
        {
            name: "Lina Y.",
            text: '"Selalu puas."',
            img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200",
        },
    ];
    const [currentIndex, setCurrentIndex] = useState(0);
    const goToPrevious = () =>
        setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
    const goToNext = () =>
        setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
    return (
        <section className="py-16 bg-white">
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
                                />
                            ))}
                        </div>
                        <p className="text-lg italic text-gray-700 mb-6 min-h-[100px]">
                            "{reviews[currentIndex].text}"
                        </p>
                        <div className="flex items-center justify-center">
                            <img
                                src={reviews[currentIndex].img}
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
            </div>
        </section>
    );
};

const FAQ = () => {
    const [openFaqIndex, setOpenFaqIndex] = useState(0);
    const faqs = [
        {
            question: "Apa saja jenis barang?",
            answer: "Pakaian, elektronik, dll.",
        },
        { question: "Sistem keamanan?", answer: "CCTV 24 jam." },
        { question: "Lama penitipan?", answer: "Harian hingga tahunan." },
        { question: "Antar jemput?", answer: "Ya, tersedia." },
    ];
    const handleFaqClick = (index) =>
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800">
                        Pertanyaan Umum
                    </h2>
                </div>
                <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
                    {faqs.map((faq, index) => (
                        <FaqItem
                            key={index}
                            {...faq}
                            isOpen={openFaqIndex === index}
                            onClick={() => handleFaqClick(index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- 5. KOMPONEN UTAMA WELCOME ---
const Welcome = (props) => {
    const { services } = props;
    const { auth, userVerificationStatus } = usePage().props;

    // State untuk Modal
    const [isOrderModalOpen, setOrderModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [isVerificationModalOpen, setVerificationModalOpen] = useState(false); // [BARU] State modal verifikasi

    // --- Logika Utama (4 Kasus) ---
    const handleOrderClick = (service) => {
        // 1. Cek Login
        if (!auth.user) {
            router.get(route("login"));
            return;
        }

        // 2 & 3. Cek Verifikasi (Belum / Ditolak / Pending)
        // [PERBAIKAN] Gunakan Modal, jangan redirect
        if (userVerificationStatus !== "approved") {
            setVerificationModalOpen(true);
            return;
        }

        // 4. Verifikasi OK -> Buka Modal Order
        if (userVerificationStatus === "approved") {
            setSelectedService(service);
            setOrderModalOpen(true);
        }
    };

    return (
        <>
            <Hero />
            <Services services={services} onOrderClick={handleOrderClick} />
            <Stats />
            <WhyUs />
            <Testimonials />
            <FAQ />

            {/* Render Modal Order */}
            <OrderModal
                show={isOrderModalOpen}
                onClose={() => setOrderModalOpen(false)}
                product={selectedService}
                productType="service" // Tipe: Penitipan Barang
            />

            {/* [BARU] Render Modal Verifikasi */}
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

// Menetapkan layout untuk halaman ini.
Welcome.layout = (page) => <GuestLayout children={page} />;

export default Welcome;
