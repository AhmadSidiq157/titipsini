import React from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, usePage } from "@inertiajs/react"; // <-- DITAMBAHKAN usePage
import {
    Briefcase,
    Building,
    CheckCircle2,
    Clock,
    Laptop,
    MapPin,
    Megaphone,
    Target,
    Users,
    UserCheck,
    CalendarDays,
    Download,
    PlayCircle,
    Star,
    GraduationCap,
} from "lucide-react";

// --- Hero Section ---
const InternshipHero = () => {
    // --- Logika WhatsApp Ditambahkan ---
    const { settings } = usePage().props;
    const phoneNumber = settings.contact_phone
        ? settings.contact_phone.replace(/\D/g, "")
        : "";
    const defaultInternshipMessage =
        "Halo, saya tertarik untuk mendaftar program magang di Titipsini.";
    const message = settings.whatsapp_internship_message
        ? encodeURIComponent(settings.whatsapp_internship_message)
        : encodeURIComponent(defaultInternshipMessage);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    // --- Akhir Logika WhatsApp ---

    return (
        <section className="relative pt-28 pb-16 text-center bg-[#f0fdf4]">
            <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-green-200 via-transparent to-transparent opacity-30 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-1/2 h-full bg-gradient-to-tl from-cyan-200 via-transparent to-transparent opacity-20 blur-3xl"></div>

            <div className="container mx-auto px-4 relative z-10">
                <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-green-800 bg-white border border-gray-200 rounded-full shadow-md">
                    Internship Program 2025/2026
                </span>
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 tracking-tight">
                    Mulai Karirmu Di Sini
                </h1>
                <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-700">
                    Dapatkan pengalaman kerja nyata di industri storage solution
                    terdepan. Bergabunglah dengan tim yang passionate dan
                    kembangkan skill profesional Anda.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    {/* --- Tombol diubah ke link WhatsApp --- */}
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center bg-green-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
                    >
                        <PlayCircle className="w-5 h-5 mr-2" /> Apply Sekarang
                    </a>
                </div>
                <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    <div className="bg-white/60 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/50">
                        <p className="text-4xl font-bold text-green-600">50+</p>
                        <p className="text-gray-600 mt-1">Alumni Magang</p>
                    </div>
                    <div className="bg-white/60 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/50">
                        <p className="text-4xl font-bold text-green-600">7</p>
                        <p className="text-gray-600 mt-1">Posisi Tersedia</p>
                    </div>
                    <div className="bg-white/60 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/50">
                        <p className="text-4xl font-bold text-green-600">90%</p>
                        <p className="text-gray-600 mt-1">Hired Rate</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- Job Openings Section ---
const JobOpenings = ({ positions }) => {
    return (
        <section id="job-openings" className="py-16 sm:py-24 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <span className="inline-block px-3 py-1 mb-2 text-sm font-semibold text-green-800 bg-green-100 rounded-full">
                        Posisi Terbuka
                    </span>
                    <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
                        Temukan Posisi Impian Anda
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-gray-600">
                        Pilih posisi magang yang sesuai dengan passion dan
                        jurusan Anda. Setiap posisi dirancang untuk memberikan
                        pengalaman maksimal.
                    </p>
                </div>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {positions.map((job, index) => (
                        <div
                            key={job.id}
                            className="bg-white rounded-xl shadow-lg border border-gray-200/80 p-6 flex flex-col hover:border-green-300 hover:shadow-2xl transition-all duration-300"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="bg-gray-100 text-gray-600 p-3 rounded-lg">
                                        <Briefcase size={24} />
                                    </div>
                                    <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                        {job.category}
                                    </span>
                                </div>
                                <span className="text-xs font-semibold text-green-800 bg-green-100 px-2.5 py-1 rounded-full">
                                    {job.type}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mt-4">
                                {job.title}
                            </h3>
                            <p className="text-gray-600 mt-2 text-sm flex-grow">
                                {job.description}
                            </p>
                            <div className="my-4 border-t border-gray-100"></div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <MapPin
                                        size={16}
                                        className="text-gray-400"
                                    />
                                    {job.location}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock
                                        size={16}
                                        className="text-gray-400"
                                    />
                                    {job.duration}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users
                                        size={16}
                                        className="text-gray-400"
                                    />
                                    {job.slots} posisi
                                </div>
                                <div className="flex items-center gap-2">
                                    <CalendarDays
                                        size={16}
                                        className="text-gray-400"
                                    />
                                    {new Date(job.deadline).toLocaleDateString(
                                        "id-ID",
                                        {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        }
                                    )}
                                </div>
                            </div>
                            <div className="mt-6">
                                <h4 className="font-semibold text-gray-800">
                                    Requirements:
                                </h4>
                                <ul className="mt-2 space-y-2">
                                    {job.requirements.map((req, i) => (
                                        <li
                                            key={i}
                                            className="flex items-center gap-2 text-sm text-gray-700"
                                        >
                                            <CheckCircle2
                                                size={16}
                                                className="text-green-500 flex-shrink-0"
                                            />
                                            {req}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- Benefits Section ---
const InternshipBenefits = () => (
    <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-12 items-center">
                <div className="lg:col-span-2">
                    <span className="inline-block px-3 py-1 mb-2 text-sm font-semibold text-green-800 bg-green-100 rounded-full">
                        Benefit Magang
                    </span>
                    <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
                        Lebih dari Sekedar Pengalaman Kerja
                    </h2>
                    <p className="mt-4 text-gray-600">
                        Kami berkomitmen memberikan pengalaman magang yang
                        komprehensif dengan berbagai benefit menarik untuk
                        mendukung pengembangan karir Anda.
                    </p>
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            "Uang saku kompetitif",
                            "Sertifikat magang resmi",
                            "Mentoring dari senior",
                            "Networking opportunities",
                            "Flexible working hours",
                            "Learning & development",
                        ].map((benefit, i) => (
                            <div
                                key={i}
                                className="bg-white p-4 rounded-lg border border-gray-200 flex items-center gap-3"
                            >
                                <div className="flex-shrink-0 bg-green-100 p-1.5 rounded-full">
                                    <CheckCircle2
                                        size={16}
                                        className="text-green-600"
                                    />
                                </div>
                                <span className="text-gray-700">{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <Star className="text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">
                                Program Unggulan
                            </h3>
                            <p className="text-sm text-gray-500">
                                Magang dengan standar industri terbaik.
                            </p>
                        </div>
                    </div>
                    <div className="space-y-3 text-sm mt-4">
                        <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                            <span className="text-gray-600">
                                Durasi Fleksibel
                            </span>
                            <span className="font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded">
                                3-6 Bulan
                            </span>
                        </div>
                        {/* --- BAGIAN MENTOR RATIO DIHAPUS --- */}
                        <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                            <span className="text-gray-600">Project Based</span>
                            <span className="font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                                Real Case
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

// --- (Sisa komponen tidak diubah) ---
const MeetTheMentors = () => {
    const mentors = [
        {
            name: "Budi Santoso",
            role: "Operations Manager",
            img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400",
            desc: "15+ tahun pengalaman di industri logistik dan warehouse. Expert dalam optimasi operasional dan supply chain.",
            expertise: ["Warehouse Management", "Process Optimization"],
            focus: "Operasional harian, manajemen inventory, dan pengembangan sistem kerja yang efisien.",
        },
        {
            name: "Sarah Wijaya",
            role: "Marketing Director",
            img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400",
            desc: "10+ tahun di digital marketing dan brand development. Spesialis dalam strategi growth dan customer acquisition.",
            expertise: [
                "Digital Marketing",
                "Brand Strategy",
                "Content Creation",
            ],
            focus: "Campaign development, social media strategy, dan analisis performa marketing.",
        },
        {
            name: "Ahmad Rizki",
            role: "Tech Lead",
            img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400",
            desc: "8+ tahun pengalaman software development. Expert dalam mobile app development dan system architecture.",
            expertise: [
                "Mobile Development",
                "System Design",
                "Database Management",
            ],
            focus: "Pengembangan aplikasi, troubleshooting sistem, dan best practices programming.",
        },
    ];
    return (
        <section className="py-16 sm:py-24 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <span className="inline-block px-3 py-1 mb-2 text-sm font-semibold text-green-800 bg-green-100 rounded-full">
                        Tim Mentor
                    </span>
                    <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
                        Belajar dari yang Terbaik
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-gray-600">
                        Mentor berpengalaman yang akan membimbing perjalanan
                        magang Anda dengan expertise di bidangnya masing-masing.
                    </p>
                </div>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mentors.map((mentor) => (
                        <div
                            key={mentor.name}
                            className="bg-white rounded-xl shadow-lg border border-gray-200/80 p-6 relative overflow-hidden"
                        >
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-50 rounded-full"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-4">
                                    <img
                                        src={mentor.img}
                                        alt={mentor.name}
                                        className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                                    />
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {mentor.name}
                                        </h3>
                                        <span className="text-sm font-semibold text-green-700">
                                            {mentor.role}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm">
                                    {mentor.desc}
                                </p>
                                <div className="my-4 border-t border-gray-100"></div>
                                <h4 className="font-semibold text-gray-800 text-sm">
                                    Expertise:
                                </h4>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {mentor.expertise.map((skill) => (
                                        <span
                                            key={skill}
                                            className="text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                                <h4 className="font-semibold text-gray-800 text-sm mt-4">
                                    Mentoring Focus:
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    {mentor.focus}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- Projects Section [SUDAH DIMODIFIKASI] ---
const InternshipProjects = (
    { projects } // Terima 'projects' sebagai prop
) => (
    <section className="py-16 sm:py-24 bg-white">
        {/* ... (Judul section tidak berubah) ... */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Kita akan map data proyek di sini */}
            {projects.map((project) => (
                <div
                    key={project.id}
                    className="bg-white p-6 rounded-xl shadow-lg border border-gray-200/80 flex flex-col h-full"
                >
                    {/* ... (Isi card proyek disesuaikan dari screenshot) ... */}
                    <h3 className="text-lg font-bold">{project.title}</h3>
                    <p className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-full inline-block mt-3">
                        {project.category}
                    </p>
                    <p className="text-sm text-gray-600 mt-3 flex-grow">
                        {project.description}
                    </p>
                    <h4 className="font-semibold mt-4">
                        Yang Akan Dipelajari:
                    </h4>
                    <ul className="mt-2 space-y-2 text-sm">
                        {project.learnings.map((learning, i) => (
                            <li key={i} className="flex gap-2">
                                <CheckCircle2
                                    size={16}
                                    className="text-green-500 mt-0.5 flex-shrink-0"
                                />
                                {learning}
                            </li>
                        ))}
                    </ul>
                    <div className="flex gap-4 text-sm mt-4 text-gray-500">
                        <div className="flex items-center gap-2">
                            <Clock size={16} /> {project.duration}
                        </div>
                        <div className="flex items-center gap-2">
                            <Users size={16} /> {project.team_size}
                        </div>
                    </div>
                </div>
            ))}
            <div className="bg-green-50 p-6 rounded-xl flex flex-col justify-center items-center text-center border border-green-200 h-full">
                <h3 className="text-xl font-bold text-gray-900">
                    Project Impact
                </h3>
                <p className="text-sm text-gray-600 mt-2 flex-grow">
                    Semua project yang dikerjakan intern memiliki dampak nyata
                    pada operasional perusahaan dan akan digunakan dalam
                    production environment.
                </p>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
                        <p className="text-3xl font-bold text-green-600">
                            100%
                        </p>
                        <p className="text-sm text-gray-500">
                            Project Completion
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
                        <p className="text-3xl font-bold text-green-600">85%</p>
                        <p className="text-sm text-gray-500">
                            Production Ready
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

// --- Application Process Section ---
const ApplicationProcess = () => {
    const steps = [
        {
            num: 1,
            title: "Submit Application",
            desc: "Kirim CV dan cover letter",
        },
        {
            num: 2,
            title: "Initial Screening",
            desc: "Review dokumen dan kualifikasi",
        },
        { num: 3, title: "Interview", desc: "Wawancara dengan tim HR & User" },
        { num: 4, title: "Onboarding", desc: "Orientasi dan mulai magang" },
    ];

    return (
        <section className="py-16 sm:py-24 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
                        Proses Aplikasi
                    </h2>
                </div>
                <div className="mt-16 max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-y-10">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className="text-center relative px-4"
                            >
                                <div className="relative inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-700 font-bold rounded-full mb-3 z-10 border-4 border-gray-50 text-lg">
                                    {step.num}
                                </div>
                                <h3 className="font-semibold text-gray-900">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {step.desc}
                                </p>
                                {index < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-6 left-1/2 w-full h-0.5 bg-gray-200"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

const Internship = ({ positions, projects }) => {
    return (
        <>
            <Head title="Program Magang" />
            <InternshipHero />
            <JobOpenings positions={positions} />
            <InternshipBenefits />
            <MeetTheMentors />
            <InternshipProjects projects={projects} />
            <ApplicationProcess />
        </>
    );
};

Internship.layout = (page) => <GuestLayout children={page} />;

export default Internship;
