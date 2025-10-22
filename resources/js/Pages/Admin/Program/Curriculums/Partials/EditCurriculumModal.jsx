// resources/js/Pages/Admin/program/Curriculums/Partials/EditCurriculumModal.jsx
import Modal from "@/Components/Modal";
import { useForm } from "@inertiajs/react";
import { useEffect } from "react";

export default function EditCurriculumModal({ show, onClose, curriculum }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        title: "",
        icon_name: "",
        points: [],
    });

    useEffect(() => {
        if (curriculum) {
            setData({
                title: curriculum.title,
                icon_name: curriculum.icon_name,
                points: curriculum.points || [""],
            });
        }
    }, [curriculum]);

    const handlePointChange = (index, value) => {
        const updatedPoints = [...data.points];
        updatedPoints[index] = value;
        setData("points", updatedPoints);
    };
    const handleAddPoint = () => setData("points", [...data.points, ""]);
    const handleRemovePoint = (index) => {
        if (data.points.length > 1) {
            setData(
                "points",
                data.points.filter((_, i) => i !== index)
            );
        }
    };

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.curricula.update", curriculum.id), {
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
                    Edit Kurikulum
                </h2>
                {/* Form JSX disalin dari AddCurriculumModal */}
                <div>
                    <label>Judul Kurikulum</label>
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
                    <label>Nama Ikon (dari Lucide-React)</label>
                    <input
                        type="text"
                        value={data.icon_name}
                        onChange={(e) => setData("icon_name", e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        placeholder="Contoh: Library"
                    />
                    {errors.icon_name && (
                        <p className="text-sm text-red-600 mt-1">
                            {errors.icon_name}
                        </p>
                    )}
                </div>
                <div>
                    <label>Poin Materi</label>
                    {data.points.map((point, index) => (
                        <div key={index} className="flex items-center mt-2">
                            <input
                                type="text"
                                value={point}
                                onChange={(e) =>
                                    handlePointChange(index, e.target.value)
                                }
                                className="block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemovePoint(index)}
                                className="ml-2 text-red-500"
                                disabled={data.points.length <= 1}
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddPoint}
                        className="mt-2 text-sm text-indigo-600"
                    >
                        Tambah Poin
                    </button>
                </div>
                <div className="mt-6 flex justify-end pt-4 border-t">
                    <button
                        type="button"
                        onClick={onClose}
                        className="mr-3 bg-gray-200 px-4 py-2 rounded-md"
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
