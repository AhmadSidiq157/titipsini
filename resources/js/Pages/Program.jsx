import React, { useState } from "react";
import GuestLayout from "../Layouts/GuestLayout";
import { Head, usePage } from "@inertiajs/react";
import {
    Users,
    Briefcase,
    GraduationCap,
    BookOpen,
    Target,
    BrainCircuit,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Star,
    ArrowRight,
    UserCheck,
    Library,
    TrendingUp,
    HelpCircle,
} from "lucide-react";

// --- SECTIONS ---

// Hero Section
const ProgramHero = () => {
    // --- Logika WhatsApp Diperbaiki ---
    const { settings } = usePage().props;
    const phoneNumber = settings.contact_phone
        ? settings.contact_phone.replace(/\D/g, "")
        : "";
    const message = settings.whatsapp_message
        ? encodeURIComponent(settings.whatsapp_message)
        : encodeURIComponent(
              "Halo, saya tertarik dengan program yang ada di Titipsini."
          ); // Fallback
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    // --- Akhir Logika WhatsApp ---

    return (
        <section className="relative bg-gradient-to-br from-green-100 via-teal-50 to-white pt-24 pb-12 sm:pt-32 sm:pb-16 overflow-hidden">
            <div className="absolute inset-0 bg-green-50 opacity-25"></div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                    <div>
                        <span className="inline-flex items-center px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-semibold">
                            <Star className="w-4 h-4 mr-2" /> Program Unggulan
                        </span>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-800 tracking-tight mt-4">
                            Bangun{" "}
                            <span className="text-green-600">Karir Impian</span>{" "}
                            Bersama Kami
                        </h1>
                        <p className="mt-6 text-lg text-gray-600">
                            Bergabunglah dengan program pengembangan karir
                            terdepan di industri storage solution. Wujudkan
                            potensi terbaik Anda dengan bimbingan mentor
                            berpengalaman.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-4">
                            {/* --- Tombol diubah ke link WhatsApp --- */}
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors"
                            >
                                Mulai Perjalanan{" "}
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </a>
                            {/* --- Tombol diubah ke link WhatsApp --- */}
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                                Pelajari Lebih Lanjut
                            </a>
                        </div>
                    </div>
                    <div className="hidden lg:grid grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                            <Users className="w-8 h-8 text-green-500 mb-2" />
                            <p className="text-3xl font-bold text-gray-800">
                                500+
                            </p>
                            <p className="text-gray-500">Alumni Program</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                            <Briefcase className="w-8 h-8 text-green-500 mb-2" />
                            <p className="text-3xl font-bold text-gray-800">
                                3
                            </p>
                            <p className="text-gray-500">Program Tersedia</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                            <UserCheck className="w-8 h-8 text-green-500 mb-2" />
                            <p className="text-3xl font-bold text-gray-800">
                                95%
                            </p>
                            <p className="text-gray-500">Success Rate</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                            <GraduationCap className="w-8 h-8 text-green-500 mb-2" />
                            <p className="text-3xl font-bold text-gray-800">
                                24/7
                            </p>
                            <p className="text-gray-500">Mentor Support</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- Program List Section ---
const ProgramList = ({ programs }) => {
    // --- Logika WhatsApp Ditambahkan ---
    const { settings } = usePage().props;
    const phoneNumber = settings.contact_phone
        ? settings.contact_phone.replace(/\D/g, "")
        : "";
    // --- Akhir Logika WhatsApp ---

    return (
        <section className="py-16 sm:py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <span className="text-green-600 font-semibold">
                    Program Kami
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2">
                    Pilih Program Sesuai Tujuan Anda
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-gray-600">
                    Setiap program dirancang khusus untuk mengembangkan skill
                    dan karir Anda di industri storage solution.
                </p>
            </div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                {programs.map((program) => {
                    // Membuat URL WhatsApp spesifik untuk setiap program
                    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
                        `Halo, saya tertarik dengan program "${program.title}".`
                    )}`;
                    return (
                        <div
                            key={program.id}
                            className={`bg-white rounded-xl shadow-lg border ${
                                program.is_popular
                                    ? "border-green-500"
                                    : "border-gray-200"
                            } p-6 flex flex-col relative`}
                        >
                            {program.is_popular ? (
                                <span className="absolute top-0 right-6 -mt-3 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                    Populer
                                </span>
                            ) : null}

                            <div className="flex justify-between items-start mb-4">
                                <Briefcase className="w-10 h-10 text-green-500" />
                                <div>
                                    {program.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full ml-2"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 text-left">
                                {program.title}
                            </h3>
                            <p className="text-gray-600 mt-2 text-left flex-grow">
                                {program.description}
                            </p>
                            <div className="text-left mt-4">
                                <p className="font-semibold text-gray-700">
                                    Durasi: {program.duration}
                                </p>
                                <p className="font-semibold text-gray-700 mt-4">
                                    Yang Akan Anda Dapatkan:
                                </p>
                                <ul className="mt-2 space-y-2">
                                    {program.benefits.map((benefit) => (
                                        <li
                                            key={benefit}
                                            className="flex items-center text-gray-600"
                                        >
                                            <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                                            <span>{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {/* --- Tombol diubah ke link WhatsApp --- */}
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`mt-6 w-full inline-flex items-center justify-center px-6 py-3 font-semibold rounded-lg shadow-md transition-colors ${
                                    program.cta_color === "green"
                                        ? "bg-green-600 text-white hover:bg-green-700"
                                        : "bg-gray-800 text-white hover:bg-gray-900"
                                }`}
                            >
                                {program.cta_text}{" "}
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </a>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

// Why Choose Us Section
const WhyChooseProgram = () => (
    <section className="py-16 sm:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                    <span className="text-green-600 font-semibold">
                        Keunggulan Kami
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2">
                        Mengapa Memilih Program Kami?
                    </h2>
                    <p className="mt-4 text-gray-600">
                        Kami berkomitmen memberikan pengalaman pembelajaran
                        terbaik dengan pendekatan yang praktis dan relevan
                        dengan kebutuhan industri.
                    </p>
                    <div className="mt-8 space-y-6">
                        <div className="flex">
                            <Target className="w-8 h-8 text-green-600 mr-4 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-lg font-semibold">
                                    Fokus Praktis
                                </h3>
                                <p className="text-gray-600 mt-1">
                                    Program dirancang dengan fokus pada aplikasi
                                    praktis di dunia kerja nyata dengan studi
                                    kasus terkini.
                                </p>
                            </div>
                        </div>
                        <div className="flex">
                            <BookOpen className="w-8 h-8 text-green-600 mr-4 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-lg font-semibold">
                                    Kurikulum Terkini
                                </h3>
                                <p className="text-gray-600 mt-1">
                                    Materi pembelajaran selalu diperbarui
                                    mengikuti perkembangan teknologi dan tren
                                    industri terbaru.
                                </p>
                            </div>
                        </div>
                        <div className="flex">
                            <GraduationCap className="w-8 h-8 text-green-600 mr-4 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-lg font-semibold">
                                    Mentor Berpengalaman
                                </h3>
                                <p className="text-gray-600 mt-1">
                                    Dibimbing oleh mentor yang berpengalaman
                                    lebih dari 10 tahun di bidang storage dan
                                    logistics.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center mt-8 lg:mt-0">
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 w-full max-w-md text-center">
                        <div className="inline-block p-4 bg-green-100 rounded-full">
                            <GraduationCap className="w-10 h-10 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold mt-4">
                            Sertifikasi Resmi
                        </h3>
                        <p className="text-gray-500 mt-1">
                            Dapatkan sertifikat yang diakui industri.
                        </p>
                        <div className="mt-6 flex justify-around divide-x divide-gray-200">
                            <div className="px-4">
                                <p className="text-3xl font-bold text-green-600">
                                    100%
                                </p>
                                <p className="text-sm text-gray-500">
                                    Completion Rate
                                </p>
                            </div>
                            <div className="px-4">
                                <p className="text-3xl font-bold text-green-600">
                                    4.9/5
                                </p>
                                <p className="text-sm text-gray-500">
                                    Rating Alumni
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

// Curriculum Section
// --- Curriculum Section ---
const CurriculumDetails = ({ curriculums }) => {
    // Objek ini berfungsi sebagai 'peta' untuk mengubah nama ikon dari database
    // menjadi komponen ikon yang sebenarnya.
    const iconMap = {
        Library: <Library />,
        BrainCircuit: <BrainCircuit />,
        TrendingUp: <TrendingUp />,
    };

    return (
        <section className="py-16 sm:py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <span className="text-green-600 font-semibold">Kurikulum</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2">
                    Detail Materi Program
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-gray-600">
                    Kurikulum komprehensif yang dirancang untuk mempersiapkan
                    Anda menghadapi tantangan industri storage solution.
                </p>
            </div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid lg:grid-cols-3 gap-8">
                {curriculums.map((item) => {
                    const IconComponent = iconMap[item.icon_name];
                    return (
                        <div
                            key={item.id}
                            className="bg-gray-50 p-6 rounded-xl border border-gray-200"
                        >
                            <div className="flex items-center text-green-600 mb-4">
                                {IconComponent &&
                                    React.cloneElement(IconComponent, {
                                        size: 24,
                                    })}
                                <h3 className="ml-3 text-xl font-bold text-gray-800">
                                    {item.title}
                                </h3>
                            </div>
                            <ul className="space-y-3 text-left">
                                {item.points.map((point) => (
                                    <li
                                        key={point}
                                        className="flex items-start"
                                    >
                                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                                        <span className="text-gray-600">
                                            {point}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

// FAQ Section
const ProgramFAQ = () => {
    const [openIndex, setOpenIndex] = useState(0);
    const faqs = [
        {
            q: "Apa saja persyaratan untuk mengikuti program?",
            a: "Untuk Program Magang: Mahasiswa semester 6–8 dari jurusan terkait. Untuk Fresh Graduate Program: Lulusan S1 maksimal 2 tahun. Untuk Leadership Development: Karyawan dengan pengalaman minimal 3 tahun.",
        },
        {
            q: "Bagaimana proses seleksi program?",
            a: "Proses seleksi meliputi: 1) Pendaftaran online, 2) Screening CV dan dokumen, 3) Tes tertulis, 4) Interview dengan HR dan mentor, 5) Pengumuman hasil dalam 2 minggu.",
        },
        {
            q: "Apakah ada biaya untuk mengikuti program?",
            a: "Semua program kami GRATIS. Bahkan untuk Program Magang dan Fresh Graduate, peserta akan mendapat tunjangan/gaji sesuai standar perusahaan. Tidak ada biaya pendaftaran atau biaya tersembunyi lainnya.",
        },
        {
            q: "Kapan jadwal program dimulai?",
            a: "Program dimulai setiap 3 bulan (Januari, April, Juli, Oktober). Pendaftaran dibuka 2 bulan sebelum program dimulai. Untuk informasi jadwal terbaru, silakan hubungi tim HR kami.",
        },
        {
            q: "Bagaimana sistem pembelajaran dalam program?",
            a: "Pembelajaran menggunakan metode blended learning: 40% teori, 60% praktik. Peserta akan mendapat mentor personal, project real case, dan akses ke fasilitas pelatihan modern. Ada evaluasi berkala dan feedback konstruktif.",
        },
        {
            q: "Apakah ada jaminan kerja setelah program selesai?",
            a: "Untuk peserta yang menyelesaikan program dengan baik, kami memberikan prioritas untuk posisi yang tersedia di Titipsini. Selain itu, kami juga memiliki network partner perusahaan untuk penempatan kerja. Success rate alumni mendapat kerja dalam 6 bulan adalah 95%.",
        },
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-16 sm:py-24 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <span className="text-green-600 font-semibold">FAQ</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2">
                    Pertanyaan Umum Program
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-gray-600">
                    Temukan jawaban atas pertanyaan yang sering diajukan tentang
                    program pengembangan karir kami.
                </p>
            </div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12 max-w-3xl">
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-sm border border-gray-200"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex justify-between items-center text-left p-5 font-semibold text-gray-800"
                            >
                                <span>{faq.q}</span>
                                {openIndex === index ? (
                                    <ChevronUp className="w-5 h-5 text-green-600" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                )}
                            </button>
                            {openIndex === index && (
                                <div className="px-5 pb-5 text-gray-600 border-t border-gray-100 pt-4">
                                    <p>{faq.a}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- Komponen Utama Halaman Program ---
const Program = ({ programs, curriculums }) => {
    return (
        <>
            <Head title="Program Kami" />
            <ProgramHero />
            <ProgramList programs={programs} />
            <CurriculumDetails curriculums={curriculums} />
            <WhyChooseProgram />
            <ProgramFAQ />
        </>
    );
};

Program.layout = (page) => <GuestLayout children={page} />;

export default Program;
