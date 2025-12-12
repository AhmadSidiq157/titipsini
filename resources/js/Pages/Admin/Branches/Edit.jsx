import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Save, ArrowLeft } from "lucide-react"; // Hapus import Search & Loader2 karena gak dipake

export default function Edit({ auth, branch }) {
    // 1. Load data lama
    const { data, setData, put, processing, errors } = useForm({
        name: branch.name || "",
        address: branch.address || "",
        phone: branch.phone || "",
        status: branch.status || "Buka",
        latitude: branch.latitude || "", // Manual Input
        longitude: branch.longitude || "", // Manual Input
        google_maps_embed_url: branch.google_maps_embed_url || "", // Manual Input (Ditampilkan)
    });

    // Hapus fungsi handleAutoGenerate karena kita pakai cara manual

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.branches.update", branch.id));
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <div className="font-semibold text-xl text-gray-800 leading-tight">
                    Edit Cabang
                </div>
            }
        >
            <Head title="Edit Cabang" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-semibold text-gray-700">
                                Edit Data Cabang
                            </h2>
                            <Link
                                href={route("admin.branches.index")}
                                className="text-gray-500 hover:text-gray-800 flex items-center gap-1 text-sm"
                            >
                                <ArrowLeft size={16} /> Kembali
                            </Link>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            {/* Nama Cabang */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Nama Cabang
                                </label>
                                <input
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
                                <label className="block text-sm font-medium text-gray-700">
                                    Alamat Lengkap
                                </label>
                                <textarea
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

                            {/* INPUT MANUAL KOORDINAT */}
                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <div className="col-span-2 text-sm text-gray-500 mb-1 font-semibold">
                                    * Data Koordinat (Ambil dari Google Maps)
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase">
                                        Latitude
                                    </label>
                                    <input
                                        type="text"
                                        value={data.latitude}
                                        onChange={(e) =>
                                            setData("latitude", e.target.value)
                                        }
                                        placeholder="Contoh: -7.770287"
                                        className="mt-1 block w-full bg-white border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.latitude && (
                                        <p className="text-xs text-red-600 mt-1">
                                            Wajib diisi!
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase">
                                        Longitude
                                    </label>
                                    <input
                                        type="text"
                                        value={data.longitude}
                                        onChange={(e) =>
                                            setData("longitude", e.target.value)
                                        }
                                        placeholder="Contoh: 110.410795"
                                        className="mt-1 block w-full bg-white border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.longitude && (
                                        <p className="text-xs text-red-600 mt-1">
                                            Wajib diisi!
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Nomor Telepon */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Nomor Telepon
                                </label>
                                <input
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
                                <label className="block text-sm font-medium text-gray-700">
                                    Status Cabang
                                </label>
                                <select
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
                                    <option value="Tutup">Tutup</option>
                                </select>
                            </div>

                            {/* LINK GOOGLE MAPS (DITAMPILKAN MANUAL) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Link Embed Google Maps
                                </label>
                                <input
                                    type="text"
                                    value={data.google_maps_embed_url}
                                    onChange={(e) =>
                                        setData(
                                            "google_maps_embed_url",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Tempel link iframe src dari Google Maps di sini..."
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    * Opsional: Link ini agar peta muncul di
                                    halaman detail user.
                                </p>
                                {errors.google_maps_embed_url && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.google_maps_embed_url}
                                    </p>
                                )}
                            </div>

                            {/* Tombol Simpan */}
                            <div className="flex justify-end pt-4 border-t border-gray-100">
                                <Link
                                    href={route("admin.branches.index")}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 mr-3"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300 disabled:opacity-25 transition ease-in-out duration-150"
                                >
                                    {processing
                                        ? "Menyimpan..."
                                        : "Simpan Perubahan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
