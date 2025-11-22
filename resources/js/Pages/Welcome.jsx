import React, { useState, useEffect } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import {
    ShieldCheck,
    Clock,
    MapPin,
    Users,
    Star,
    ChevronDown,
    CheckCircle,
    ArrowRight,
    Car,
    Quote,
    ChevronLeft,
    ChevronRight,
    FileText, // Icon baru untuk Syarat & Ketentuan
    AlertCircle, // Icon baru untuk perhatian
} from "lucide-react";

// --- HERO SECTION ---
const Hero = () => {
    const { settings } = usePage().props;

    const phoneNumber = settings?.contact_phone
        ? settings.contact_phone.replace(/\D/g, "")
        : "628123456789";
    const message = "Halo, saya ingin bertanya tentang layanan Titipsini.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        message
    )}`;

    return (
        <section className="relative bg-gradient-to-b from-emerald-50 via-white to-white py-24 lg:py-32 overflow-hidden">
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-100/50 rounded-full blur-[100px] pointer-events-none -translate-x-1/4 -translate-y-1/4"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal-50/60 rounded-full blur-[80px] pointer-events-none translate-x-1/4 translate-y-1/4"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white border border-emerald-200 shadow-sm mb-8 hover:shadow-md transition-all cursor-default">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            <span className="text-xs font-bold text-emerald-600 tracking-[0.15em] uppercase">
                                Solusi Terpercaya No. 1
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight mb-6">
                            Titip Barang <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
                                Tanpa Rasa Cemas
                            </span>
                        </h1>

                        <p className="text-lg text-gray-500 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                            Titipsini.com menyediakan layanan penyimpanan barang
                            dan kendaraan dengan keamanan 24/7. Nikmati
                            kebebasan beraktivitas sambil kami menjaga aset
                            berharga Anda.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link
                                href={route("penitipan.index")}
                                className="inline-flex items-center justify-center bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 hover:shadow-emerald-600/40 transition-all transform hover:-translate-y-1"
                            >
                                Lihat Layanan
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center bg-white text-gray-700 px-8 py-4 rounded-2xl font-bold text-lg border border-emerald-100 hover:bg-emerald-50 hover:border-emerald-200 transition-all shadow-sm"
                            >
                                Hubungi Kami
                            </a>
                        </div>
                    </div>

                    <div className="relative hidden lg:block">
                        <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-700 group">
                            <img
                                src="/images/hero-home.jpg"
                                alt="Fasilitas Titipsini"
                                className="w-full h-auto object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src =
                                        "https://placehold.co/600x400/ecfdf5/10b981?text=Gudang+Modern";
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- STATS SECTION ---
const Stats = () => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
    const stats = [
        { value: 5, suffix: "+", label: "Tahun Pengalaman" },
        { value: 2000, suffix: "+", label: "Pelanggan Puas" },
        { value: 10000, suffix: "+", label: "Item Tersimpan" },
        { value: 99.9, decimals: 1, suffix: "%", label: "Tingkat Keamanan" },
    ];
    return (
        <section
            ref={ref}
            className="bg-white py-16 border-b border-emerald-50"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
                    {stats.map((stat, index) => (
                        <div key={index} className="p-4 group">
                            <p className="text-4xl lg:text-5xl font-extrabold text-emerald-500 mb-2 group-hover:scale-110 transition-transform duration-300">
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
                            <p className="text-gray-400 font-bold uppercase tracking-wider text-xs">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- WHY US ---
const WhyUs = () => {
    const features = [
        {
            icon: <ShieldCheck size={30} />,
            title: "Sistem Keamanan Berlapis",
            description:
                "Dilengkapi CCTV 24 jam, alarm, petugas keamanan, dan kontrol akses biometrik.",
        },
        {
            icon: <Clock size={30} />,
            title: "Durasi Fleksibel",
            description:
                "Tidak ada kontrak kaku. Titip harian, mingguan, atau bulanan sesuai kebutuhan.",
        },
        {
            icon: <MapPin size={30} />,
            title: "Lokasi Strategis",
            description:
                "Gudang kami terletak di pusat kota yang mudah diakses dari berbagai penjuru.",
        },
        {
            icon: <Car size={30} />,
            title: "Layanan Antar Jemput",
            description:
                "Tim logistik kami siap menjemput barang Anda langsung di depan pintu.",
        },
        {
            icon: <Users size={30} />,
            title: "Support Ramah",
            description:
                "Tim support kami siap membantu Anda via WhatsApp atau telepon setiap hari kerja.",
        },
        {
            icon: <Star size={30} />,
            title: "Bergaransi",
            description:
                "Kami memberikan jaminan perlindungan terhadap kerusakan atau kehilangan barang.",
        },
    ];
    const FeatureCard = ({ icon, title, description }) => (
        <div className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-emerald-100/40 transition-all duration-500 border border-emerald-50 group hover:-translate-y-2">
            <div className="flex items-center justify-center bg-emerald-50 text-emerald-500 rounded-2xl w-16 h-16 mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-500 shadow-sm">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                {title}
            </h3>
            <p className="text-gray-500 leading-relaxed text-sm">
                {description}
            </p>
        </div>
    );
    return (
        <section className="py-24 bg-emerald-50/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <span className="text-emerald-500 font-bold tracking-widest uppercase text-xs">
                        Kenapa Kami?
                    </span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-3 mb-4">
                        Standar Baru dalam Penitipan
                    </h2>
                    <p className="text-gray-500 text-lg">
                        Kombinasi teknologi modern dan pelayanan personal yang
                        hangat.
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

//  SYARAT & KETENTUAN SECTION
const TermsSection = () => {
    const terms = [
        {
            text: "Bersedia menunjukan data diri KTP (Kartu Tanda Penduduk) yang masih berlaku sebagai verifikasi identitas.",
        },
        {
            text: "Barang yang dititipkan harus legal secara hukum dan tidak melanggar peraturan pemerintah Indonesia.",
        },
        {
            text: "Barang harus berada dalam kondisi layak simpan dan tidak membahayakan petugas maupun barang lain.",
        },
        {
            text: "Segala kerusakan/kehilangan saat dititipkan merupakan tanggung jawab Titipsini, dengan wajib menyertakan bukti CCTV dalam waktu 1 x 24 jam setelah barang diterima kembali.",
        },
    ];

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto bg-emerald-50 rounded-[2.5rem] p-8 md:p-12 border border-emerald-100 relative overflow-hidden">
                    <FileText className="absolute -top-6 -right-6 w-48 h-48 text-emerald-100/50 rotate-12" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-white rounded-xl shadow-sm text-emerald-600">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                Syarat & Ketentuan Layanan
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {terms.map((term, index) => (
                                <div
                                    key={index}
                                    className="flex gap-4 p-4 bg-white rounded-xl border border-emerald-100/50 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm mt-0.5">
                                        {index + 1}
                                    </div>
                                    <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                                        {term.text}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <p className="mt-8 text-xs text-gray-400 italic text-center">
                            *Dengan menggunakan layanan kami, Anda dianggap
                            telah menyetujui syarat dan ketentuan di atas.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- TESTIMONIALS ---
const Testimonials = () => {
    const testimonials = [
        {
            quote: "Sangat membantu saat pindah kost! Barang aman, bersih, dan utuh.",
            name: "Andi Pratama",
            title: "Mahasiswa",
            image: "https://i.pravatar.cc/150?u=andi",
        },
        {
            quote: "Titip motor selama mudik lebaran. Proses cepat, motor dipanaskan rutin.",
            name: "Budi Santoso",
            title: "Karyawan",
            image: "https://i.pravatar.cc/150?u=budi",
        },
        {
            quote: "Traveler wajib tahu ini. Bisa titip koper besar jadi jalan-jalan ringan.",
            name: "Citra Lestari",
            title: "Travel Blogger",
            image: "https://i.pravatar.cc/150?u=citra",
        },
    ];
    const [curr, setCurr] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setCurr((prev) =>
                prev === testimonials.length - 1 ? 0 : prev + 1
            );
        }, 6000);
        return () => clearInterval(interval);
    }, [testimonials.length]);
    const prev = () => setCurr(curr === 0 ? testimonials.length - 1 : curr - 1);
    const next = () => setCurr(curr === testimonials.length - 1 ? 0 : curr + 1);

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
            <div className="container mx-auto px-4 text-center relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-16 text-gray-900">
                    Apa Kata Mereka?
                </h2>
                <div className="max-w-4xl mx-auto">
                    <div className="relative bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-14 shadow-2xl border border-emerald-100">
                        <Quote className="absolute top-8 left-8 w-12 h-12 text-emerald-200 fill-emerald-50" />
                        <div className="relative z-10">
                            <p className="text-xl md:text-2xl italic font-medium mb-8 text-gray-700 leading-relaxed">
                                "{testimonials[curr].quote}"
                            </p>
                            <div className="flex items-center justify-center gap-4">
                                <img
                                    src={testimonials[curr].image}
                                    alt={testimonials[curr].name}
                                    className="w-14 h-14 rounded-full border-2 border-emerald-100 shadow-sm"
                                />
                                <div className="text-left">
                                    <p className="font-bold text-gray-900 text-lg">
                                        {testimonials[curr].name}
                                    </p>
                                    <p className="text-emerald-500 text-sm font-medium">
                                        {testimonials[curr].title}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={prev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white shadow-lg text-gray-400 hover:text-emerald-500 hover:scale-110 transition-all hidden md:block"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={next}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white shadow-lg text-gray-400 hover:text-emerald-500 hover:scale-110 transition-all hidden md:block"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                        <div className="flex justify-center gap-2 mt-8">
                            {testimonials.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurr(idx)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                        curr === idx
                                            ? "w-8 bg-emerald-500"
                                            : "w-2 bg-gray-300 hover:bg-emerald-300"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- FAQ SECTION ---
const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(0);
    const faqs = [
        {
            q: "Apa saja syarat untuk menitipkan barang?",
            a: "Cukup KTP/SIM asli. Untuk kendaraan, perlu STNK asli.",
        },
        {
            q: "Bagaimana perhitungan biayanya?",
            a: "Sesuai ukuran barang dan durasi (harian/mingguan/bulanan).",
        },
        {
            q: "Apakah barang saya diasuransikan?",
            a: "Ya, perlindungan dasar terhadap kerusakan fisik, kebakaran, dan pencurian.",
        },
    ];

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-12">
                    <span className="text-emerald-500 font-bold tracking-widest uppercase text-xs">
                        FAQ
                    </span>
                    <h2 className="text-3xl font-bold text-gray-900 mt-2">
                        Pertanyaan Umum
                    </h2>
                </div>
                <div className="space-y-4">
                    {faqs.map((item, idx) => (
                        <div
                            key={idx}
                            className={`bg-white rounded-2xl border transition-all duration-300 ${
                                openIndex === idx
                                    ? "border-emerald-200 shadow-lg shadow-emerald-100/50"
                                    : "border-gray-100 hover:border-emerald-100"
                            }`}
                        >
                            <button
                                onClick={() =>
                                    setOpenIndex(openIndex === idx ? -1 : idx)
                                }
                                className="flex justify-between items-center w-full p-6 text-left"
                            >
                                <span
                                    className={`font-bold text-lg ${
                                        openIndex === idx
                                            ? "text-emerald-600"
                                            : "text-gray-700"
                                    }`}
                                >
                                    {item.q}
                                </span>
                                <ChevronDown
                                    className={`w-5 h-5 text-emerald-500 transition-transform duration-300 ${
                                        openIndex === idx ? "rotate-180" : ""
                                    }`}
                                />
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                    openIndex === idx
                                        ? "max-h-40 opacity-100 p-6 pt-0"
                                        : "max-h-0 opacity-0 p-0"
                                }`}
                            >
                                <p className="text-gray-600">{item.a}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- MAIN COMPONENT ---
const Welcome = () => {
    return (
        <GuestLayout>
            <Head title="Selamat Datang" />
            <div className="font-sans bg-white selection:bg-emerald-100 selection:text-emerald-800">
                <Hero />
                <Stats />
                <WhyUs />
                <TermsSection />
                <Testimonials />
                <FAQ />

                {/* Footer CTA */}
                <div className="container mx-auto px-4 pb-16">
                    <div className="bg-gradient-to-r from-emerald-400 to-teal-300 rounded-[2.5rem] p-12 text-center text-white shadow-2xl shadow-emerald-500/20 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                Siap Menitipkan Barang?
                            </h2>
                            <p className="text-emerald-50 text-lg mb-8 max-w-2xl mx-auto">
                                Jangan biarkan barang bawaan menghambat
                                aktivitas Anda. Titip sekarang juga!
                            </p>
                            <Link
                                href={route("penitipan.index")}
                                className="inline-block bg-white text-emerald-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-emerald-50 hover:scale-105 transition-transform shadow-lg"
                            >
                                Mulai Sekarang
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
};

export default Welcome;
