import Modal from "@/Components/Modal";
import { useForm } from "@inertiajs/react";
import { useEffect } from "react";

export default function EditProjectModal({ show, onClose, project }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        title: "",
        category: "",
        description: "",
        learnings: [],
        duration: "",
        team_size: "",
    });

    // Mengisi form dengan data proyek yang ada saat modal dibuka
    useEffect(() => {
        if (project) {
            setData({
                title: project.title,
                category: project.category,
                description: project.description,
                learnings: project.learnings || [""], // Pastikan minimal ada satu input
                duration: project.duration,
                team_size: project.team_size,
            });
        }
    }, [project]);

    // Fungsi untuk mengelola input 'learnings' yang dinamis
    const handleLearningChange = (index, value) => {
        const updatedLearnings = [...data.learnings];
        updatedLearnings[index] = value;
        setData("learnings", updatedLearnings);
    };

    const handleAddLearning = () => {
        setData("learnings", [...data.learnings, ""]);
    };

    const handleRemoveLearning = (index) => {
        if (data.learnings.length > 1) {
            setData(
                "learnings",
                data.learnings.filter((_, i) => i !== index)
            );
        }
    };

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.internship-projects.update", project.id), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose}>
            <form onSubmit={submit} className="p-6 space-y-4">
                <h2 className="text-xl font-bold text-gray-900">
                    Edit Proyek Magang
                </h2>

                <div>
                    <label
                        htmlFor="title_edit"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Judul Proyek
                    </label>
                    <input
                        id="title_edit"
                        type="text"
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
                        htmlFor="category_edit"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Kategori
                    </label>
                    <input
                        id="category_edit"
                        type="text"
                        value={data.category}
                        onChange={(e) => setData("category", e.target.value)}
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
                        onChange={(e) => setData("description", e.target.value)}
                        rows="3"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    ></textarea>
                    {errors.description && (
                        <p className="text-sm text-red-600 mt-1">
                            {errors.description}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label
                            htmlFor="duration_edit"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Durasi
                        </label>
                        <input
                            id="duration_edit"
                            type="text"
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
                            htmlFor="team_size_edit"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Ukuran Tim
                        </label>
                        <input
                            id="team_size_edit"
                            type="text"
                            value={data.team_size}
                            onChange={(e) =>
                                setData("team_size", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        {errors.team_size && (
                            <p className="text-sm text-red-600 mt-1">
                                {errors.team_size}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Poin Pembelajaran
                    </label>
                    {data.learnings.map((learning, index) => (
                        <div key={index} className="flex items-center mt-2">
                            <input
                                type="text"
                                value={learning}
                                onChange={(e) =>
                                    handleLearningChange(index, e.target.value)
                                }
                                className="block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveLearning(index)}
                                className="ml-2 text-red-500 hover:text-red-700"
                                disabled={data.learnings.length <= 1}
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddLearning}
                        className="mt-2 text-sm text-indigo-600 hover:text-indigo-900"
                    >
                        Tambah Poin
                    </button>
                </div>

                <div className="mt-6 flex justify-end border-t pt-6">
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
                        {processing ? "Memperbarui..." : "Perbarui Proyek"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
