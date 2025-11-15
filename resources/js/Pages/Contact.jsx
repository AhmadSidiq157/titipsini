import React, { useRef } from "react";
import GuestLayout from "../Layouts/GuestLayout";
import { Head, usePage } from "@inertiajs/react";
import {
    Mail,
    Phone,
    MapPin,
    MessageCircle,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

// --- Komponen ContactInfoCard (Tidak Berubah) ---
function ContactInfoCard({ settings, whatsappUrl }) {
    // ... (Isi komponen ini sama persis seperti sebelumnya)
    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Info Kontak
            </h3>
            <div className="space-y-4">
                {settings.contact_email && (
                    <div className="flex items-start">
                        <Mail className="w-5 h-5 mr-3 mt-1 text-gray-400 flex-shrink-0" />
                        <div>
                            <span className="text-sm text-gray-500">Email</span>
                            <a
                                href={`mailto:${settings.contact_email}`}
                                className="block text-gray-700 hover:text-green-600 break-all"
                            >
                                {settings.contact_email}
                            </a>
                        </div>
                    </div>
                )}
                {settings.contact_phone && (
                    <div className="flex items-start">
                        <Phone className="w-5 h-5 mr-3 mt-1 text-gray-400 flex-shrink-0" />
                        <div>
                            <span className="text-sm text-gray-500">
                                Telepon
                            </span>
                            <a
                                href={`tel:${settings.contact_phone}`}
                                className="block text-gray-700 hover:text-green-600"
                            >
                                {settings.contact_phone}
                            </a>
                        </div>
                    </div>
                )}
            </div>
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full inline-flex items-center justify-center px-4 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors"
            >
                <MessageCircle className="w-5 h-5 mr-2" />
                Hubungi via WhatsApp
            </a>
        </div>
    );
}
// --- Akhir Komponen ContactInfoCard ---

// [MODIFIKASI TOTAL] Komponen Card Cabang (Ukuran Sama & Truncate)
function BranchCard({ branch }) {
    const googleMapsSearchUrl = `https://maps.app.goo.gl/sSCst5QEQocFgLVy7{encodeURIComponent(
        branch.name + " " + branch.address
    )}`;

    return (
        <div
            className="flex-shrink-0 w-80 sm:w-96 scroll-snap-align-start 
                      bg-white rounded-lg shadow-md border border-gray-100 
                      flex flex-col overflow-hidden"
        >
            {/* [BARU] Bagian Atas: Teks (Dibuat flex-1 agar mendorong peta ke bawah) */}
            <div className="p-6 flex-1">
                <h3 className="text-xl font-semibold text-gray-800 mb-3 truncate">
                    {/* ^-- [EFEK] Teks "titik-titik" jika nama terlalu panjang */}
                    {branch.name}
                </h3>
                <div className="space-y-3 text-gray-600">
                    <div className="flex items-start">
                        <MapPin className="w-5 h-5 mr-3 mt-1 text-gray-400 flex-shrink-0" />
                        {/* [EFEK] Teks "titik-titik" jika alamat lebih dari 3 baris */}
                        <span className="line-clamp-3">{branch.address}</span>
                    </div>
                    <div className="flex items-start">
                        <Phone className="w-5 h-5 mr-3 mt-1 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{branch.phone}</span>
                    </div>
                </div>
            </div>

            {/* [BARU] Bagian Bawah: Peta (mt-auto mendorong ini ke bawah) */}
            <div className="mt-auto border-t p-6 bg-gray-50">
                {branch.google_maps_embed_url ? (
                    <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden border">
                        <iframe
                            src={branch.google_maps_embed_url}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title={`Peta Lokasi ${branch.name}`}
                        ></iframe>
                    </div>
                ) : (
                    <div className="aspect-w-16 aspect-h-9 rounded-lg border bg-gray-200 flex items-center justify-center">
                        <p className="text-sm text-gray-500">
                            Peta tidak tersedia.
                        </p>
                    </div>
                )}
                <a
                    href={branch.google_maps_embed_url || googleMapsSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-sm text-green-600 hover:underline font-medium"
                >
                    Buka di Google Maps
                </a>
            </div>
        </div>
    );
}

// [MODIFIKASI] Halaman Kontak Utama
export default function Contact({ status }) {
    const { settings, branches } = usePage().props;
    const scrollContainerRef = useRef(null);

    const scroll = (direction) => {
        // Lebar scroll = lebar kartu (w-96 = 384px) + gap (space-x-6 = 24px)
        const scrollAmount = direction === "left" ? -408 : 408;
        scrollContainerRef.current.scrollBy({
            left: scrollAmount,
            behavior: "smooth",
        });
    };

    // ... (Kode URL WhatsApp tetap sama)
    const phoneNumber = settings.contact_phone
        ? settings.contact_phone.replace(/\D/g, "")
        : "";
    const message = settings.whatsapp_message
        ? encodeURIComponent(settings.whatsapp_message)
        : "Halo, saya ingin bertanya tentang layanan Titipsini.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    return (
        <>
            <Head title="Kontak Kami" />
            <div className="py-12 md:py-20 bg-gray-50">
                {/* [MODIFIKASI] Container diubah jadi 'max-w-7xl' agar muat carousel */}
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Judul Halaman */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
                            Hubungi Kami
                        </h1>
                        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                            Kami senang bisa membantu Anda. Silakan hubungi kami
                            melalui WhatsApp atau kunjungi salah satu cabang
                            kami.
                        </p>
                    </div>

                    {/* --- [MODIFIKASI TOTAL] BAGIAN CABANG (CAROUSEL) --- */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center sm:text-left">
                            Cabang Kami
                        </h2>

                        {branches && branches.length > 0 ? (
                            // [BARU] Wrapper Relatif untuk tombol & gradient
                            <div className="relative">
                                {/* [BARU] Gradient Fade Kiri */}
                                <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-50 z-10 pointer-events-none" />

                                {/* Tombol Kiri (di atas gradient) */}
                                <button
                                    onClick={() => scroll("left")}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition duration-300 -translate-x-4 hidden md:flex"
                                    aria-label="Scroll Left"
                                >
                                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                                </button>

                                {/* [MODIFIKASI] Container Scroll (Scrollbar Dihilangkan Total) */}
                                <div
                                    ref={scrollContainerRef}
                                    className="flex space-x-6 overflow-x-auto py-4 px-2
                                               scrollbar-none 
                                               scroll-snap-type-x-mandatory"
                                >
                                    {branches.map((branch) => (
                                        <BranchCard
                                            key={branch.id}
                                            branch={branch}
                                        />
                                    ))}
                                </div>

                                {/* [BARU] Gradient Fade Kanan */}
                                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-50 z-10 pointer-events-none" />

                                {/* Tombol Kanan (di atas gradient) */}
                                <button
                                    onClick={() => scroll("right")}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition duration-300 translate-x-4 hidden md:flex"
                                    aria-label="Scroll Right"
                                >
                                    <ChevronRight className="w-6 h-6 text-gray-700" />
                                </button>
                            </div>
                        ) : (
                            <p className="text-gray-600 text-center sm:text-left">
                                Informasi cabang akan segera hadir.
                            </p>
                        )}
                    </div>

                    {/* --- BAGIAN KONTAK (CENTERED) --- */}
                    <div className="max-w-3xl mx-auto space-y-6">
                        <h2 className="text-3xl font-bold text-gray-800 pt-6 text-center sm:text-left">
                            Info Kontak
                        </h2>
                        <ContactInfoCard
                            settings={settings}
                            whatsappUrl={whatsappUrl}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

// Tetapkan layout default
Contact.layout = (page) => <GuestLayout children={page} />;
