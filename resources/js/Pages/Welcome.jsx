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
import GuestLayout from "../Layouts/GuestLayout";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { usePage } from "@inertiajs/react"; // <-- DITAMBAHKAN

// Komponen untuk setiap kartu layanan
const ServiceCard = ({ illustration, title, description, features }) => {
    // --- Logika WhatsApp Ditambahkan ---
    const { settings } = usePage().props;
    const phoneNumber = settings.contact_phone
        ? settings.contact_phone.replace(/\D/g, "")
        : "";
    const message = settings.whatsapp_message
        ? encodeURIComponent(settings.whatsapp_message)
        : "";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    // --- Akhir Logika WhatsApp ---

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
                <p className="text-gray-600 mb-6 flex-grow">{description}</p>
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
                {/* --- Tombol diubah menjadi <a> tag ke WhatsApp --- */}
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 text-center"
                >
                    Pilih Layanan
                </a>
            </div>
        </div>
    );
};

// Komponen untuk setiap kartu keunggulan
const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 h-full">
        <div className="flex items-center justify-center bg-green-100 rounded-full w-12 h-12 mb-4">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
    </div>
);

// Komponen untuk item FAQ
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

// --- SECTIONS ---

const Hero = () => {
    // --- Logika WhatsApp Ditambahkan ---
    const { settings } = usePage().props;
    const phoneNumber = settings.contact_phone
        ? settings.contact_phone.replace(/\D/g, "")
        : "";
    const message = settings.whatsapp_message
        ? encodeURIComponent(settings.whatsapp_message)
        : "";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    // --- Akhir Logika WhatsApp ---

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
                            saat traveling, pindahan kost, atau kendaraan. Waktu
                            penitipan fleksibel dari harian hingga bulanan,
                            dengan layanan pengiriman jika tidak bisa ambil
                            langsung.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            {/* --- Tombol diubah ke link WhatsApp --- */}
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all text-center shadow-md hover:shadow-lg"
                            >
                                Titip Sekarang
                            </a>
                            {/* --- Tombol diubah ke link WhatsApp --- */}
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
                            alt="Ilustrasi Penitipan Barang"
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

const Services = ({ services }) => {
    // Terima props 'services'
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800">
                        Layanan Penitipan Kami
                    </h2>
                    <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
                        Kami menyediakan layanan penitipan barang yang lengkap
                        dan fleksibel, mulai dari barang kecil hingga kendaraan.
                        Tersedia pilihan harian dan bulanan, plus layanan
                        pengiriman untuk kemudahan Anda.
                    </p>
                </div>

                {/* Langsung map dari props, tidak perlu state atau loading check */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service) => (
                        <ServiceCard key={service.id} {...service} />
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
                "Sistem keamanan 24/7 dengan CCTV dan akses terkontrol untuk melindungi Barang Anda.",
        },
        {
            icon: <Clock size={24} className="text-green-600" />,
            title: "Fleksibilitas Waktu",
            description:
                "Penitipan harian hingga bulanan sesuai kebutuhan dengan tarif yang kompetitif.",
        },
        {
            icon: <MapPin size={24} className="text-green-600" />,
            title: "Lokasi Strategis",
            description:
                "Berada di lokasi yang mudah dijangkau dengan akses transportasi yang baik.",
        },
        {
            icon: <Car size={24} className="text-green-600" />,
            title: "Layanan Antar Jemput",
            description:
                "Tersedia layanan pengiriman untuk kemudahan pengambilan barang Anda.",
        },
        {
            icon: <Users size={24} className="text-green-600" />,
            title: "Tim Profesional",
            description:
                "Didukung tim yang berpengalaman dan terlatih dalam penanganan berbagai jenis barang.",
        },
        {
            icon: <Star size={24} className="text-green-600" />,
            title: "Kepercayaan Pelanggan",
            description:
                "Telah dipercaya ribuan pelanggan dengan rating kepuasan tinggi.",
        },
    ];
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800">
                        Mengapa Pilih Titipsini?
                    </h2>
                    <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
                        Kami berkomitmen memberikan layanan penitipan barang
                        terbaik dengan standar keamanan dan kenyamanan tinggi.
                    </p>
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

// Testimonials menjadi Carousel Interaktif
const Testimonials = () => {
    const testimonials = [
        {
            quote: "Sangat membantu saat pindah kost! Barang-barang saya aman tersimpan selama 2 minggu. Harga terjangkau dan pelayanan ramah.",
            name: "Andi Pratama",
            title: "Mahasiswa",
            image: "https://i.pravatar.cc/150?u=andi",
        },
        {
            quote: "Saya titip motor di sini selama mudik lebaran. Pulang-pulang motor bersih dan akinya tetap bagus. Recommended banget!",
            name: "Budi Santoso",
            title: "Karyawan Swasta",
            image: "https://i.pravatar.cc/150?u=budi",
        },
        {
            quote: "Sebagai traveler, Titipsini ini penyelamat. Bisa titip koper besar dan ambil kapan saja. Fleksibel dan lokasinya strategis.",
            name: "Citra Lestari",
            title: "Travel Blogger",
            image: "https://i.pravatar.cc/150?u=citra",
        },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide
            ? testimonials.length - 1
            : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === testimonials.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800">
                        Testimoni Pelanggan
                    </h2>
                    <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
                        Kepercayaan pelanggan adalah aset terbesar kami. Simak
                        pengalaman mereka.
                    </p>
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
                            "{testimonials[currentIndex].quote}"
                        </p>
                        <div className="flex items-center justify-center">
                            <img
                                src={testimonials[currentIndex].image}
                                alt={testimonials[currentIndex].name}
                                className="w-12 h-12 rounded-full mr-4"
                            />
                            <div>
                                <p className="font-bold text-gray-800">
                                    {testimonials[currentIndex].name}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {testimonials[currentIndex].title}
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
                    {testimonials.map((_, index) => (
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

const FAQ = () => {
    const [openFaqIndex, setOpenFaqIndex] = useState(0);
    const faqs = [
        {
            question: "Apa saja jenis barang yang bisa dititipkan?",
            answer: "Kami menerima berbagai jenis barang mulai dari pakaian, elektronik, furniture, dokumen penting, hingga kendaraan seperti motor. Barang yang tidak diperbolehkan adalah barang berbahaya, mudah terbakar, dan barang ilegal.",
        },
        {
            question: "Bagaimana sistem keamanan di Titipsini?",
            answer: "Keamanan adalah prioritas kami. Kami memiliki CCTV 24 jam, akses terbatas, dan staf keamanan yang berjaga untuk memastikan barang Anda aman.",
        },
        {
            question: "Berapa lama minimal dan maksimal penitipan?",
            answer: "Anda bisa menitipkan barang mulai dari 1 hari hingga tahunan. Kami menawarkan paket harian, mingguan, bulanan, dan tahunan yang fleksibel.",
        },
        {
            question: "Apakah ada layanan antar jemput barang?",
            answer: "Ya, kami menyediakan layanan antar jemput dengan biaya tambahan yang terjangkau untuk memudahkan Anda, terutama untuk barang besar atau jika Anda tidak punya waktu.",
        },
    ];
    const handleFaqClick = (index) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800">
                        Pertanyaan Umum
                    </h2>
                    <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
                        Temukan jawaban atas pertanyaan yang sering diajukan
                        tentang layanan penitipan barang kami.
                    </p>
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

// --- Komponen Utama Halaman Welcome ---
const Welcome = ({
    services,
    canLogin,
    canRegister,
    laravelVersion,
    phpVersion,
}) => {
    return (
        <>
            <Hero />
            {/* Sekarang variabel 'services' sudah pasti ada dan bisa digunakan */}
            <Services services={services} />
            <Stats />
            <WhyUs />
            <Testimonials />
            <FAQ />
        </>
    );
};

// Menetapkan layout untuk halaman ini.
Welcome.layout = (page) => <GuestLayout children={page} />;

export default Welcome;
