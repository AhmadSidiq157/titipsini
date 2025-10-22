import Modal from "@/Components/Modal";
import { useForm } from "@inertiajs/react";

export default function AddPositionModal({ show, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: "",
        category: "",
        type: "Full-time",
        description: "",
        location: "Jakarta",
        duration: "3-6 Bulan",
        slots: 1,
        deadline: "",
        requirements: [""], // Mulai dengan satu input kosong
    });

    // Fungsi untuk mengelola input 'requirements' yang dinamis
    const handleRequirementChange = (index, value) => {
        const updatedRequirements = [...data.requirements];
        updatedRequirements[index] = value;
        setData("requirements", updatedRequirements);
    };

    const handleAddRequirement = () => {
        setData("requirements", [...data.requirements, ""]);
    };

    const handleRemoveRequirement = (index) => {
        if (data.requirements.length > 1) {
            setData(
                "requirements",
                data.requirements.filter((_, i) => i !== index)
            );
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.internship-positions.store"), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <form onSubmit={submit} className="p-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    Tambah Posisi Magang Baru
                </h2>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Kolom Kiri */}
                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="title"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Judul Posisi
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={data.title}
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
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
                                htmlFor="category"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Kategori
                            </label>
                            <input
                                type="text"
                                id="category"
                                value={data.category}
                                onChange={(e) =>
                                    setData("category", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            {errors.category && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.category}
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
                                rows="4"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            ></textarea>
                            {errors.description && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.description}
                                </p>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="requirements"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Requirements
                            </label>
                            {data.requirements.map((req, index) => (
                                <div
                                    key={index}
                                    className="flex items-center mt-2"
                                >
                                    <input
                                        type="text"
                                        value={req}
                                        onChange={(e) =>
                                            handleRequirementChange(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        className="block w-full border-gray-300 rounded-md shadow-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveRequirement(index)
                                        }
                                        className="ml-2 text-red-500 hover:text-red-700"
                                        disabled={data.requirements.length <= 1}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddRequirement}
                                className="mt-2 text-sm text-indigo-600 hover:text-indigo-900"
                            >
                                Tambah Requirement
                            </button>
                        </div>
                    </div>

                    {/* Kolom Kanan */}
                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="location"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Lokasi
                            </label>
                            <input
                                type="text"
                                id="location"
                                value={data.location}
                                onChange={(e) =>
                                    setData("location", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            {errors.location && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.location}
                                </p>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="duration"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Durasi
                            </label>
                            <input
                                type="text"
                                id="duration"
                                value={data.duration}
                                onChange={(e) =>
                                    setData("duration", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            {errors.duration && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.duration}
                                </p>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="slots"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Jumlah Posisi
                            </label>
                            <input
                                type="number"
                                id="slots"
                                value={data.slots}
                                min="1"
                                onChange={(e) =>
                                    setData("slots", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            {errors.slots && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.slots}
                                </p>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="deadline"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Deadline
                            </label>
                            <input
                                type="date"
                                id="deadline"
                                value={data.deadline}
                                onChange={(e) =>
                                    setData("deadline", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            {errors.deadline && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.deadline}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end border-t pt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="mr-3 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        disabled={processing}
                    >
                        {processing ? "Menyimpan..." : "Simpan Posisi"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
