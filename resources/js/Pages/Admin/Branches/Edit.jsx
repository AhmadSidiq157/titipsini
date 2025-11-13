import React from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Edit({ auth }) {
    const { branch } = usePage().props;

    const { data, setData, put, processing, errors } = useForm({
        name: branch.name || "",
        address: branch.address || "",
        phone: branch.phone || "",
        status: branch.status || "Buka",
        google_maps_embed_url: branch.google_maps_embed_url || "",
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.branches.update", branch.id));
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Edit Cabang
                </h2>
            }
        >
            <Head title="Edit Cabang" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
                            Edit Data Cabang
                        </h2>

                        <form onSubmit={submit} className="space-y-6">
                            {/* Nama Cabang */}
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Nama Cabang
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Alamat */}
                            <div>
                                <label
                                    htmlFor="address"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Alamat
                                </label>
                                <textarea
                                    id="address"
                                    rows="3"
                                    value={data.address}
                                    onChange={(e) =>
                                        setData("address", e.target.value)
                                    }
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                ></textarea>
                                {errors.address && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.address}
                                    </p>
                                )}
                            </div>

                            {/* Nomor Telepon */}
                            <div>
                                <label
                                    htmlFor="phone"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Nomor Telepon
                                </label>
                                <input
                                    id="phone"
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) =>
                                        setData("phone", e.target.value)
                                    }
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {errors.phone && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.phone}
                                    </p>
                                )}
                            </div>

                            {/* Status */}
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
                                    <option value="Buka">Buka</option>
                                    <option value="Segera Hadir">
                                        Segera Hadir
                                    </option>
                                </select>
                            </div>

                            {/* Google Maps Embed URL */}
                            <div>
                                <label
                                    htmlFor="google_maps_embed_url"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Link Google Maps Embed
                                </label>
                                <input
                                    id="google_maps_embed_url"
                                    type="text"
                                    value={data.google_maps_embed_url}
                                    onChange={(e) =>
                                        setData(
                                            "google_maps_embed_url",
                                            e.target.value
                                        )
                                    }
                                    placeholder="https://www.google.com/maps/embed?..."
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {errors.google_maps_embed_url && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.google_maps_embed_url}
                                    </p>
                                )}
                            </div>

                            {/* Tombol Aksi */}
                            <div className="flex items-center justify-end space-x-4 pt-4">
                                <Link
                                    href={route("admin.branches.index")}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {processing ? "Menyimpan..." : "Perbarui"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
