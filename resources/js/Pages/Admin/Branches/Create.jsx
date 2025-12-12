import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        address: "",
        phone: "",
        latitude: "",
        longitude: "",
        status: "Buka",
        google_maps_embed_url: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.branches.store"));
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Tambah Cabang Baru
                </h2>
            }
        >
            <Head title="Tambah Cabang Baru" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
                            Form Tambah Cabang
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
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
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
                                    Alamat Lengkap
                                </label>
                                <textarea
                                    id="address"
                                    rows="3"
                                    value={data.address}
                                    onChange={(e) =>
                                        setData("address", e.target.value)
                                    }
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                                ></textarea>
                                {errors.address && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.address}
                                    </p>
                                )}
                            </div>

                            {/* --- KOORDINAT (GRID) --- */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <div className="col-span-full mb-2">
                                    <h3 className="text-sm font-bold text-gray-800">
                                        Titik Koordinat (Wajib)
                                    </h3>
                                    {/* [PERBAIKAN DI SINI] Mengganti tanda '->' dengan kata biasa agar tidak error JSX */}
                                    <p className="text-xs text-gray-500">
                                        Diperlukan untuk perhitungan jarak
                                        otomatis. Ambil dari Google Maps (klik
                                        kanan lokasi lalu pilih angka
                                        koordinat).
                                    </p>
                                </div>
                                <div>
                                    <label
                                        htmlFor="latitude"
                                        className="block text-xs font-medium text-gray-700 uppercase"
                                    >
                                        Latitude
                                    </label>
                                    <input
                                        id="latitude"
                                        type="number"
                                        step="any"
                                        value={data.latitude}
                                        onChange={(e) =>
                                            setData("latitude", e.target.value)
                                        }
                                        placeholder="Contoh: -6.2088"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                    {errors.latitude && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.latitude}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="longitude"
                                        className="block text-xs font-medium text-gray-700 uppercase"
                                    >
                                        Longitude
                                    </label>
                                    <input
                                        id="longitude"
                                        type="number"
                                        step="any"
                                        value={data.longitude}
                                        onChange={(e) =>
                                            setData("longitude", e.target.value)
                                        }
                                        placeholder="Contoh: 106.8456"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                    {errors.longitude && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.longitude}
                                        </p>
                                    )}
                                </div>
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
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
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
                                    Status Cabang
                                </label>
                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={(e) =>
                                        setData("status", e.target.value)
                                    }
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                                >
                                    <option value="Buka">Buka</option>
                                    <option value="Tutup">Tutup</option>
                                    <option value="Segera Hadir">
                                        Segera Hadir
                                    </option>
                                </select>
                            </div>

                            {/* Google Maps Embed */}
                            <div>
                                <label
                                    htmlFor="google_maps_embed_url"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Link Google Maps Embed (Opsional)
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
                                    placeholder="<iframe src=...>"
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                                />
                                {errors.google_maps_embed_url && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.google_maps_embed_url}
                                    </p>
                                )}
                            </div>

                            {/* Tombol Aksi */}
                            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-100">
                                <Link
                                    href={route("admin.branches.index")}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-emerald-600 text-white font-semibold text-sm rounded-md hover:bg-emerald-700 disabled:opacity-50"
                                >
                                    {processing
                                        ? "Menyimpan..."
                                        : "Simpan Cabang"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
