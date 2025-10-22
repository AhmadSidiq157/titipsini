// resources/js/Pages/Admin/MovingPackages/Partials/AddPackageModal.jsx

import Modal from "@/Components/Modal";
import { useForm } from "@inertiajs/react";

export default function AddPackageModal({ show, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        description: "",
        features: [""],
        popular: false,
    });

    const handleAddFeature = () => setData("features", [...data.features, ""]);
    const handleFeatureChange = (index, value) => {
        const newFeatures = [...data.features];
        newFeatures[index] = value;
        setData("features", newFeatures);
    };
    const handleRemoveFeature = (index) =>
        setData(
            "features",
            data.features.filter((_, i) => i !== index)
        );

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.moving-packages.store"), {
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
                    Tambah Paket Baru
                </h2>
                <div className="mt-6 space-y-4">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Nama Paket
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        {errors.name && (
                            <p className="text-sm text-red-600 mt-1">
                                {errors.name}
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
                    <div className="flex items-center">
                        <input
                            id="popular"
                            type="checkbox"
                            checked={data.popular}
                            onChange={(e) =>
                                setData("popular", e.target.checked)
                            }
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label
                            htmlFor="popular"
                            className="ml-2 block text-sm text-gray-900"
                        >
                            Jadikan Populer
                        </label>
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
                        className="px-4 py-2 bg-green-500 text-white rounded-md"
                        disabled={processing}
                    >
                        Simpan
                    </button>
                </div>
            </form>
        </Modal>
    );
}
