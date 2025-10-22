import React from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import { ShieldCheck, Users, HeartHandshake, Clock } from "lucide-react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { usePage } from "@inertiajs/react"; // <-- DITAMBAHKAN

// --- SECTIONS ---

// Hero Section
const AboutHero = () => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
    const stats = [
        { value: 5000, label: "Barang Dititipkan" },
        { value: 2000, label: "Pelanggan Puas" },
        { value: 3, label: "Tahun Pengalaman" },
        { value: "24/7", label: "Keamanan" },
    ];

    return (
        <section
            ref={ref}
            className="relative bg-gradient-to-b from-gray-50 to-white pt-24 pb-12 sm:pt-32 sm:pb-16"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-800 tracking-tight">
                    Solusi Penyimpanan{" "}
                    <span className="text-green-600">Terpercaya</span>
                </h1>
                <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
                    Sejak 2021, Titipsini telah menjadi pilihan utama untuk
                    layanan penitipan barang yang aman, fleksibel, dan
                    terpercaya di Indonesia.
                </p>
            </div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center"
                        >
                            <p className="text-3xl sm:text-4xl font-bold text-green-600">
                                {typeof stat.value === "number" && inView ? (
                                    <CountUp
                                        end={stat.value}
                                        duration={3}
                                        separator="."
                                    />
                                ) : (
                                    stat.value
                                )}
                                {typeof stat.value === "number" ? "+" : ""}
                            </p>
                            <p className="text-sm sm:text-base text-gray-500 mt-1">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Story Section
const OurStory = () => (
    <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                    <p className="font-semibold text-green-600 uppercase tracking-wide">
                        Cerita Kami
                    </p>
                    <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">
                        Dimulai dari Kebutuhan Sederhana
                    </h2>
                    <p className="mt-4 text-gray-600">
                        Titipsini lahir dari pengalaman pribadi founder yang
                        kesulitan mencari tempat penitipan barang yang aman dan
                        terpercaya saat pindah kost. Dari situlah ide untuk
                        menciptakan solusi penyimpanan yang mudah diakses dan
                        fleksibel.
                    </p>
                    <p className="mt-4 text-gray-600">
                        Dengan komitmen pada keamanan dan pelayanan prima, kami
                        telah berkembang menjadi penyedia layanan storage
                        terdepan yang melayani berbagai kebutuhan, mulai dari
                        penitipan barang travelling hingga penyimpanan
                        kendaraan.
                    </p>
                    <p className="mt-4 text-gray-600">
                        Hari ini, ribuan pelanggan mempercayakan barang berharga
                        mereka kepada kami, dan kami terus berinovasi untuk
                        memberikan pengalaman terbaik.
                    </p>
                </div>
                <div className="flex justify-center items-center">
                    <img
                        src="images/hero-about.jpg"
                        alt="Ilustrasi Truk Titipsini"
                        className="rounded-lg shadow-xl"
                    />
                </div>
            </div>
        </div>
    </section>
);

// Values Section
const OurValues = () => {
    const values = [
        {
            icon: <ShieldCheck className="w-8 h-8 text-green-600" />,
            title: "Keamanan Terjamin",
            description:
                "Sistem keamanan 24/7 dengan CCTV dan akses terkontrol untuk menjaga barang Anda.",
        },
        {
            icon: <Users className="w-8 h-8 text-green-600" />,
            title: "Pelayanan Prima",
            description:
                "Tim profesional yang siap membantu dengan pelayanan ramah dan responsif.",
        },
        {
            icon: <HeartHandshake className="w-8 h-8 text-green-600" />,
            title: "Terpercaya",
            description:
                "Dipercaya ribuan pelanggan dengan track record yang excellent.",
        },
        {
            icon: <Clock className="w-8 h-8 text-green-600" />,
            title: "Fleksibel",
            description:
                "Waktu penitipan yang fleksibel sesuai kebutuhan, dari harian hingga bulanan.",
        },
    ];
    return (
        <section className="py-16 sm:py-24 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <p className="font-semibold text-green-600 uppercase tracking-wide">
                        Nilai-Nilai Kami
                    </p>
                    <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">
                        Mengapa Memilih Titipsini?
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-gray-600">
                        Komitmen kami terhadap excellence tercermin dalam setiap
                        aspek layanan.
                    </p>
                </div>
                <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {values.map((value, index) => (
                        <div
                            key={index}
                            className="text-center p-6 bg-white rounded-lg shadow-md border border-gray-100"
                        >
                            <div className="flex justify-center items-center mx-auto bg-green-100 rounded-full w-16 h-16">
                                {value.icon}
                            </div>
                            <h3 className="mt-5 text-lg font-semibold text-gray-800">
                                {value.title}
                            </h3>
                            <p className="mt-2 text-sm text-gray-600">
                                {value.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Team Section
const OurTeam = () => {
    const teamMembers = [
        {
            name: "Ahmad Rizki",
            role: "Founder & CEO",
            description:
                "Berpengalaman 10+ tahun di bidang logistik dan storage.",
            image: "/images/team/ahmad-riski.jpg",
        },
        {
            name: "Sari Dewi",
            role: "Operations Manager",
            description:
                "Ahli dalam manajemen operasional dan customer service.",
            image: "/images/team/sari-dewi.jpg",
        },
        {
            name: "Budi Santoso",
            role: "Security Chief",
            description: "Spesialis keamanan dengan sertifikasi internasional.",
            image: "/images/team/ahmad-riski.jpg",
        },
    ];
    return (
        <section className="py-16 sm:py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <p className="font-semibold text-green-600 uppercase tracking-wide">
                        Tim Kami
                    </p>
                    <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">
                        Orang-Orang di Balik Titipsini
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-gray-600">
                        Tim profesional yang berdedikasi untuk memberikan
                        layanan terbaik.
                    </p>
                </div>
                <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {teamMembers.map((member, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 text-center"
                        >
                            <img
                                src={member.image}
                                alt={member.name}
                                className="w-full h-80 object-cover"
                            />
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-800">
                                    {member.name}
                                </h3>
                                <p className="text-green-600 font-semibold">
                                    {member.role}
                                </p>
                                <p className="mt-2 text-sm text-gray-600">
                                    {member.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// CTA Section
const CtaSection = () => {
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
        <section className="bg-green-600">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <h2 className="text-3xl font-bold text-white">
                    Siap Mempercayakan Barang Anda?
                </h2>
                <p className="mt-2 text-green-200 max-w-2xl mx-auto">
                    Bergabunglah dengan ribuan pelanggan yang telah merasakan
                    layanan storage terpercaya kami.
                </p>
                <div className="mt-8 flex gap-4 justify-center">
                    {/* --- Tombol diubah ke link WhatsApp --- */}
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                        Lihat Layanan
                    </a>
                    {/* --- Tombol diubah ke link WhatsApp --- */}
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold border border-green-500 hover:bg-green-800 transition-colors"
                    >
                        Hubungi Kami
                    </a>
                </div>
            </div>
        </section>
    );
};

// --- Komponen Utama Halaman About ---
const About = () => {
    return (
        <>
            <AboutHero />
            <OurStory />
            <OurValues />
            <OurTeam />
            <CtaSection />
        </>
    );
};

// Menetapkan layout untuk halaman ini
About.layout = (page) => <GuestLayout children={page} />;

export default About;
