// resources/js/Pages/Admin/Internship/Projects/Partials/AddProjectModal.jsx
import Modal from "@/Components/Modal";
import { useForm } from "@inertiajs/react";

export default function AddProjectModal({ show, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: "",
        category: "",
        description: "",
        learnings: [""],
        duration: "",
        team_size: "",
    });

    const handleLearningChange = (index, value) => {
        const updatedLearnings = [...data.learnings];
        updatedLearnings[index] = value;
        setData("learnings", updatedLearnings);
    };
    const handleAddLearning = () =>
        setData("learnings", [...data.learnings, ""]);
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
        post(route("admin.internship-projects.store"), {
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
                    Tambah Proyek Baru
                </h2>
                <div>
                    <label>Judul Proyek</label>
                    <input
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
                    <label>Kategori</label>
                    <input
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
                    <label>Deskripsi</label>
                    <textarea
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
                        <label>Durasi</label>
                        <input
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
                        <label>Ukuran Tim</label>
                        <input
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
                    <label>Poin Pembelajaran</label>
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
                                className="ml-2 text-red-500"
                                disabled={data.learnings.length <= 1}
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddLearning}
                        className="mt-2 text-sm text-indigo-600"
                    >
                        Tambah Poin
                    </button>
                </div>
                <div className="mt-6 flex justify-end">
                    <button type="button" onClick={onClose} className="mr-3">
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
