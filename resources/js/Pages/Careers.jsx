import React from "react";
import { Link, Head, usePage } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import {
    Briefcase,
    MapPin,
    DollarSign,
    ArrowRight,
    Users,
    Star,
    TrendingUp,
    Heart,
    Coffee,
    CheckCircle,
    Award,
    FileText,
    MessageSquare,
    Search,
} from "lucide-react";

// Hero Section
const CareerHero = () => (
    <section className="relative bg-gradient-to-br from-green-100 via-teal-50 to-white pt-24 pb-12 sm:pt-32 sm:pb-16 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                    <span className="inline-flex items-center px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-semibold">
                        <Users className="w-4 h-4 mr-2" /> Join Our Team
                    </span>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-800 tracking-tight mt-4">
                        Bangun{" "}
                        <span className="text-green-600">Masa Depan</span>{" "}
                        Bersama Kami
                    </h1>
                    <p className="mt-6 text-lg text-gray-600">
                        Bergabunglah dengan tim yang passionate dalam memberikan
                        solusi storage terbaik. Kembangkan karir Anda dalam
                        lingkungan kerja yang dinamis, inovatif, dan supportive.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-4">
                        {/* --- Tombol ini tetap mengarah ke section di halaman --- */}
                        <a
                            href="#job-listings"
                            className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors"
                        >
                            Lihat Lowongan
                        </a>
                        {/* --- Tombol ini tetap mengarah ke section di halaman --- */}
                        <a
                            href="#work-culture"
                            className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            Tentang Budaya Kerja
                        </a>
                    </div>
                </div>
                <div className="hidden lg:grid grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center">
                        <p className="text-3xl font-bold text-gray-800">150+</p>
                        <p className="text-gray-500">Tim Profesional</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center">
                        <p className="text-3xl font-bold text-gray-800">
                            4.8/5
                        </p>
                        <p className="text-gray-500">Employee Rating</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center">
                        <p className="text-3xl font-bold text-gray-800">5</p>
                        <p className="text-gray-500">Tahun Berpengalaman</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center">
                        <p className="text-3xl font-bold text-gray-800">95%</p>
                        <p className="text-gray-500">Retention Rate</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

// Job Listings Section (Dinamis)
const JobListings = ({ jobs }) => {
    // --- Logika WhatsApp Ditambahkan ---
    const { settings } = usePage().props;
    const phoneNumber = settings.contact_phone
        ? settings.contact_phone.replace(/\D/g, "")
        : "";
    // Pesan default untuk melamar kerja bisa ditambahkan di settings backend Anda
    const defaultJobMessage =
        "Halo, saya tertarik untuk melamar pekerjaan di Titipsini.";
    const message = settings.whatsapp_job_message
        ? encodeURIComponent(settings.whatsapp_job_message)
        : encodeURIComponent(defaultJobMessage);
    // --- Akhir Logika WhatsApp ---

    const getDepartmentStyle = (department) => {
        switch (department.toLowerCase()) {
            case "operations":
            case "warehouse":
                return { iconColor: "text-red-500", bgColor: "bg-red-100" };
            case "customer service":
            case "marketing":
            case "web developer":
            case "fullstack developer":
                return { iconColor: "text-green-500", bgColor: "bg-green-100" };
            default:
                return { iconColor: "text-gray-500", bgColor: "bg-gray-100" };
        }
    };

    return (
        <section id="job-listings" className="py-16 sm:py-24 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
                    Temukan Posisi yang Tepat untuk Anda
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-gray-600">
                    Kami mencari talenta terbaik untuk bergabung dalam misi
                    memberikan solusi storage terdepan di Indonesia.
                </p>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                {jobs && jobs.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-8">
                        {jobs.map((job) => {
                            const style = getDepartmentStyle(job.department);
                            // URL WhatsApp spesifik untuk setiap pekerjaan
                            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
                                `Halo, saya tertarik untuk melamar posisi ${job.title}.`
                            )}`;
                            return (
                                <div
                                    key={job.id}
                                    className="bg-white rounded-lg shadow-lg border border-gray-100 p-8 flex flex-col relative transition-shadow duration-300 hover:shadow-2xl"
                                >
                                    {job.is_urgent && (
                                        <span className="absolute top-0 -mt-3 right-6 bg-red-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
                                            Urgent Hiring
                                        </span>
                                    )}

                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <div className="flex items-center space-x-3 text-sm">
                                                    <span className="font-semibold text-gray-500">
                                                        {job.department}
                                                    </span>
                                                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                                                        Junior
                                                    </span>
                                                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                                                        {job.type}
                                                    </span>
                                                </div>
                                                <h3 className="text-2xl font-bold text-gray-900 mt-3">
                                                    {job.title}
                                                </h3>
                                                <p className="text-gray-500 mt-1">
                                                    {job.description.substring(
                                                        0,
                                                        100
                                                    )}
                                                    ...
                                                </p>
                                            </div>
                                            <div
                                                className={`p-4 rounded-md ${style.bgColor}`}
                                            >
                                                <Briefcase
                                                    className={`w-7 h-7 ${style.iconColor}`}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-6 text-gray-600 my-6 border-y py-4">
                                            <div className="flex items-center">
                                                <MapPin className="w-5 h-5 mr-2" />{" "}
                                                {job.location}
                                            </div>
                                            <div className="flex items-center">
                                                <DollarSign className="w-5 h-5 mr-2" />{" "}
                                                {job.salary_range}
                                            </div>
                                        </div>

                                        <div className="text-left">
                                            <h4 className="font-semibold text-gray-800 mb-3">
                                                Requirements:
                                            </h4>
                                            <ul className="space-y-2">
                                                {Array.isArray(
                                                    job.requirements
                                                ) &&
                                                    job.requirements.map(
                                                        (req, index) => (
                                                            <li
                                                                key={index}
                                                                className="flex items-start text-gray-600"
                                                            >
                                                                <span className="text-green-500 mr-3 mt-1 flex-shrink-0">
                                                                    •
                                                                </span>
                                                                <span>
                                                                    {req}
                                                                </span>
                                                            </li>
                                                        )
                                                    )}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* --- Tombol diubah menjadi <a> tag ke WhatsApp --- */}
                                    <a
                                        href={whatsappUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`mt-8 w-full inline-flex items-center justify-center px-6 py-3.5 font-semibold text-white rounded-lg shadow-md transition-colors ${
                                            job.is_urgent
                                                ? "bg-red-600 hover:bg-red-700"
                                                : "bg-green-600 hover:bg-green-700"
                                        }`}
                                    >
                                        Apply Sekarang
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </a>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-lg shadow-md border border-gray-100">
                        <Search className="w-16 h-16 text-gray-400 mx-auto" />
                        <h3 className="mt-4 text-xl font-semibold text-gray-800">
                            Belum Ada Lowongan
                        </h3>
                        <p className="mt-2 text-gray-600">
                            Saat ini belum ada posisi yang tersedia. Silakan cek
                            kembali nanti.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

// ... (Sisa komponen lainnya tetap sama)
// WhyJoinUs, WorkCulture, TeamSuccess, InterviewGuide tidak diubah.

const WhyJoinUs = () => {
    const benefits = [
        {
            icon: <DollarSign />,
            title: "Gaji Kompetitif",
            description:
                "Paket gaji yang menarik sesuai dengan pengalaman dan kontribusi.",
        },
        {
            icon: <Heart />,
            title: "Health Insurance",
            description: "Asuransi kesehatan untuk karyawan dan keluarga.",
        },
        {
            icon: <TrendingUp />,
            title: "Career Development",
            description:
                "Program pengembangan karir dan pelatihan berkelanjutan.",
        },
        {
            icon: <Coffee />,
            title: "Work-life Balance",
            description:
                "Flexible working hours dan lingkungan kerja yang supportive.",
        },
    ];
    return (
        <section className="py-16 sm:py-24 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <span className="text-green-600 font-semibold">
                    Employee Benefits
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2">
                    Mengapa Bergabung dengan Kami?
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-gray-600">
                    Kami percaya bahwa karyawan yang bahagia adalah kunci
                    kesuksesan perusahaan. Nikmati berbagai benefit eksklusif
                    untuk tim kami.
                </p>
            </div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {benefits.map((benefit, index) => (
                    <div
                        key={index}
                        className="bg-white p-8 rounded-xl shadow-md border border-gray-100 text-center"
                    >
                        <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
                            <div className="w-8 h-8 text-green-600">
                                {benefit.icon}
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">
                            {benefit.title}
                        </h3>
                        <p className="mt-2 text-gray-600">
                            {benefit.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

const WorkCulture = () => (
    <section id="work-culture" className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                    <span className="text-green-600 font-semibold">
                        Budaya Kerja
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2">
                        Lingkungan Kerja yang Menginspirasi
                    </h2>
                    <div className="mt-8 space-y-6">
                        <div className="flex items-start">
                            <div className="p-3 bg-green-100 rounded-lg mr-4">
                                <Users className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">
                                    Kolaboratif
                                </h3>
                                <p className="text-gray-600 mt-1">
                                    Bekerja sama dalam tim yang solid dan saling
                                    mendukung untuk mencapai tujuan bersama
                                    dengan semangat kekeluargaan.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="p-3 bg-green-100 rounded-lg mr-4">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">
                                    Growth Mindset
                                </h3>
                                <p className="text-gray-600 mt-1">
                                    Selalu belajar dan berkembang untuk mencapai
                                    yang terbaik dengan dukungan program
                                    pelatihan berkelanjutan.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="p-3 bg-green-100 rounded-lg mr-4">
                                <Heart className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">
                                    Customer First
                                </h3>
                                <p className="text-gray-600 mt-1">
                                    Mengutamakan kepuasan dan kepercayaan
                                    customer dalam setiap keputusan dan tindakan
                                    yang kita ambil.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <p className="text-gray-600 italic">
                        "Titipsini bukan hanya tempat kerja, tapi rumah kedua.
                        Tim yang supportive, management yang peduli, dan
                        kesempatan berkembang yang luar biasa. Saya bangga
                        menjadi bagian dari keluarga besar Titipsini."
                    </p>
                    <div className="mt-6">
                        <p className="font-bold text-gray-800">Sari Indah</p>
                        <p className="text-gray-500">
                            Senior Operations Manager
                        </p>
                        <div className="flex justify-center mt-2">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className="w-5 h-5 text-yellow-400 fill-current"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const TeamSuccess = () => {
    const stories = [
        {
            name: "Celine Margaret",
            role: "Operations Manager",
            image: "/images/team/celine.jpg",
            quote: "Bergabung sebagai staff biasa, sekarang memimpin tim operations. Titipsini memberikan kesempatan berkembang yang luar biasa.",
            details: {
                type: "journey",
                title: "Career Journey:",
                items: [
                    { year: "2019 - Warehouse Staff", level: "Entry Level" },
                    { year: "2021 - Team Leader", level: "Promotion" },
                    { year: "2023 - Operations Manager", level: "Current" },
                ],
            },
            finalQuote:
                "Perusahaan yang benar-benar peduli dengan pengembangan karyawan.",
        },
        {
            name: "Sari Indah",
            role: "Customer Service Lead",
            image: "/images/team/sari.jpg",
            quote: "Work-life balance yang luar biasa. Bisa mengurus keluarga sambil berkarir dengan optimal di sini.",
            details: {
                type: "achievements",
                title: "Achievements:",
                items: [
                    {
                        icon: (
                            <Award className="w-5 h-5 text-yellow-500 mr-2" />
                        ),
                        text: "Employee of the Year 2023",
                    },
                    {
                        icon: <Star className="w-5 h-5 text-yellow-500 mr-2" />,
                        text: "Customer Satisfaction Score 98%",
                    },
                    {
                        icon: (
                            <TrendingUp className="w-5 h-5 text-yellow-500 mr-2" />
                        ),
                        text: "Team Leadership Excellence",
                    },
                ],
            },
            finalQuote: "Fleksibilitas kerja yang sangat mendukung keluarga.",
        },
        {
            name: "Reza Firmansyah",
            role: "Marketing Specialist",
            image: "/images/team/reza.jpg",
            quote: "Fresh graduate yang langsung dapat kesempatan handle project besar. Learning curve yang cepat dengan mentor terbaik.",
            details: {
                type: "projects",
                title: "Key Projects:",
                items: [
                    "Digital Campaign Q4 2023",
                    "Brand Awareness Initiative",
                    "Social Media Strategy",
                ],
            },
            finalQuote: "Tempat terbaik untuk fresh graduate berkembang.",
        },
    ];

    return (
        <section className="py-16 sm:py-24 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <span className="text-green-600 font-semibold">
                    Employee Spotlight
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2">
                    Kisah Sukses Tim Kami
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-gray-600">
                    Dengarkan cerita inspiratif dari karyawan kami tentang
                    perjalanan karir dan pengalaman bekerja di Titipsini.
                </p>
            </div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid lg:grid-cols-3 gap-8">
                {stories.map((story) => (
                    <div
                        key={story.name}
                        className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 flex flex-col"
                    >
                        <div className="flex-grow">
                            <img
                                src={story.image}
                                alt={story.name}
                                className="w-24 h-24 rounded-full mx-auto"
                            />
                            <h3 className="text-xl font-bold mt-4">
                                {story.name}
                            </h3>
                            <span className="inline-block bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full mt-2">
                                {story.role}
                            </span>
                            <p className="text-gray-600 italic mt-4">
                                "{story.quote}"
                            </p>
                            <div className="text-left mt-6">
                                <h4 className="font-semibold text-gray-800">
                                    {story.details.title}
                                </h4>
                                <ul className="mt-2 space-y-2 text-gray-600">
                                    {story.details.type === "journey" &&
                                        story.details.items.map((item) => (
                                            <li
                                                key={item.year}
                                                className="flex justify-between items-center text-sm"
                                            >
                                                <span>{item.year}</span>{" "}
                                                <span className="font-semibold text-gray-500">
                                                    {item.level}
                                                </span>
                                            </li>
                                        ))}
                                    {story.details.type === "achievements" &&
                                        story.details.items.map((item) => (
                                            <li
                                                key={item.text}
                                                className="flex items-center"
                                            >
                                                {item.icon}
                                                <span>{item.text}</span>
                                            </li>
                                        ))}
                                    {story.details.type === "projects" &&
                                        story.details.items.map((item) => (
                                            <li
                                                key={item}
                                                className="flex items-center"
                                            >
                                                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <p className="text-gray-500 flex items-center justify-center">
                                <Star className="w-5 h-5 text-yellow-400 mr-2" />{" "}
                                "{story.finalQuote}"
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

// Interview Guide Section (Sudah Dimodifikasi)
const InterviewGuide = () => {
    return (
        <section className="py-16 sm:py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <span className="text-green-600 font-semibold">
                    Interview Tips
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2">
                    Panduan Sukses Interview
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-gray-600">
                    Tips dan strategi untuk mempersiapkan diri menghadapi proses
                    interview di Titipsini.
                </p>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12 lg:flex gap-8">
                {/* Kolom Pertama */}
                <div className="w-full lg:w-1/2 flex flex-col space-y-8 mb-8 lg:mb-0">
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 flex flex-col flex-grow">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center">
                            <Users className="w-6 h-6 mr-3 text-green-600" />
                            Persiapan Sebelum Interview
                        </h3>
                        <ol className="mt-4 space-y-4 text-left">
                            <li className="flex">
                                <span className="flex-shrink-0 bg-green-500 text-white rounded-full w-6 h-6 text-sm font-bold flex items-center justify-center mr-3">
                                    1
                                </span>
                                <span>
                                    <span className="font-semibold">
                                        Riset Perusahaan
                                    </span>
                                    <br />
                                    Pelajari visi, misi, dan layanan Titipsini.
                                </span>
                            </li>
                            <li className="flex">
                                <span className="flex-shrink-0 bg-green-500 text-white rounded-full w-6 h-6 text-sm font-bold flex items-center justify-center mr-3">
                                    2
                                </span>
                                <span>
                                    <span className="font-semibold">
                                        Siapkan Dokumen
                                    </span>
                                    <br />
                                    CV terbaru, portofolio, dan dokumen
                                    pendukung lainnya.
                                </span>
                            </li>
                            <li className="flex">
                                <span className="flex-shrink-0 bg-green-500 text-white rounded-full w-6 h-6 text-sm font-bold flex items-center justify-center mr-3">
                                    3
                                </span>
                                <span>
                                    <span className="font-semibold">
                                        Latihan Presentasi Diri
                                    </span>
                                    <br />
                                    Siapkan elevator pitch 2-3 menit tentang
                                    diri Anda.
                                </span>
                            </li>
                        </ol>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 flex flex-col flex-grow">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center">
                            <MessageSquare className="w-6 h-6 mr-3 text-green-600" />
                            Saat Interview Berlangsung
                        </h3>
                        <ol className="mt-4 space-y-4 text-left">
                            <li className="flex">
                                <span className="flex-shrink-0 bg-green-500 text-white rounded-full w-6 h-6 text-sm font-bold flex items-center justify-center mr-3">
                                    1
                                </span>
                                <span>
                                    <span className="font-semibold">
                                        Komunikasi Efektif
                                    </span>
                                    <br />
                                    Bicara dengan jelas, dengarkan pertanyaan,
                                    dan berikan jawaban yang relevan.
                                </span>
                            </li>
                            <li className="flex">
                                <span className="flex-shrink-0 bg-green-500 text-white rounded-full w-6 h-6 text-sm font-bold flex items-center justify-center mr-3">
                                    2
                                </span>
                                <span>
                                    <span className="font-semibold">
                                        Tunjukkan Antusiasme
                                    </span>
                                    <br />
                                    Ekspresikan minat tulus terhadap posisi dan
                                    perusahaan.
                                </span>
                            </li>
                            <li className="flex">
                                <span className="flex-shrink-0 bg-green-500 text-white rounded-full w-6 h-6 text-sm font-bold flex items-center justify-center mr-3">
                                    3
                                </span>
                                <span>
                                    <span className="font-semibold">
                                        Berikan Contoh Nyata
                                    </span>
                                    <br />
                                    Gunakan metode STAR (Situation, Task,
                                    Action, Result).
                                </span>
                            </li>
                        </ol>
                    </div>
                </div>

                {/* Kolom Kedua */}
                <div className="w-full lg:w-1/2 flex flex-col space-y-8">
                    <div className="bg-green-50 p-8 rounded-xl border border-green-200 flex flex-col flex-grow">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center">
                            <Star className="w-6 h-6 mr-3 text-green-600" />
                            Pertanyaan yang Sering Diajukan
                        </h3>
                        <div className="mt-4 space-y-3 text-left">
                            <div className="bg-white p-4 rounded-lg">
                                "Ceritakan tentang diri Anda"
                            </div>
                            <div className="bg-white p-4 rounded-lg">
                                "Mengapa tertarik dengan Titipsini?"
                            </div>
                            <div className="bg-white p-4 rounded-lg">
                                "Bagaimana menangani situasi sulit?"
                            </div>
                            <div className="bg-white p-4 rounded-lg">
                                "Apa ekspektasi karir Anda?"
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-50 p-8 rounded-xl border border-green-200 flex flex-col flex-grow">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center">
                            <Heart className="w-6 h-6 mr-3 text-green-600" />
                            Tips Tambahan
                        </h3>
                        <ul className="mt-4 space-y-2 text-left">
                            <li className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />{" "}
                                Datang 10-15 menit lebih awal
                            </li>
                            <li className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />{" "}
                                Berpakaian profesional dan rapi
                            </li>
                            <li className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />{" "}
                                Bawa catatan kecil untuk pertanyaan
                            </li>
                            <li className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />{" "}
                                Follow up dengan thank you email
                            </li>
                            <li className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />{" "}
                                Tunjukkan kepribadian yang authentic
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- Komponen Utama Halaman Karir ---
const Careers = ({ jobVacancies }) => {
    return (
        <>
            <Head title="Karir di Titipsini" />
            <CareerHero />
            <JobListings jobs={jobVacancies} />
            <WhyJoinUs />
            <WorkCulture />
            <TeamSuccess />
            <InterviewGuide />
        </>
    );
};

// Gunakan pola layout yang sama dengan halaman lain
Careers.layout = (page) => <GuestLayout children={page} />;

export default Careers;
