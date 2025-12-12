import Modal from "@/Components/Modal";
import { useForm } from "@inertiajs/react";

export default function AddPackageModal({ show, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        price: 0, // Harga Dasar
        price_per_km: 0, // [BARU] Harga per KM
        max_distance: "", // [BARU] Jarak Maksimal (String kosong agar placeholder muncul)
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
                <h2 className="text-lg font-medium text-gray-900 border-b pb-4 mb-4">
                    Tambah Paket Pindahan Baru
                </h2>

                <div className="space-y-5">
                    {/* Nama Paket */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Nama Paket
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="Contoh: Paket Hemat (Dalam Kota)"
                        />
                        {errors.name && (
                            <p className="text-sm text-red-600 mt-1">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* --- [BARU] LOGIKA HARGA (GRID 2 KOLOM) --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label
                                htmlFor="price"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Harga Dasar (3 KM Pertama)
                            </label>
                            <div className="relative mt-1 rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <span className="text-gray-500 sm:text-sm">
                                        Rp
                                    </span>
                                </div>
                                <input
                                    type="number"
                                    id="price"
                                    min="0"
                                    value={data.price}
                                    onChange={(e) =>
                                        setData("price", e.target.value)
                                    }
                                    className="block w-full rounded-md border-gray-300 pl-10 focus:border-emerald-500 focus:ring-emerald-500"
                                    placeholder="0"
                                />
                            </div>
                            {errors.price && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.price}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="price_per_km"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Harga Per KM Selanjutnya
                            </label>
                            <div className="relative mt-1 rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <span className="text-gray-500 sm:text-sm">
                                        Rp
                                    </span>
                                </div>
                                <input
                                    type="number"
                                    id="price_per_km"
                                    min="0"
                                    value={data.price_per_km}
                                    onChange={(e) =>
                                        setData("price_per_km", e.target.value)
                                    }
                                    className="block w-full rounded-md border-gray-300 pl-10 focus:border-emerald-500 focus:ring-emerald-500"
                                    placeholder="0"
                                />
                            </div>
                            {errors.price_per_km && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.price_per_km}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* --- [BARU] BATAS JARAK --- */}
                    <div>
                        <label
                            htmlFor="max_distance"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Batas Jarak Maksimal (KM)
                        </label>
                        <input
                            type="number"
                            id="max_distance"
                            min="0"
                            value={data.max_distance}
                            onChange={(e) =>
                                setData("max_distance", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="Biarkan kosong jika tidak ada batasan (Unlimited)"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            *Jika diisi (misal: 30), user tidak bisa memesan
                            jika jarak melebihi angka ini.
                        </p>
                        {errors.max_distance && (
                            <p className="text-sm text-red-600 mt-1">
                                {errors.max_distance}
                            </p>
                        )}
                    </div>

                    {/* Deskripsi */}
                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Deskripsi Singkat
                        </label>
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            rows="3"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                        ></textarea>
                        {errors.description && (
                            <p className="text-sm text-red-600 mt-1">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    {/* Fitur Dinamis */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fitur Paket (Poin-poin)
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
                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder={`Fitur ${index + 1}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveFeature(index)}
                                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                                    title="Hapus Fitur"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddFeature}
                            className="mt-3 text-sm text-emerald-600 hover:text-emerald-800 font-medium flex items-center gap-1"
                        >
                            + Tambah Fitur Lain
                        </button>
                    </div>

                    {/* Checkbox Populer */}
                    <div className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <input
                            id="popular"
                            type="checkbox"
                            checked={data.popular}
                            onChange={(e) =>
                                setData("popular", e.target.checked)
                            }
                            className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <label
                            htmlFor="popular"
                            className="ml-2 block text-sm text-gray-900 cursor-pointer select-none"
                        >
                            Tandai sebagai "Paling Populer"
                        </label>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium text-sm shadow-sm transition-colors disabled:opacity-50"
                        disabled={processing}
                    >
                        {processing ? "Menyimpan..." : "Simpan Paket"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
