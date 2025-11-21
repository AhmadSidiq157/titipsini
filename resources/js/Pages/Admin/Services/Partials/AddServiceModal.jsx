// resources/js/Pages/Admin/Services/Partials/AddServiceModal.jsx

import Modal from "@/Components/Modal";
import { useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function AddServiceModal({ show, onClose }) {
    // 1. Ubah initial state illustration jadi null
    const { data, setData, post, processing, errors, reset } = useForm({
        title: "",
        description: "",
        price: 0,
        illustration: null, // Diset null agar nanti diisi file object
        features: [""],
    });

    // State untuk preview gambar sementara
    const [preview, setPreview] = useState(null);

    // Reset form dan preview saat modal ditutup/dibuka ulang
    useEffect(() => {
        if (!show) {
            reset();
            setPreview(null);
        }
    }, [show]);

    // 2. Handler untuk Input Gambar
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("illustration", file); // Masukkan file object ke inertia form
            setPreview(URL.createObjectURL(file)); // Buat URL preview sementara
        }
    };

    const handleAddFeature = () => {
        setData("features", [...data.features, ""]);
    };

    const handleFeatureChange = (index, value) => {
        const newFeatures = [...data.features];
        newFeatures[index] = value;
        setData("features", newFeatures);
    };

    const handleRemoveFeature = (index) => {
        setData(
            "features",
            data.features.filter((_, i) => i !== index)
        );
    };

    const submit = (e) => {
        e.preventDefault();

        // Inertia otomatis mendeteksi file upload dan mengubah request menjadi FormData
        post(route("admin.services.store"), {
            forceFormData: true, // Memaksa pengiriman sebagai FormData (penting untuk file)
            onSuccess: () => {
                reset();
                setPreview(null);
                onClose();
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose}>
            <form onSubmit={submit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900">
                    Tambah Layanan Baru
                </h2>

                <div className="mt-6 space-y-4">
                    {/* Input Judul */}
                    <div>
                        <label
                            htmlFor="title"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Judul Layanan
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                            placeholder="Contoh: Penitipan Koper"
                        />
                        {errors.title && (
                            <p className="text-sm text-red-600 mt-1">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    {/* Input Harga */}
                    <div>
                        <label
                            htmlFor="price"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Harga (Rp)
                        </label>
                        <input
                            type="number"
                            id="price"
                            value={data.price}
                            onChange={(e) => setData("price", e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                            placeholder="Contoh: 50000"
                        />
                        {errors.price && (
                            <p className="text-sm text-red-600 mt-1">
                                {errors.price}
                            </p>
                        )}
                    </div>

                    {/* --- 3. INPUT GAMBAR ILUSTRASI --- */}
                    <div>
                        <label
                            htmlFor="illustration"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Gambar Ilustrasi
                        </label>

                        {/* Area Preview */}
                        {preview && (
                            <div className="mt-2 mb-2">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="h-32 w-auto object-cover rounded-md border border-gray-200"
                                />
                            </div>
                        )}

                        <input
                            type="file"
                            id="illustration"
                            onChange={handleImageChange}
                            accept="image/*" // Hanya terima file gambar
                            className="mt-1 block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-green-50 file:text-green-700
                                hover:file:bg-green-100"
                        />
                        {errors.illustration && (
                            <p className="text-sm text-red-600 mt-1">
                                {errors.illustration}
                            </p>
                        )}
                    </div>
                    {/* --- END INPUT GAMBAR --- */}

                    {/* Input Deskripsi */}
                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Deskripsi
                        </label>
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            rows="3"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                        ></textarea>
                        {errors.description && (
                            <p className="text-sm text-red-600 mt-1">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    {/* Input Fitur (Dinamis) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Fitur Layanan
                        </label>
                        {data.features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex items-center mt-2 gap-2"
                            >
                                <input
                                    type="text"
                                    value={feature}
                                    onChange={(e) =>
                                        handleFeatureChange(
                                            index,
                                            e.target.value
                                        )
                                    }
                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                                    placeholder={`Fitur ${index + 1}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveFeature(index)}
                                    className="text-red-500 hover:text-red-700 font-bold px-2"
                                    title="Hapus Fitur"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddFeature}
                            className="mt-2 text-sm text-green-600 hover:text-green-900 font-medium flex items-center"
                        >
                            + Tambah Fitur Lain
                        </button>
                    </div>
                </div>

                {/* Tombol Aksi */}
                <div className="mt-8 flex justify-end space-x-3 border-t pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                        disabled={processing}
                    >
                        {processing ? "Menyimpan..." : "Simpan Layanan"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
