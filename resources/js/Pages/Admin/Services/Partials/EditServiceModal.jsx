import Modal from "@/Components/Modal";
import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function EditServiceModal({ show, onClose, service }) {
    // State untuk preview gambar
    const [preview, setPreview] = useState(null);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            _method: "PUT", // [PENTING] Trik agar Laravel membaca ini sebagai Update meski pakai POST
            title: "",
            description: "",
            price: 0,
            illustration: null, // Nanti diisi file object jika user ganti gambar
            features: [],
        });

    useEffect(() => {
        if (service) {
            setData({
                _method: "PUT",
                title: service.title || "",
                description: service.description || "",
                price: service.price || 0,
                illustration: null, // Reset file input
                features: service.features || [""],
            });

            // Set preview ke gambar yang sudah ada di database
            setPreview(service.illustration || "/images/placeholder.jpg");
            clearErrors();
        }
    }, [service, show]);

    // Handler Ganti Gambar
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("illustration", file);
            setPreview(URL.createObjectURL(file)); // Preview gambar baru
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

        // Gunakan POST dengan forceFormData karena ada file upload
        // Laravel akan melihat _method: 'PUT' dan menganggapnya sebagai update
        post(route("admin.services.update", service.id), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose}>
            <form onSubmit={submit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900">
                    Edit Layanan
                </h2>

                <div className="mt-6 space-y-4">
                    {/* Input Judul */}
                    <div>
                        <label
                            htmlFor="title"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Judul
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
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
                            Harga
                        </label>
                        <input
                            type="number"
                            id="price"
                            value={data.price}
                            onChange={(e) => setData("price", e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                        />
                        {errors.price && (
                            <p className="text-sm text-red-600 mt-1">
                                {errors.price}
                            </p>
                        )}
                    </div>

                    {/* --- INPUT GAMBAR (PREVIEW & CHANGE) --- */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Gambar Ilustrasi
                        </label>

                        {/* Tampilkan Preview */}
                        {preview && (
                            <div className="mt-2 mb-2">
                                <p className="text-xs text-gray-500 mb-1">
                                    Preview saat ini:
                                </p>
                                <img
                                    src={preview}
                                    alt="Service Preview"
                                    className="h-32 w-auto object-cover rounded-md border border-gray-200"
                                />
                            </div>
                        )}

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            *Biarkan kosong jika tidak ingin mengubah gambar.
                        </p>
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

                    {/* Fitur (Dynamic Input) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Fitur
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
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveFeature(index)}
                                    className="text-red-500 hover:text-red-700 font-bold px-2"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddFeature}
                            className="mt-2 text-sm text-green-600 hover:text-green-900 font-medium"
                        >
                            + Tambah Fitur
                        </button>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-end space-x-3">
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
                        {processing ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
