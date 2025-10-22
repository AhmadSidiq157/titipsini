import Modal from "@/Components/Modal";
import { useForm } from "@inertiajs/react";
import { useEffect } from "react";

export default function EditProgramModal({ show, onClose, program }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        title: "",
        description: "",
        duration: "",
        benefits: [],
        is_popular: false,
        tags: [],
        cta_text: "",
        cta_color: "dark",
    });

    useEffect(() => {
        if (program) {
            setData({
                title: program.title,
                description: program.description,
                duration: program.duration,
                benefits: program.benefits || [""],
                is_popular: program.is_popular || false,
                tags: program.tags || [""],
                cta_text: program.cta_text,
                cta_color: program.cta_color,
            });
        }
    }, [program]);

    // Helper functions for dynamic inputs (sama seperti Add modal)
    const handleInputChange = (index, field, value) => {
        const updated = [...data[field]];
        updated[index] = value;
        setData(field, updated);
    };
    const handleAddItem = (field) => setData(field, [...data[field], ""]);
    const handleRemoveItem = (index, field) => {
        if (data[field].length > 1) {
            setData(
                field,
                data[field].filter((_, i) => i !== index)
            );
        }
    };

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.career-programs.update", program.id), {
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
                    Edit Program Karir
                </h2>

                {/* JSX Form di sini sama persis dengan AddProgramModal */}
                <div className="mt-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium">
                            Judul Program
                        </label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                        {errors.title && (
                            <p className="text-sm text-red-600 mt-1">
                                {errors.title}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium">
                            Deskripsi
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            rows="3"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        ></textarea>
                        {errors.description && (
                            <p className="text-sm text-red-600 mt-1">
                                {errors.description}
                            </p>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">
                                Durasi
                            </label>
                            <input
                                type="text"
                                value={data.duration}
                                onChange={(e) =>
                                    setData("duration", e.target.value)
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                placeholder="Contoh: 12 Bulan"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">
                                CTA Text
                            </label>
                            <input
                                type="text"
                                value={data.cta_text}
                                onChange={(e) =>
                                    setData("cta_text", e.target.value)
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                placeholder="Contoh: Daftar Sekarang"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">
                            Tags
                        </label>
                        {data.tags.map((tag, index) => (
                            <div key={index} className="flex items-center mt-2">
                                <input
                                    type="text"
                                    value={tag}
                                    onChange={(e) =>
                                        handleInputChange(
                                            index,
                                            "tags",
                                            e.target.value
                                        )
                                    }
                                    className="block w-full rounded-md border-gray-300 shadow-sm"
                                    placeholder="Contoh: Full-time"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleRemoveItem(index, "tags")
                                    }
                                    className="ml-2 text-red-500"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => handleAddItem("tags")}
                            className="mt-2 text-sm text-indigo-600"
                        >
                            Tambah Tag
                        </button>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">
                            Benefits
                        </label>
                        {data.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center mt-2">
                                <input
                                    type="text"
                                    value={benefit}
                                    onChange={(e) =>
                                        handleInputChange(
                                            index,
                                            "benefits",
                                            e.target.value
                                        )
                                    }
                                    className="block w-full rounded-md border-gray-300 shadow-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleRemoveItem(index, "benefits")
                                    }
                                    className="ml-2 text-red-500"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => handleAddItem("benefits")}
                            className="mt-2 text-sm text-indigo-600"
                        >
                            Tambah Benefit
                        </button>
                    </div>
                    <div className="flex items-center">
                        <input
                            id="is_popular_edit"
                            type="checkbox"
                            checked={data.is_popular}
                            onChange={(e) =>
                                setData("is_popular", e.target.checked)
                            }
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                        />
                        <label
                            htmlFor="is_popular_edit"
                            className="ml-2 block text-sm text-gray-900"
                        >
                            Jadikan Populer
                        </label>
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
                        {processing ? "Memperbarui..." : "Perbarui Program"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
