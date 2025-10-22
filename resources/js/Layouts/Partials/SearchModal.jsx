import React, { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

export default function SearchModal({ isOpen, onClose }) {
    const inputRef = useRef(null);

    // Fokus ke input saat modal terbuka
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-20"
            onClick={onClose} // Menutup modal saat klik di luar area
        >
            <div
                className="relative bg-white rounded-lg w-full max-w-lg mx-4 p-4 shadow-xl"
                onClick={(e) => e.stopPropagation()} // Mencegah penutupan saat klik di dalam modal
            >
                <div className="relative">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Cari layanan atau lokasi..."
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={20}
                    />
                </div>
                <button
                    onClick={onClose}
                    className="absolute -top-4 -right-4 bg-white rounded-full p-1 shadow-lg"
                >
                    <X className="text-gray-600" size={24} />
                </button>
            </div>
        </div>
    );
}
