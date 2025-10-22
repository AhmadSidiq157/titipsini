import React from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import {
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaEnvelope,
    FaClock,
    FaWhatsapp,
} from "react-icons/fa";

//======================================================================
// SECTIONS (Didefinisikan sebagai komponen lokal)
//======================================================================

// --- Hero Section ---
const ContactHero = () => (
    <section className="text-center pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-800 tracking-tight">
                Mari <span className="text-green-600">Berbicara</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
                Kami siap membantu Anda dengan layanan penitipan barang terbaik.
                Hubungi kami kapan saja untuk konsultasi gratis.
            </p>
        </div>
    </section>
);

// --- Info Cards Section ---
const ContactInfo = () => {
    // Ambil data 'settings' dari props global
    const { settings } = usePage().props;

    // Ganti data statis dengan data dinamis dari settings
    const infoItems = [
        {
            icon: <FaMapMarkerAlt />,
            title: "Alamat",
            line1: settings.contact_address,
            line2: "Jakarta, Indonesia",
        },
        {
            icon: <FaPhoneAlt />,
            title: "Telepon",
            line1: settings.contact_phone,
            line2: "Senin - Minggu, 08:00 - 20:00",
        },
        {
            icon: <FaEnvelope />,
            title: "Email",
            line1: settings.contact_email,
            line2: "Respon dalam 24 Jam",
        },
        {
            icon: <FaClock />,
            title: "Jam Operasional",
            line1: "24/7 Akses Fasilitas",
            line2: "Customer service: 08:00 - 20:00",
        },
    ];

    return (
        <section className="py-16 sm:py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {infoItems.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 w-full"
                        >
                            <div className="text-green-600 mb-4 text-3xl">
                                {item.icon}
                            </div>
                            <h3 className="font-bold text-gray-800 text-lg mb-2">
                                {item.title}
                            </h3>
                            <p className="text-gray-600 text-sm">
                                {item.line1}
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                                {item.line2}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- Branch Locations Section ---
const BranchLocations = ({ branches }) => {
    // Sub-komponen untuk kartu cabang, hanya digunakan di dalam section ini
    const BranchCard = ({ name, address, phone, status }) => {
        const isComingSoon = status === "Segera Hadir";
        const statusClass = isComingSoon
            ? "bg-yellow-100 text-yellow-800"
            : "bg-green-100 text-green-800";

        return (
            <div className="bg-white p-6 rounded-xl shadow-lg text-left h-full flex flex-col border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-xl text-gray-800">{name}</h3>
                    <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${statusClass}`}
                    >
                        {status}
                    </span>
                </div>
                <div className="flex-grow space-y-2">
                    <div className="flex items-start text-gray-600">
                        <FaMapMarkerAlt className="mr-3 mt-1 flex-shrink-0 text-gray-400" />
                        <span>{address}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                        <FaPhoneAlt className="mr-3 flex-shrink-0 text-gray-400" />
                        <span>{phone}</span>
                    </div>
                </div>
                <button className="w-full mt-6 py-2.5 px-4 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition-colors">
                    Lihat Detail
                </button>
            </div>
        );
    };

    return (
        <section className="py-16 sm:py-24 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
                        Cabang Titipsini
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-gray-600">
                        Kami terus berkembang untuk melayani Anda di berbagai
                        lokasi strategis.
                    </p>
                </div>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {branches.map((branch, index) => (
                        <BranchCard key={index} {...branch} />
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- Contact Form & Map Section ---
const ContactFormAndMap = () => {
    // Ambil data 'settings' dari props global
    const { settings } = usePage().props;

    // Buat URL WhatsApp secara dinamis
    const phoneNumber = settings.contact_phone
        ? settings.contact_phone.replace(/\D/g, "")
        : "";
    const message = settings.whatsapp_message
        ? encodeURIComponent(settings.whatsapp_message)
        : "";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    // Sub-komponen untuk form, hanya digunakan di dalam section ini
    const ContactForm = () => {
        const { data, setData, post, processing, errors, recentlySuccessful } =
            useForm({
                fullName: "",
                email: "",
                phone: "",
                subject: "",
                message: "",
            });

        const submit = (e) => {
            e.preventDefault();
            post(route("contact.store"), { preserveScroll: true });
        };

        return (
            <div className="bg-white p-8 rounded-xl shadow-lg h-full border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                    Ada Pertanyaan? Hubungi Kami
                </h2>
                <p className="text-gray-600 mb-6">
                    Isi form di bawah ini dan kami akan merespon dalam waktu
                    singkat.
                </p>
                {recentlySuccessful && (
                    <div
                        className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded"
                        role="alert"
                    >
                        Pesan Anda telah berhasil dikirim!
                    </div>
                )}
                <form onSubmit={submit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <input
                                type="text"
                                value={data.fullName}
                                onChange={(e) =>
                                    setData("fullName", e.target.value)
                                }
                                placeholder="Nama Lengkap"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                required
                            />
                            {errors.fullName && (
                                <div className="text-red-500 text-xs mt-1">
                                    {errors.fullName}
                                </div>
                            )}
                        </div>
                        <div>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                placeholder="Email"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                required
                            />
                            {errors.email && (
                                <div className="text-red-500 text-xs mt-1">
                                    {errors.email}
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <input
                            type="tel"
                            value={data.phone}
                            onChange={(e) => setData("phone", e.target.value)}
                            placeholder="Nomor Telepon"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            required
                        />
                        {errors.phone && (
                            <div className="text-red-500 text-xs mt-1">
                                {errors.phone}
                            </div>
                        )}
                    </div>
                    <div>
                        <input
                            type="text"
                            value={data.subject}
                            onChange={(e) => setData("subject", e.target.value)}
                            placeholder="Subjek"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            required
                        />
                        {errors.subject && (
                            <div className="text-red-500 text-xs mt-1">
                                {errors.subject}
                            </div>
                        )}
                    </div>
                    <div>
                        <textarea
                            value={data.message}
                            onChange={(e) => setData("message", e.target.value)}
                            placeholder="Tulis pesan Anda di sini..."
                            rows="5"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            required
                        ></textarea>
                        {errors.message && (
                            <div className="text-red-500 text-xs mt-1">
                                {errors.message}
                            </div>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                        disabled={processing}
                    >
                        {processing ? "Mengirim..." : "Kirim Pesan"}
                    </button>
                </form>
            </div>
        );
    };

    return (
        <section className="py-16 sm:py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-3">
                        {" "}
                        <ContactForm />{" "}
                    </div>
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                            <h3 className="font-bold text-xl mb-4 text-gray-800">
                                Kontak Cepat
                            </h3>
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
                            >
                                <FaWhatsapp className="mr-3 text-xl" /> Chat
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

//======================================================================
// KOMPONEN UTAMA HALAMAN (Yang di-export)
//======================================================================
const Contact = ({ branches }) => {
    return (
        <>
            <Head title="Hubungi Kami" />

            <ContactHero />
            <ContactInfo />
            <BranchLocations branches={branches} />
            <ContactFormAndMap />
        </>
    );
};

// Menetapkan layout untuk halaman ini (sesuai contoh yang kamu berikan)
Contact.layout = (page) => <GuestLayout children={page} />;

export default Contact;
