import React from "react";
// [FIX] Mengganti alias '@' dengan path relatif
import GuestLayout from "../Layouts/GuestLayout";
// [MODIFIKASI] Import usePage untuk mengambil 'settings'
import { Head, usePage } from "@inertiajs/react"; // useForm dihapus karena form dihilangkan
// [MODIFIKASI] Import ikon WhatsApp (MessageCircle)
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
// Import form dihapus
// import PrimaryButton from "../Components/PrimaryButton";
// import TextInput from "../Components/TextInput";
// import InputLabel from "../Components/InputLabel";
// import InputError from "../Components/InputError";

// [DIHILANGKAN] Komponen Form Kontak (ContactForm) sudah dihapus

// [BARU] Komponen Info Kontak Utama (Email, Telp, WA)
function ContactInfoCard({ settings, whatsappUrl }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Info Kontak
            </h3>
            <div className="space-y-4">
                {/* Info Email */}
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
                {/* Info Telepon */}
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
            {/* Tombol WhatsApp */}
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

// [MODIFIKASI] Komponen Card Cabang (Tambah Fallback Peta)
function BranchCard({ branch }) {
    // Buat URL Google Maps search jika URL embed tidak ada/gagal
    const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        branch.address
    )}`;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {branch.name}
            </h3>
            <div className="space-y-3 text-gray-600">
                <div className="flex items-start">
                    <MapPin className="w-5 h-5 mr-3 mt-1 text-gray-400 flex-shrink-0" />
                    <span>{branch.address}</span>
                </div>
                <div className="flex items-start">
                    <Phone className="w-5 h-5 mr-3 mt-1 text-gray-400 flex-shrink-0" />
                    <span>{branch.phone}</span>
                </div>
            </div>

            {/* --- INI BAGIAN PETA LOKASI (DENGAN FALLBACK) --- */}
            <div className="mt-4 border-t pt-4">
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
                    <p className="text-sm text-gray-500">
                        Peta tidak tersedia.
                    </p>
                )}
                {/* [MODIFIKASI] Tombol fallback jika peta gagal load */}
                <a
                    href={branch.google_maps_embed_url || googleMapsSearchUrl} // Coba pakai embed URL, jika tidak ada, pakai search URL
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

// [MODIFIKASI] Halaman Kontak Utama (Layout Diubah)
export default function Contact({ status }) {
    // 'status' tidak lagi dipakai, tapi kita biarkan
    // Ambil 'settings' dan 'branches' dari props
    const { settings, branches } = usePage().props;

    // Siapkan URL WhatsApp dari settings
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
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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

                    {/* [MODIFIKASI] Layout ditukar posisinya */}
                    <div className="max-w-3xl mx-auto space-y-6">
                        {/* --- BAGIAN CABANG (ATAS) --- */}
                        <h2 className="text-3xl font-bold text-gray-800">
                            Cabang Kami
                        </h2>

                        {/* Data cabang sekarang dinamis dari 'props.branches' */}
                        {branches && branches.length > 0 ? (
                            branches.map((branch) => (
                                <BranchCard key={branch.id} branch={branch} />
                            ))
                        ) : (
                            <p className="text-gray-600">
                                Informasi cabang akan segera hadir.
                            </p>
                        )}

                        {/* --- BAGIAN KONTAK (BAWAH) --- */}
                        <h2 className="text-3xl font-bold text-gray-800 pt-6">
                            Info Kontak
                        </h2>

                        {/* Kartu Info Kontak Utama */}
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
