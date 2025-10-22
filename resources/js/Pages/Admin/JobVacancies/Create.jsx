import React from "react";
// [1] Gunakan import asli dari Inertia dan layout admin
import { Head, Link, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Create({ auth }) {
    // [2] Gunakan hook useForm asli dari Inertia
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        department: "",
        location: "",
        salary_range: "",
        type: "Full-time", // Nilai default
        status: "Open", // Nilai default
        description: "",
        requirements: "",
    });

    // [3] Fungsi submit sekarang mengirim request POST nyata ke server
    const submit = (e) => {
        e.preventDefault();
        // Method post() akan mengirim data ke rute dengan nama yang diberikan
        post(route("admin.job_vacancies.store"));
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Create Job Vacancy
                </h2>
            }
        >
            <Head title="Create Job Vacancy" />
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
                            Create New Job Vacancy
                        </h2>

                        <form onSubmit={submit} className="space-y-6">
                            {/* Title */}
                            <div>
                                <label
                                    htmlFor="title"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Title
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {errors.title && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            {/* Department & Location */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label
                                        htmlFor="department"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Department
                                    </label>
                                    <input
                                        id="department"
                                        type="text"
                                        value={data.department}
                                        onChange={(e) =>
                                            setData(
                                                "department",
                                                e.target.value
                                            )
                                        }
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.department && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.department}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="location"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Location
                                    </label>
                                    <input
                                        id="location"
                                        type="text"
                                        value={data.location}
                                        onChange={(e) =>
                                            setData("location", e.target.value)
                                        }
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.location && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.location}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Type & Status */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label
                                        htmlFor="type"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Job Type
                                    </label>
                                    <select
                                        id="type"
                                        value={data.type}
                                        onChange={(e) =>
                                            setData("type", e.target.value)
                                        }
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option>Full-time</option>
                                        <option>Part-time</option>
                                        <option>Internship</option>
                                        <option>Contract</option>
                                    </select>
                                </div>
                                <div>
                                    <label
                                        htmlFor="status"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Status
                                    </label>
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) =>
                                            setData("status", e.target.value)
                                        }
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option>Open</option>
                                        <option>Urgent Hiring</option>
                                        <option>Closed</option>
                                    </select>
                                </div>
                            </div>

                            {/* Salary Range */}
                            <div>
                                <label
                                    htmlFor="salary_range"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Salary Range (Optional)
                                </label>
                                <input
                                    id="salary_range"
                                    type="text"
                                    value={data.salary_range}
                                    placeholder="e.g., Rp 5-7 juta"
                                    onChange={(e) =>
                                        setData("salary_range", e.target.value)
                                    }
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label
                                    htmlFor="description"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    rows="4"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                ></textarea>
                                {errors.description && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            {/* Requirements */}
                            <div>
                                <label
                                    htmlFor="requirements"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Requirements
                                </label>
                                <textarea
                                    id="requirements"
                                    rows="4"
                                    value={data.requirements}
                                    onChange={(e) =>
                                        setData("requirements", e.target.value)
                                    }
                                    placeholder="Separate each requirement with a comma, e.g., Skill 1, Skill 2, Skill 3"
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                ></textarea>
                                {errors.requirements && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.requirements}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-end space-x-4 pt-4">
                                <Link
                                    href={route("admin.job_vacancies.index")}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing} // Tombol nonaktif saat request diproses
                                    className="px-4 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {processing
                                        ? "Saving..."
                                        : "Create Vacancy"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
