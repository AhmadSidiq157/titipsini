import React from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    Phone,
    Mail,
    MapPin,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
    Globe,
    ChevronRight,
} from "lucide-react";

// Helper untuk memilih ikon sosmed secara otomatis berdasarkan nama
const getSocialIconComponent = (name) => {
    if (!name) return Globe;
    const lowerCaseName = name.toLowerCase();
    if (lowerCaseName.includes("facebook")) return Facebook;
    if (lowerCaseName.includes("instagram")) return Instagram;
    if (lowerCaseName.includes("twitter") || lowerCaseName.includes("x"))
        return Twitter;
    if (lowerCaseName.includes("linkedin")) return Linkedin;
    if (lowerCaseName.includes("youtube")) return Youtube;
    return Globe; // Icon default jika tidak dikenali
};

export default function Footer() {
    // Ambil data settings global dari Middleware
    const { settings = {}, auth } = usePage().props;

    // Data Kontak (Default strip jika kosong)
    const contactPhone = settings.contact_phone || "-";
    const contactEmail = settings.contact_email || "-";
    const contactAddress = settings.contact_address || "-";

    // Logic Parsing Social Links (JSON String -> Array Object)
    let socialLinks = [];
    try {
        if (settings.social_links) {
            // Cek tipe data, jika string kita parse, jika sudah object/array kita pakai langsung
            socialLinks =
                typeof settings.social_links === "string"
                    ? JSON.parse(settings.social_links)
                    : settings.social_links;
        }
    } catch (error) {
        console.error("Gagal memparsing data social links:", error);
        socialLinks = [];
    }

    // Pastikan socialLinks adalah array
    if (!Array.isArray(socialLinks)) {
        socialLinks = [];
    }

    return (
        <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* 1. Logo & Deskripsi */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-block">
                            <div className="flex items-center gap-3">
                                {/* Pastikan file logo ada di public/images/ */}
                                <img
                                    src="/images/titipsini-fotter1.png"
                                    alt="Logo Titipsini"
                                    className="h-10 w-auto object-contain brightness-0 invert"
                                />
                                <span className="text-2xl font-bold text-white tracking-tight">
                                    TitipSini
                                </span>
                            </div>
                        </Link>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Platform terpercaya untuk solusi penitipan barang
                            dan jasa pindahan dengan keamanan terjamin.
                        </p>

                        {/* --- BAGIAN SOSMED DINAMIS --- */}
                        <div className="flex gap-4 flex-wrap">
                            {socialLinks.length > 0 ? (
                                socialLinks.map((link, index) => {
                                    const Icon = getSocialIconComponent(
                                        link.name
                                    );
                                    return (
                                        <a
                                            key={index}
                                            href={link.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1"
                                            aria-label={link.name}
                                            title={link.name} // Tooltip native browser
                                        >
                                            <Icon size={18} />
                                        </a>
                                    );
                                })
                            ) : (
                                // Jika Admin belum input sosmed, tampilkan teks kecil atau kosongkan
                                <span className="text-xs text-slate-600 italic">
                                    Sosial media belum diatur.
                                </span>
                            )}
                        </div>
                    </div>

                    {/* 2. Tautan Cepat */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6 border-b border-slate-700 pb-2 inline-block">
                            Jelajahi
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href={route("home")}
                                    className="group flex items-center gap-2 hover:text-emerald-400 transition-colors"
                                >
                                    <ChevronRight
                                        size={14}
                                        className="text-slate-600 group-hover:text-emerald-500 transition-colors"
                                    />
                                    Beranda
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route("about")}
                                    className="group flex items-center gap-2 hover:text-emerald-400 transition-colors"
                                >
                                    <ChevronRight
                                        size={14}
                                        className="text-slate-600 group-hover:text-emerald-500 transition-colors"
                                    />
                                    Tentang Kami
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route("contact.show")}
                                    className="group flex items-center gap-2 hover:text-emerald-400 transition-colors"
                                >
                                    <ChevronRight
                                        size={14}
                                        className="text-slate-600 group-hover:text-emerald-500 transition-colors"
                                    />
                                    Hubungi Kami
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* 3. Layanan Utama */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6 border-b border-slate-700 pb-2 inline-block">
                            Layanan Utama
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href={route("penitipan.index")}
                                    className="group flex items-center gap-2 hover:text-emerald-400 transition-colors"
                                >
                                    <ChevronRight
                                        size={14}
                                        className="text-slate-600 group-hover:text-emerald-500 transition-colors"
                                    />
                                    Jasa Penitipan Barang
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route("pindahan.index")}
                                    className="group flex items-center gap-2 hover:text-emerald-400 transition-colors"
                                >
                                    <ChevronRight
                                        size={14}
                                        className="text-slate-600 group-hover:text-emerald-500 transition-colors"
                                    />
                                    Jasa Pindahan
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* 4. Kontak Kami (Dinamis dari Settings) */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6 border-b border-slate-700 pb-2 inline-block">
                            Hubungi Kami
                        </h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 text-emerald-500">
                                    <MapPin size={18} />
                                </div>
                                <span className="text-sm leading-relaxed">
                                    {contactAddress}
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 text-emerald-500">
                                    <Phone size={18} />
                                </div>
                                <span className="text-sm hover:text-white transition-colors">
                                    {contactPhone}
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 text-emerald-500">
                                    <Mail size={18} />
                                </div>
                                <span className="text-sm hover:text-white transition-colors">
                                    {contactEmail}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <p>
                        &copy; {new Date().getFullYear()} TitipSini.com. All
                        rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <span className="cursor-pointer hover:text-white transition-colors">
                            Syarat & Ketentuan
                        </span>
                        <span className="cursor-pointer hover:text-white transition-colors">
                            Kebijakan Privasi
                        </span>
                        <span className="cursor-pointer hover:text-white transition-colors">
                            Bantuan
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
