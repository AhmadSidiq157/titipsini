import React, { useRef, useState, useEffect } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, usePage } from "@inertiajs/react";
import {
    Mail,
    Phone,
    MapPin,
    MessageCircle,
    ChevronLeft,
    ChevronRight,
    Map as MapIcon,
    ArrowUpRight,
} from "lucide-react";

// --- 1. Komponen Kecil (Helpers) untuk mempersingkat kode ---
const IconBox = ({
    icon: Icon,
    colorClass = "text-indigo-400 group-hover:text-indigo-600",
}) => (
    <div
        className={`p-3 bg-gray-50 rounded-xl ${colorClass} transition-colors duration-300`}
    >
        <Icon className="w-5 h-5" />
    </div>
);

const ContactItem = ({ icon, label, value, href }) => (
    <div className="flex items-start gap-4 group">
        <IconBox
            icon={icon}
            colorClass="text-gray-400 group-hover:text-green-600 group-hover:bg-green-50"
        />
        <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                {label}
            </p>
            <a
                href={href}
                className="text-gray-800 font-medium hover:text-green-700 transition-colors break-all"
            >
                {value}
            </a>
        </div>
    </div>
);

// --- 2. Kartu Cabang ---
const BranchCard = ({ branch }) => {
    const mapUrl = branch.google_maps_embed_url || "";
    const linkUrl =
        branch.google_maps_embed_url ||
        `https://maps.google.com/?q=${branch.name} ${branch.address}`;

    return (
        <div className="flex-shrink-0 w-80 sm:w-96 bg-white rounded-2xl border border-gray-200 overflow-hidden group hover:shadow-xl hover:border-green-200 transition-all duration-300 relative flex flex-col">
            {/* Peta */}
            <div className="h-48 w-full bg-gray-100 relative overflow-hidden">
                {mapUrl ? (
                    <iframe
                        src={mapUrl}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        allowFullScreen
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                        <MapIcon className="w-10 h-10 mb-2 opacity-50" />
                        <span className="text-xs font-medium">Peta Kosong</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
            </div>
            {/* Info */}
            <div className="p-6 flex flex-col flex-1 gap-4">
                <h3 className="text-xl font-bold text-gray-900 leading-snug group-hover:text-green-700 transition-colors line-clamp-2">
                    {branch.name}
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex gap-3">
                        <MapPin className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                        <p className="line-clamp-3">{branch.address}</p>
                    </div>
                    <div className="flex gap-3">
                        <Phone className="w-4 h-4 text-green-600 shrink-0" />
                        <p className="truncate">{branch.phone}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 3. Komponen Utama ---
export default function Contact() {
    const { settings, branches } = usePage().props;
    const scrollRef = useRef(null);
    const [scrollState, setScrollState] = useState({
        left: false,
        right: true,
    });

    // Helper Data
    const phone = settings.contact_phone || "";
    const waLink = `https://wa.me/${phone.replace(
        /\D/g,
        ""
    )}?text=${encodeURIComponent(settings.whatsapp_message || "Halo!")}`;
    const isSingle = branches?.length === 1;

    // Logic Scroll
    const handleScroll = (dir) => {
        const width = window.innerWidth >= 640 ? 384 : 320;
        scrollRef.current?.scrollBy({
            left: dir === "left" ? -(width + 24) : width + 24,
            behavior: "smooth",
        });
    };

    const checkScroll = () => {
        if (!scrollRef.current) return;
        const { scrollWidth, clientWidth, scrollLeft } = scrollRef.current;
        setScrollState({
            left: scrollLeft > 0,
            right: scrollLeft < scrollWidth - clientWidth - 1,
        });
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (el) {
            el.addEventListener("scroll", checkScroll);
            window.addEventListener("resize", checkScroll);
            checkScroll();
        }
        return () => {
            el?.removeEventListener("scroll", checkScroll);
            window.removeEventListener("resize", checkScroll);
        };
    }, [branches]);

    const NavBtn = ({ dir, icon: Icon }) => (
        <button
            onClick={() => handleScroll(dir)}
            disabled={!scrollState[dir]}
            className={`p-2.5 rounded-full border transition-all ${
                !scrollState[dir]
                    ? "border-gray-100 text-gray-300"
                    : "border-gray-200 text-gray-600 hover:border-green-500 hover:text-green-600 hover:bg-green-50"
            }`}
        >
            <Icon className="w-5 h-5" />
        </button>
    );

    return (
        <>
            <Head title="Kontak Kami" />
            <div className="bg-white min-h-screen">
                {/* Header */}
                <div className="pt-16 pb-12 sm:pt-20 sm:pb-16 border-b border-gray-100 text-center px-4">
                    <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-green-50 border border-green-100 text-sm font-bold text-green-700 uppercase">
                        Hubungi Kami
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
                        Kami Senang Mendengar{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-500">
                            Dari Anda
                        </span>
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        Punya pertanyaan atau ingin berdiskusi? Temukan cabang
                        terdekat atau kirim pesan langsung.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                    {/* Section Cabang */}
                    <div className="mb-20">
                        <div className="flex items-center justify-center relative mb-10">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Lokasi Cabang
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Kunjungi titik layanan terdekat.
                                </p>
                            </div>
                            {!isSingle && (
                                <div className="hidden md:flex gap-2 absolute right-0 top-1/2 -translate-y-1/2">
                                    <NavBtn dir="left" icon={ChevronLeft} />
                                    <NavBtn dir="right" icon={ChevronRight} />
                                </div>
                            )}
                        </div>

                        <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
                            <div
                                ref={scrollRef}
                                className={`flex gap-6 overflow-x-auto pb-8 pt-2 scrollbar-hide scroll-snap-x-mandatory ${
                                    isSingle ? "justify-center" : ""
                                }`}
                            >
                                {branches?.length > 0 ? (
                                    branches.map((b) => (
                                        <BranchCard key={b.id} branch={b} />
                                    ))
                                ) : (
                                    <p className="w-full text-center py-12 text-gray-500 border border-dashed rounded-2xl">
                                        Belum ada info cabang.
                                    </p>
                                )}
                            </div>
                            {!isSingle && (
                                <div className="absolute right-0 top-0 bottom-8 w-12 bg-gradient-to-l from-white to-transparent md:hidden pointer-events-none" />
                            )}
                        </div>
                    </div>

                    {/* Section Kontak Info */}
                    <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex flex-col sm:flex-row gap-8 justify-between items-center">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Butuh Bantuan Cepat?
                                </h2>
                                <p className="text-gray-500 text-sm sm:text-base">
                                    Tim kami siap membantu Anda setiap hari
                                    kerja.
                                </p>
                            </div>
                            <a
                                href={waLink}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white text-sm font-bold rounded-xl shadow-sm hover:bg-green-700 active:scale-95 transition-all"
                            >
                                <MessageCircle className="w-5 h-5 mr-2" /> Chat
                                WhatsApp
                            </a>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 pt-8 border-t border-gray-100">
                            {settings.contact_email && (
                                <ContactItem
                                    icon={Mail}
                                    label="Email Kami"
                                    value={settings.contact_email}
                                    href={`mailto:${settings.contact_email}`}
                                />
                            )}
                            {phone && (
                                <ContactItem
                                    icon={Phone}
                                    label="Telepon"
                                    value={phone}
                                    href={`tel:${phone}`}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Contact.layout = (page) => <GuestLayout children={page} />;
