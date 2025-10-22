import React from "react";
import {
    FaTags,
    FaBuilding,
    FaMobileAlt,
    FaBullhorn,
    FaShieldAlt,
    FaChartLine,
    FaGift,
    FaHeadset,
    FaCheckCircle,
    FaStar,
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaClipboardCheck,
    FaLockOpen,
    FaLightbulb,
} from "react-icons/fa";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";

const Header = () => (
    <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <a href="/" className="flex items-center">
                <img
                    src="/images/titipsini.com.png"
                    alt="Logo Titipsini.com"
                    className="h-12 w-auto"
                />
            </a>

            <nav className="hidden md:flex space-x-8">
                {["Beranda", "Tentang Kami", "Keuntungan", "Kontak"].map(
                    (item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
                            className="text-gray-600 hover:text-primary font-medium transition duration-300"
                        >
                            {item}
                        </a>
                    )
                )}
            </nav>
            <a
                href="#gabung"
                className="bg-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-primary-dark transition duration-300"
            >
                Gabung Sekarang
            </a>
        </div>
    </header>
);

// 🔹 HERO SECTION
const StatCard = ({ value, label }) => (
    <div className="text-center">
        <p className="text-4xl font-bold text-primary">{value}</p>
        <p className="text-gray-600 mt-1">{label}</p>
    </div>
);

const Hero = () => (
    <section
        id="beranda"
        className="bg-primary-light pt-24 pb-20 overflow-hidden"
    >
        <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="lg:w-1/2 text-center lg:text-left">
                    <span className="inline-flex items-center bg-white text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-3 border border-gray-200">
                        <FaLightbulb className="mr-2" /> Platform Mitra
                        Terpercaya
                    </span>
                    <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mt-2">
                        Buka Peluang <span className="text-primary">Usaha</span>{" "}
                        Menguntungkan{" "}
                        <span className="text-primary">Bersama</span>{" "}
                        Titipsini.com
                    </h2>
                    <p className="text-gray-600 mt-6 text-lg max-w-lg">
                        Bergabunglah dengan ribuan mitra sukses dan raih
                        penghasilan hingga jutaan rupiah setiap bulannya.
                    </p>
                    <div className="mt-10 flex justify-center lg:justify-start gap-4">
                        <a
                            href="#gabung"
                            className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-dark transition duration-300 shadow-md hover:shadow-lg"
                        >
                            Gabung Sekarang
                        </a>
                        <a
                            href="#pelajari"
                            className="bg-white text-primary font-bold py-3 px-8 rounded-lg border border-primary hover:bg-gray-100 transition duration-300 shadow-md hover:shadow-lg"
                        >
                            Pelajari Lebih Lanjut
                        </a>
                    </div>
                </div>
                <div className="lg:w-1/2 mt-16 lg:mt-0 flex justify-center">
                    <div className="bg-white p-8 rounded-xl shadow-2xl grid grid-cols-2 gap-8 w-full max-w-lg lg:max-w-md xl:max-w-lg">
                        <StatCard value="1" label="Tahun" />
                        <StatCard value="70+" label="Mitra" />
                        <StatCard value="100+" label="Pelanggan" />
                        <StatCard value="200+" label="Suka" />
                    </div>
                </div>
            </div>
        </div>
    </section>
);

// 🔹 ABOUT SECTION
const SectionCuan = () => (
    <section className="bg-white py-20">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
                <img
                    src="/images/properti.jpg"
                    alt="Ilustrasi properti dan pertumbuhan investasi"
                    className="rounded-xl shadow-xl w-full"
                />
            </div>
            <div className="lg:w-1/2 text-center lg:text-left">
                <span className="inline-flex items-center bg-primary-light text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-3">
                    <FaGift className="mr-2" /> Peluang Emas
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mt-2">
                    Ubah Properti Tidak Terpakai{" "}
                    <span className="text-primary">Jadi Ladang Cuan!</span>
                </h2>
                <p className="text-gray-600 mt-6 text-lg max-w-lg mx-auto lg:mx-0">
                    Apakah Anda memiliki properti yang menganggur? Rumah kosong,
                    ruko tidak terpakai, atau lahan yang belum dimanfaatkan?
                    Jangan biarkan aset berharga Anda sia-sia! Bergabunglah
                    dengan Titipsini.com dan ubah properti idle menjadi sumber
                    penghasilan yang menguntungkan.
                </p>
                <ul className="mt-8 space-y-3 text-gray-700 text-lg text-left max-w-lg mx-auto lg:mx-0">
                    <li className="flex items-center">
                        <FaCheckCircle className="text-primary mr-3 flex-shrink-0" />
                        Properti kosong bisa menghasilkan jutaan rupiah
                    </li>
                    <li className="flex items-center">
                        <FaCheckCircle className="text-primary mr-3 flex-shrink-0" />
                        Sistem bagi hasil yang adil dan transparan
                    </li>
                    <li className="flex items-center">
                        <FaCheckCircle className="text-primary mr-3 flex-shrink-0" />
                        Dukungan penuh dari tim profesional
                    </li>
                </ul>
            </div>
        </div>
    </section>
);

// 🔹 ABOUT SECTION - (Apa Itu Titipsini?)
const AboutPlatform = () => (
    <section id="tentang-kami" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 text-center lg:text-left">
                <span className="inline-flex items-center bg-primary-light text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-3">
                    <FaLightbulb className="mr-2" /> Tentang Platform
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6">
                    Apa Itu Titipsini.com?
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
                    Titipsini.com adalah platform terdepan yang menghubungkan
                    pemilik properti dengan peluang bisnis menguntungkan. Kami
                    membantu Anda mengoptimalkan aset properti yang tidak
                    terpakai menjadi sumber penghasilan berkelanjutan melalui
                    berbagai skema kerjasama yang fleksibel dan menguntungkan.
                </p>
            </div>
            <div className="lg:w-1/2">
                <img
                    src="/images/about-illustration.jpg"
                    alt="Ilustrasi tim bekerja dengan dashboard"
                    className="rounded-xl shadow-xl w-full"
                />
            </div>
        </div>
    </section>
);

// 🔹 FEATURES SECTION
const FeatureCard = ({ icon, title }) => (
    <div className="bg-primary text-white p-6 rounded-lg flex flex-col items-center text-center shadow-lg hover:shadow-primary/40 hover:-translate-y-2 transition duration-300">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="font-semibold">{title}</h3>
    </div>
);

const Features = () => {
    const data = [
        { icon: <FaTags />, title: "Harga Properti Terbaik" },
        { icon: <FaBuilding />, title: "Sewa Properti Jangka Panjang" },
        { icon: <FaMobileAlt />, title: "Aplikasi Mobile User-Friendly" },
        { icon: <FaBullhorn />, title: "Strategi Marketing Efektif" },
        { icon: <FaShieldAlt />, title: "Keamanan Data Terjamin" },
        { icon: <FaChartLine />, title: "Analisis Pasar Real-time" },
        { icon: <FaGift />, title: "Program Reward Menarik" },
        { icon: <FaHeadset />, title: "Customer Service 24/7" },
    ];
    return (
        <section id="keuntungan" className="bg-white py-20">
            <div className="container mx-auto px-6 text-center">
                <span className="inline-flex items-center bg-primary-light text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-3">
                    <FaLightbulb className="mr-2" /> Keunggulan Platform
                </span>
                <h2 className="text-4xl font-bold text-gray-900 mt-4 mb-12">
                    Kenapa Harus Jadi{" "}
                    <span className="text-primary">Mitra Titipsini.com?</span>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {data.map((d, i) => (
                        <FeatureCard key={i} {...d} />
                    ))}
                </div>
            </div>
        </section>
    );
};

// 🔹 BONUS/ACCESS SECTION
const BonusItem = ({ text }) => (
    <li className="flex items-start text-gray-700 text-lg">
        <FaCheckCircle className="text-primary mr-3 mt-1 flex-shrink-0" />
        <span>{text}</span>
    </li>
);

const BonusAccess = () => {
    const bonusData = [
        "Pelatihan online (pembelajaran online bisnis, bisnis online, teknik jual, dll)",
        "Sertifikat dari Titipsini.com",
        "Panduan Bisnis Lengkap (panduan bisnis online, panduan bisnis offline, dll)",
        "1 tahun gratis OKR sistem untuk bisnis dan bisnis",
        "Listing bisnis di website dengan harga yang murah (hanya untuk mitra)",
        "Template promosi digital (FB Ads, IG Ads, Google Ads, dll)",
        "Grup bisnis online dan offline (grup bisnis online, grup bisnis offline, dll)",
        "Bonus sistem bisnis lengkap (sistem bisnis online, sistem bisnis offline, dll)",
        "Sertifikat promosi digital (FB Ads, IG Ads, Google Ads, dll)",
    ];

    const accessData = [
        "Akses lengkap",
        "Pelatihan offline (jika ada event, bisnis gathering, dll)",
        "Template dan Materi Bisnis (template IG, template FB, template WA, dll)",
        "Akses ke Grup WA (akses ke grup WA, grup Telegram, dll)",
        "Bonus sistem bisnis lengkap (sistem bisnis online, sistem bisnis offline, dll)",
        "Akses ke event bisnis gathering (jika ada event bisnis gathering, dll)",
        "Panduan bisnis online dan offline (panduan bisnis online, panduan bisnis offline, dll)",
        "Bonus sistem bisnis lengkap (sistem bisnis online, sistem bisnis offline, dll)",
        "Panduan bisnis online dan offline (panduan bisnis online, panduan bisnis offline, dll)",
    ];

    return (
        <section className="bg-gray-50 py-20">
            <div className="container mx-auto px-6 text-center">
                <span className="inline-flex items-center bg-primary-light text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-3">
                    <FaLightbulb className="mr-2" /> Keuntungan Eksklusif
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6 leading-tight">
                    Gabung Sekali,{" "}
                    <span className="text-primary">
                        Dapat Semua Keuntungannya
                    </span>
                </h2>
                <p className="text-gray-600 text-lg max-w-3xl mx-auto mb-16">
                    Keuntungan yang didapatkan oleh mitra dengan bergabung
                    bersama kami
                </p>

                <div className="grid lg:grid-cols-2 gap-12 text-left max-w-4xl mx-auto">
                    <div>
                        <h3 className="font-semibold text-xl text-gray-800 mb-6 flex items-center">
                            <FaClipboardCheck className="text-primary mr-3 text-2xl" />{" "}
                            Bonus
                        </h3>
                        <ul className="space-y-4">
                            {bonusData.map((text, i) => (
                                <BonusItem key={i} text={text} />
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-xl text-gray-800 mb-6 flex items-center">
                            <FaLockOpen className="text-primary mr-3 text-2xl" />{" "}
                            Akses Lengkap
                        </h3>
                        <ul className="space-y-4">
                            {accessData.map((text, i) => (
                                <BonusItem key={i} text={text} />
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

//PAKET KEMITRAAN
const PricingCard = ({ title, price, duration, features, isFeatured }) => (
    <div
        className={`border rounded-lg p-8 w-full max-w-sm flex flex-col bg-white transition-all duration-300 ${
            isFeatured
                ? "border-primary border-2 shadow-2xl"
                : "border-gray-200 shadow-lg"
        }`}
    >
        <p className="text-sm font-semibold text-gray-500">{title}</p>
        <h3 className="text-4xl font-extrabold text-primary mt-2">{price}</h3>
        <p className="text-gray-500 mt-2 text-base">{duration}</p>
        <ul className="mt-8 space-y-4 text-gray-700 flex-grow text-left">
            {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                    <FaCheckCircle className="text-primary mr-3 mt-1 flex-shrink-0" />
                    <span>{feature}</span>
                </li>
            ))}
        </ul>
        <button
            className={`mt-10 w-full py-3 rounded-lg font-semibold transition duration-300 ${
                isFeatured
                    ? "bg-primary text-white hover:bg-primary-dark"
                    : "bg-gray-100 text-primary hover:bg-gray-200"
            }`}
        >
            Pilih Paket
        </button>
    </div>
);

const Pricing = () => {
    const plans = [
        {
            title: "Paket 1 Bulan",
            price: "Rp 500.000",
            duration: "1 bulan akses penuh platform",
            features: [
                "Akses platform selama 1 bulan",
                "Pelatihan online dasar",
                "Template marketing standar",
                "Support via email",
            ],
            isFeatured: false,
        },
        {
            title: "Paket 1 Tahun",
            price: "Rp 3.000.000",
            duration: "1 tahun akses penuh + bonus eksklusif",
            features: [
                "Semua fitur paket 1 bulan",
                "Pelatihan offline eksklusif",
                "Mentoring 1-on-1",
                "Sertifikat resmi",
                "Priority support 24/7",
            ],
            isFeatured: true,
        },
    ];
    return (
        <section id="paket" className="py-20 bg-gray-50">
            <div className="container mx-auto px-6 text-center">
                <span className="inline-flex items-center bg-primary-light text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-3">
                    <FaLightbulb className="mr-2" /> Paket Kemitraan
                </span>
                <h2 className="text-4xl font-bold text-gray-900 mt-4">
                    Fleksibel dan Terjangkau, Langsung Jadi Mitra!
                </h2>
                <p className="text-gray-600 mt-4 text-lg mb-12">
                    Pilih paket yang sesuai dengan kebutuhan dan budget Anda
                </p>

                <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 md:gap-12 mt-12">
                    {plans.map((p, i) => (
                        <PricingCard key={i} {...p} />
                    ))}
                </div>
            </div>
        </section>
    );
};

// 🔹 TESTIMONIALS SECTION
const TestimonialCard = ({ name, location, quote }) => (
    <div className="bg-white p-8 rounded-lg shadow-md text-left flex flex-col justify-between h-full border border-gray-100">
        <p className="text-gray-600 italic flex-grow">"{quote}"</p>
        <div className="mt-6">
            <h4 className="font-bold text-gray-800">{name}</h4>
            <p className="text-sm text-gray-500">{location}</p>
            <div className="flex text-yellow-400 mt-2">
                {[...Array(5)].map((_, i) => (
                    <FaStar key={i} />
                ))}
            </div>
        </div>
    </div>
);

const Testimonials = () => {
    const data = [
        {
            name: "Budi Hartono",
            location: "Mitra Jakarta",
            quote: "Bergabung dengan Titipsini.com adalah keputusan terbaik! Properti kosong saya sekarang menghasilkan 5 juta per bulan. Tim supportnya juga sangat responsif dan membantu.",
        },
        {
            name: "Sari Wulandari",
            location: "Mitra Surabaya",
            quote: "Platform yang sangat mudah digunakan dan menguntungkan. Dalam 6 bulan, penghasilan dari properti saya sudah mencapai 30 juta. Terima kasih Titipsini.com!",
        },
        {
            name: "Ahmad Pratama",
            location: "Mitra Bandung",
            quote: "Pelatihan yang diberikan sangat komprehensif dan aplikatif. Sekarang saya bisa mengelola 3 properti sekaligus dengan mudah. ROI yang didapat juga sangat memuaskan.",
        },
    ];
    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-6 text-center">
                <span className="inline-flex items-center bg-primary-light text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-3">
                    <FaLightbulb className="mr-2" /> Testimoni Mitra
                </span>
                <h2 className="text-4xl font-bold text-gray-900 mt-4 mb-12">
                    Apa Kata Mitra Kami?
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {data.map((t, i) => (
                        <TestimonialCard key={i} {...t} />
                    ))}
                </div>
            </div>
        </section>
    );
};

// 🔹 HOW IT WORKS / CTA SECTION
const StepItem = ({ number, text }) => (
    <div className="flex flex-col items-center text-center px-4">
        <div className="w-16 h-16 bg-white text-primary rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-lg">
            {number}
        </div>
        <p className="max-w-xs text-white text-lg">{text}</p>
    </div>
);

const HowItWorks = () => {
    const steps = [
        "Daftar dan pilih paket yang sesuai",
        "Ikuti pelatihan dan dapatkan sertifikat",
        "Daftarkan properti Anda di platform",
        "Mulai terima penghasilan bulanan",
    ];
    return (
        <section id="gabung" className="bg-primary text-white py-20">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                    Bawa Teman, Dapat Cuan!
                </h2>
                <p className="mt-4 text-xl max-w-3xl mx-auto mb-16">
                    Gabung bersama ribuan mitra sukses lainnya dan mulai raih
                    penghasilan dari properti yang menganggur. Investasi sekali,
                    untung selamanya!
                </p>

                <h3 className="text-3xl font-bold mb-10">Ini Caranya:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
                    {steps.map((text, i) => (
                        <StepItem key={i} number={i + 1} text={text} />
                    ))}
                </div>

                <h3 className="text-3xl font-bold mt-12 mb-6">
                    Siap Jadi Bagian dari Ekosistem Penjualan Terbesar di
                    Indonesia?
                </h3>
                <p className="mt-4 text-xl max-w-3xl mx-auto">
                    Bergabunglah sekarang dan rasakan perbedaannya. Ribuan mitra
                    telah merasakan manfaatnya, sekarang giliran Anda!
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <a
                        href="#gabung-sekarang"
                        className="bg-white text-primary font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition shadow-md hover:shadow-lg"
                    >
                        Gabung Sekarang Juga!
                    </a>
                    <a
                        href="#konsultasi"
                        className="border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-primary transition shadow-md hover:shadow-lg"
                    >
                        Konsultasi Gratis
                    </a>
                </div>
            </div>
        </section>
    );
};

const FooterLink = ({ href, children }) => (
    <li>
        <a href={href} className="hover:text-white transition duration-300">
            {children}
        </a>
    </li>
);

// 🔹 FOOTER
const Footer = () => (
    <footer id="kontak" className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
                <a href="/" className="flex items-center space-x-3">
                    <img
                        src="/images/titipsini-fotter1.png"
                        alt="Logo Titipsini.com"
                        className="h-9 w-auto flex-shrink-0"
                    />
                    <span className="font-extrabold text-2xl text-white">
                        Titipsini<span className="font-semibold">.com</span>
                    </span>
                </a>

                <p className="mt-4 text-gray-400 text-sm">
                    Platform terpercaya untuk mengoptimalkan potensi properti
                    menjadi sumber penghasilan berkelanjutan.
                </p>
            </div>
            <div>
                <h3 className="font-semibold text-lg mb-4">Platform</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                    <FooterLink href="#">Jual Beli Properti</FooterLink>
                    <FooterLink href="#">Konsultasi Ahli</FooterLink>
                    <FooterLink href="#">Aplikasi Mobile</FooterLink>
                    <FooterLink href="#">Analisa Pasar</FooterLink>
                </ul>
            </div>
            <div>
                <h3 className="font-semibold text-lg mb-4">Perusahaan</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                    <FooterLink href="#">Tentang Kami</FooterLink>
                    <FooterLink href="#">Karir</FooterLink>
                    <FooterLink href="#">Blog</FooterLink>
                    <FooterLink href="#">Press Kit</FooterLink>
                </ul>
            </div>
            <div>
                <h3 className="font-semibold text-lg mb-4">Kontak</h3>
                <ul className="space-y-3 text-gray-400 text-sm">
                    <li className="flex items-center">
                        <FaPhone className="mr-3 text-base" /> +62 812-3456-7890
                    </li>
                    <li className="flex items-center">
                        <FaEnvelope className="mr-3 text-base" />{" "}
                        info@titipsini.com
                    </li>
                    <li className="flex items-center">
                        <FaMapMarkerAlt className="mr-3 text-base" /> Jakarta,
                        Indonesia
                    </li>
                </ul>
            </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Titipsini.com. Semua hak
            dilindungi undang-undang.
        </div>
    </footer>
);

// 🔹 MAIN APP
export default function App() {
    return (
        <div className="font-sans text-gray-800 bg-white leading-relaxed">
            <Header />
            <main>
                <Hero />
                <SectionCuan />
                <AboutPlatform />
                <Features />
                <BonusAccess />
                <Pricing />
                <Testimonials />
                <HowItWorks />
            </main>
            <Footer />
        </div>
    );
}
