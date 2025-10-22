import Modal from "@/Components/Modal";
import { useForm } from "@inertiajs/react";
import { useEffect } from "react";

export default function EditPositionModal({ show, onClose, position }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        title: "",
        category: "",
        type: "",
        description: "",
        location: "",
        duration: "",
        slots: 1,
        deadline: "",
        requirements: [],
    });

    // Isi form dengan data yang ada saat modal dibuka
    useEffect(() => {
        if (position) {
            setData({
                title: position.title,
                category: position.category,
                type: position.type,
                description: position.description,
                location: position.location,
                duration: position.duration,
                slots: position.slots,
                deadline: position.deadline,
                requirements: position.requirements || [""],
            });
        }
    }, [position]);

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
        put(route("admin.internship-positions.update", position.id), {
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
                    Edit Posisi Magang
                </h2>

                {/* Formnya sama persis dengan AddPositionModal */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Kolom Kiri */}
                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="title_edit"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Judul Posisi
                            </label>
                            <input
                                type="text"
                                id="title_edit"
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
                                htmlFor="category_edit"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Kategori
                            </label>
                            <input
                                type="text"
                                id="category_edit"
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
                                htmlFor="description_edit"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Deskripsi
                            </label>
                            <textarea
                                id="description_edit"
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
                                htmlFor="requirements_edit"
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
                                htmlFor="location_edit"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Lokasi
                            </label>
                            <input
                                type="text"
                                id="location_edit"
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
                                htmlFor="duration_edit"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Durasi
                            </label>
                            <input
                                type="text"
                                id="duration_edit"
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
                                htmlFor="slots_edit"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Jumlah Posisi
                            </label>
                            <input
                                type="number"
                                id="slots_edit"
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
                                htmlFor="deadline_edit"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Deadline
                            </label>
                            <input
                                type="date"
                                id="deadline_edit"
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
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        disabled={processing}
                    >
                        {processing ? "Memperbarui..." : "Perbarui Posisi"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
