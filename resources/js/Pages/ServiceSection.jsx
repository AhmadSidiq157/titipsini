import React from "react";
import { CheckCircle } from "lucide-react";

// Helper function
const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number);
};

// Komponen untuk setiap kartu layanan
const ServiceCard = ({ service, onOrderClick }) => {
    const { id, illustration, title, description, features, price } = service;

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-gray-100">
            <div className="w-full h-48 overflow-hidden">
                <img
                    src={illustration}
                    alt={`Ilustrasi untuk ${title}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {title}
                </h3>
                <p className="text-gray-600 mb-4 flex-grow">{description}</p>

                <div className="mb-4">
                    <span className="text-gray-500 text-sm">Mulai dari</span>
                    <p className="text-2xl font-bold text-green-600">
                        {formatRupiah(price)}
                    </p>
                </div>

                <ul className="space-y-3 mb-6">
                    {features.map((feature, index) => (
                        <li
                            key={index}
                            className="flex items-center text-gray-700"
                        >
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                            {feature}
                        </li>
                    ))}
                </ul>

                <button
                    onClick={() => onOrderClick(service)} // Panggil handler dari parent
                    className="mt-auto w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 text-center"
                    disabled={price <= 0} // Nonaktifkan jika harga 0
                >
                    {price <= 0 ? "Tidak Tersedia" : "Pilih Layanan"}
                </button>
            </div>
        </div>
    );
};

// --- KOMPONEN SERVICES ---
// [MODIFIKASI] Nama komponen diubah jadi 'ServiceSection'
export default function ServiceSection({ services, onOrderClick }) {
    return (
        // [FIX] Tambahkan id="layanan" dan scroll-mt-20 (untuk anchor link header)
        <section id="layanan" className="py-16 bg-white scroll-mt-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800">
                        Layanan Penitipan Kami
                    </h2>
                    <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
                        Kami menyediakan layanan penitipan barang yang lengkap
                        dan fleksibel, mulai dari barang kecil hingga kendaraan.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service) => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            onOrderClick={onOrderClick} // <-- Kirim handler
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
