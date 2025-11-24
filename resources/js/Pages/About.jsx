import React from "react";
import GuestLayout from "../Layouts/GuestLayout";
import {
    ShieldCheck,
    Users,
    HeartHandshake,
    Clock,
    Phone,
    ArrowRight,
} from "lucide-react";
import { usePage, Link } from "@inertiajs/react";

// --- SECTIONS ---

// Hero Section (Stats dihapus)
const AboutHero = () => {
    return (
        <section className="relative bg-gradient-to-b from-emerald-50 via-white to-white pt-32 pb-20 overflow-hidden rounded-b-[3rem]">
            {/* Decoration Blobs - Soft Green */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-[100px] pointer-events-none -translate-y-1/4 translate-x-1/4"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-50/60 rounded-full blur-[80px] pointer-events-none translate-y-1/4 -translate-x-1/4"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white border border-emerald-200 shadow-sm mb-8 hover:shadow-md transition-all cursor-default">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-emerald-700 tracking-[0.15em] uppercase">
                        Tentang Kami
                    </span>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
                    Solusi Penyimpanan <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
                        Terpercaya & Aman
                    </span>
                </h1>
                <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed">
                    Sejak 2021, Titipsini telah menjadi pilihan utama untuk
                    layanan penitipan barang yang aman, fleksibel, dan
                    terpercaya di Indonesia.
                </p>
            </div>
        </section>
    );
};

// Story Section
const OurStory = () => (
    <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="order-2 lg:order-1">
                    <div className="relative">
                        <div className="absolute -inset-4 bg-emerald-100 rounded-[2.5rem] transform -rotate-2"></div>
                        <img
                            src="/images/hero-about.jpg"
                            alt="Cerita Titipsini"
                            className="relative rounded-[2rem] shadow-2xl w-full h-auto object-cover transform rotate-1 hover:rotate-0 transition-transform duration-500 border-4 border-white"
                            onError={(e) => {
                                e.target.src =
                                    "https://placehold.co/600x500/ecfdf5/10b981?text=Our+Story";
                            }}
                        />
                    </div>
                </div>
                <div className="order-1 lg:order-2">
                    <span className="text-emerald-600 font-bold tracking-widest uppercase text-xs">
                        Cerita Kami
                    </span>
                    <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-6">
                        Dimulai dari Kebutuhan Sederhana
                    </h2>
                    <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                        <p>
                            Titipsini lahir dari pengalaman pribadi founder yang
                            kesulitan mencari tempat penitipan barang yang aman
                            dan terpercaya saat pindah kost. Dari situlah ide
                            untuk menciptakan solusi penyimpanan yang mudah
                            diakses dan fleksibel.
                        </p>
                        <p>
                            Dengan komitmen pada keamanan dan pelayanan prima,
                            kami telah berkembang menjadi penyedia layanan
                            storage terdepan yang melayani berbagai kebutuhan,
                            mulai dari penitipan barang travelling hingga
                            penyimpanan kendaraan.
                        </p>
                        <p>
                            Hari ini, ribuan pelanggan mempercayakan barang
                            berharga mereka kepada kami, dan kami terus
                            berinovasi untuk memberikan pengalaman terbaik.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

// Values Section
const OurValues = () => {
    const values = [
        {
            icon: <ShieldCheck className="w-8 h-8" />,
            title: "Keamanan Terjamin",
            description:
                "Sistem keamanan 24/7 dengan CCTV dan akses terkontrol untuk menjaga barang Anda.",
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "Pelayanan Prima",
            description:
                "Tim profesional yang siap membantu dengan pelayanan ramah dan responsif.",
        },
        {
            icon: <HeartHandshake className="w-8 h-8" />,
            title: "Terpercaya",
            description:
                "Dipercaya ribuan pelanggan dengan track record yang excellent.",
        },
        {
            icon: <Clock className="w-8 h-8" />,
            title: "Fleksibel",
            description:
                "Waktu penitipan yang fleksibel sesuai kebutuhan, dari harian hingga bulanan.",
        },
    ];
    return (
        <section className="py-24 bg-emerald-50/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <span className="text-emerald-600 font-bold tracking-widest uppercase text-xs">
                        Nilai Kami
                    </span>
                    <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                        Mengapa Memilih Titipsini?
                    </h2>
                    <p className="mt-4 text-gray-600 text-lg">
                        Komitmen kami terhadap excellence tercermin dalam setiap
                        aspek layanan yang kami berikan.
                    </p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {values.map((value, index) => (
                        <div
                            key={index}
                            className="group bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-emerald-50"
                        >
                            <div className="flex justify-center items-center mx-auto bg-emerald-50 text-emerald-600 rounded-2xl w-16 h-16 mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                                {value.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                                {value.title}
                            </h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                {value.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// CTA Section
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
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 pb-16">
                <div className="bg-emerald-100 rounded-[3rem] p-12 md:p-20 text-center border-2 border-emerald-200 shadow-xl relative overflow-hidden">
                    {/* Texture Background */}
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-bold text-emerald-950 mb-6 leading-tight">
                            Siap Mempercayakan Barang Anda?
                        </h2>
                        <p className="text-emerald-700 text-lg mb-10 font-medium">
                            Bergabunglah dengan ribuan pelanggan yang telah
                            merasakan layanan storage terpercaya kami.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href={route("penitipan.index")}
                                className="inline-flex items-center justify-center bg-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all transform hover:-translate-y-1"
                            >
                                Lihat Layanan{" "}
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center bg-white text-emerald-700 px-8 py-4 rounded-full font-bold text-lg border-2 border-emerald-200 hover:bg-emerald-50 transition-colors shadow-sm"
                            >
                                <Phone className="w-5 h-5 mr-2" /> Hubungi Kami
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- Komponen Utama Halaman About ---
const About = () => {
    return (
        <>
            {/* Wrapper utama menggunakan background putih dan selection color custom */}
            <div className="font-sans bg-white selection:bg-emerald-100 selection:text-emerald-800">
                <AboutHero />
                <OurStory />
                <OurValues />
                <CtaSection />
            </div>
        </>
    );
};

// Menetapkan layout untuk halaman ini
About.layout = (page) => <GuestLayout children={page} />;

export default About;
