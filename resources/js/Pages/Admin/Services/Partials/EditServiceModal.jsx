// resources/js/Pages/Admin/Services/Partials/EditServiceModal.jsx

import Modal from "@/Components/Modal";
import { useForm } from "@inertiajs/react";
import { useEffect } from "react";

export default function EditServiceModal({ show, onClose, service }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        title: "",
        description: "",
        illustration: "",
        features: [],
    });

    useEffect(() => {
        if (service) {
            setData({
                title: service.title,
                description: service.description,
                illustration: service.illustration,
                features: service.features || [""],
            });
        }
    }, [service]);

    // Fungsi-fungsi handle feature sama persis dengan AddServiceModal
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
        put(route("admin.services.update", service.id), {
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
                {/* Formnya sama persis dengan AddServiceModal, hanya value-nya dari state ini */}
                <div className="mt-6 space-y-4">
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
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        {errors.title && (
                            <p className="text-sm text-red-600 mt-1">
                                {errors.title}
                            </p>
                        )}
                    </div>
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
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        ></textarea>
                        {errors.description && (
                            <p className="text-sm text-red-600 mt-1">
                                {errors.description}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Fitur
                        </label>
                        {data.features.map((feature, index) => (
                            <div key={index} className="flex items-center mt-2">
                                <input
                                    type="text"
                                    value={feature}
                                    onChange={(e) =>
                                        handleFeatureChange(
                                            index,
                                            e.target.value
                                        )
                                    }
                                    className="block w-full border-gray-300 rounded-md shadow-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveFeature(index)}
                                    className="ml-2 text-red-500 hover:text-red-700"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddFeature}
                            className="mt-2 text-sm text-indigo-600 hover:text-indigo-900"
                        >
                            Tambah Fitur
                        </button>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="mr-3 px-4 py-2 text-gray-700"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                        disabled={processing}
                    >
                        Perbarui
                    </button>
                </div>
            </form>
        </Modal>
    );
}
