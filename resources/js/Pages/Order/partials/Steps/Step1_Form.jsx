import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import axios from "axios";
import {
    Truck,
    Box,
    Building2,
    Calculator,
    Camera,
    ArrowRight,
    MapPin,
    CheckCircle2,
    Calendar,
    Clock,
} from "lucide-react";

// Helper Format Rupiah
const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(number || 0);
};

export default function StepForm({ product, productModelClass, onFormSubmit }) {
    // Ambil data branches dari global props
    const { branches } = usePage().props;
    const isPindahan = productModelClass.includes("MovingPackage");

    // Data Awal
    const initialData = isPindahan
        ? {
              tanggal_pindahan: "",
              telepon: "",
              alamat_penjemputan: "",
              alamat_tujuan: "",
              notes: "",
          }
        : {
              branch_id: "",
              delivery_method: "drop_off",
              start_date: new Date().toISOString().split("T")[0],
              duration_value: 1,
              duration_unit: "day",
              notes: "",
              item_photo: null,
              alamat_penjemputan: "",
              telepon: "",
          };

    const [data, setData] = useState(initialData);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [photoPreview, setPhotoPreview] = useState(null);

    // State Kalkulasi Harga
    const [estimatedTotal, setEstimatedTotal] = useState(
        parseFloat(product.price) || 0
    );

    // --- LOGIKA HITUNG HARGA (PENITIPAN) ---
    useEffect(() => {
        if (!isPindahan) {
            const basePrice = parseFloat(product.price) || 0;
            const duration = parseFloat(data.duration_value) || 0;
            let multiplier = 1;

            switch (data.duration_unit) {
                case "hour":
                    multiplier = 0.1;
                    break;
                case "day":
                    multiplier = 1;
                    break;
                case "week":
                    multiplier = 6;
                    break; // Diskon mingguan
                case "month":
                    multiplier = 25;
                    break; // Diskon bulanan
                default:
                    multiplier = 1;
            }

            const total = Math.round(basePrice * duration * multiplier);
            setEstimatedTotal(total);
        } else {
            setEstimatedTotal(parseFloat(product.price) || 0);
        }
    }, [data.duration_value, data.duration_unit, product.price, isPindahan]);

    // Handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const selectBranch = (id) => {
        setData((prev) => ({ ...prev, branch_id: id }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData((prev) => ({ ...prev, item_photo: file }));
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        // Validasi Manual Client Side
        if (!isPindahan && !data.branch_id) {
            setErrors({
                "form_details.branch_id": [
                    "Wajib memilih lokasi cabang penyimpanan.",
                ],
            });
            setProcessing(false);
            return;
        }

        if (
            !isPindahan &&
            data.delivery_method === "pickup" &&
            !data.alamat_penjemputan
        ) {
            setErrors({
                "form_details.alamat_penjemputan": [
                    "Alamat penjemputan wajib diisi.",
                ],
            });
            setProcessing(false);
            return;
        }

        const formData = new FormData();
        formData.append("product_id", product.id);
        formData.append("product_model", productModelClass);
        formData.append("final_amount", estimatedTotal);

        Object.keys(data).forEach((key) => {
            const val = data[key] === null ? "" : data[key];
            formData.append(`form_details[${key}]`, val);
        });

        axios
            .post(route("order.store"), formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((response) => {
                onFormSubmit(response.data.order);
            })
            .catch((error) => {
                if (error.response?.status === 422) {
                    setErrors(error.response.data.errors);
                } else {
                    alert("Terjadi kesalahan sistem.");
                }
            })
            .finally(() => setProcessing(false));
    };

    return (
        <form onSubmit={submit} className="p-6 md:p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                        Detail Pesanan
                    </h2>
                    <p className="text-sm text-gray-500">
                        Lengkapi data untuk melanjutkan
                    </p>
                </div>
                <div className="px-4 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                    Step 1/3
                </div>
            </div>

            {/* PRODUCT CARD (Futuristic Glassmorphism Style) */}
            <div className="relative overflow-hidden rounded-3xl bg-gray-900 text-white shadow-2xl shadow-gray-200">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-emerald-500 rounded-full blur-3xl opacity-20"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-20"></div>

                <div className="relative p-6 flex items-center justify-between z-10">
                    <div className="flex items-center gap-5">
                        <div
                            className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg border border-white/10 ${
                                isPindahan
                                    ? "bg-blue-600/80"
                                    : "bg-emerald-600/80"
                            } backdrop-blur-md`}
                        >
                            {isPindahan ? (
                                <Truck size={32} className="text-white" />
                            ) : (
                                <Box size={32} className="text-white" />
                            )}
                        </div>
                        <div>
                            <h4 className="text-xl font-bold">
                                {product.name || product.title}
                            </h4>
                            <p className="text-white/60 text-sm font-medium uppercase tracking-widest mt-1">
                                {isPindahan
                                    ? "Moving Service"
                                    : "Storage Service"}
                            </p>
                        </div>
                    </div>
                    <div className="text-right hidden sm:block">
                        <p className="text-xs text-white/50 font-bold uppercase mb-1">
                            Total Estimasi
                        </p>
                        <p className="text-2xl font-black tracking-tight text-emerald-400">
                            {formatRupiah(estimatedTotal)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Mobile Price (Visible only on small screens) */}
            <div className="sm:hidden flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
                <span className="text-sm font-bold text-gray-500 uppercase">
                    Total Estimasi
                </span>
                <span className="text-xl font-black text-emerald-600">
                    {formatRupiah(estimatedTotal)}
                </span>
            </div>

            {/* --- FORM SECTION --- */}

            {/* 1. SELECTION CABANG (Modern Card Selection) */}
            {!isPindahan && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-5 h-5 text-gray-400" />
                        <InputLabel
                            value="Pilih Lokasi Gudang/Cabang"
                            className="!mb-0 text-base"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {branches && branches.length > 0 ? (
                            branches.map((branch) => {
                                const isSelected =
                                    parseInt(data.branch_id) === branch.id;
                                return (
                                    <div
                                        key={branch.id}
                                        onClick={() => selectBranch(branch.id)}
                                        className={`group relative cursor-pointer p-4 rounded-2xl border-2 transition-all duration-300 ease-in-out ${
                                            isSelected
                                                ? "border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-100"
                                                : "border-gray-100 bg-white hover:border-emerald-200 hover:bg-gray-50"
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div
                                                className={`mt-1 p-2 rounded-full transition-colors ${
                                                    isSelected
                                                        ? "bg-emerald-500 text-white"
                                                        : "bg-gray-100 text-gray-400 group-hover:bg-white"
                                                }`}
                                            >
                                                <MapPin size={18} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center">
                                                    <h5
                                                        className={`font-bold text-sm ${
                                                            isSelected
                                                                ? "text-gray-900"
                                                                : "text-gray-700"
                                                        }`}
                                                    >
                                                        {branch.name}
                                                    </h5>
                                                    {isSelected && (
                                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 animate-in zoom-in" />
                                                    )}
                                                </div>
                                                {/* TRUNCATE ADDRESS AGAR TIDAK KEPANJANGAN */}
                                                <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
                                                    {branch.address ||
                                                        "Alamat belum diatur"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center p-6 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                <span className="text-gray-400 text-sm">
                                    Tidak ada data cabang tersedia.
                                </span>
                            </div>
                        )}
                    </div>
                    <InputError
                        message={errors["form_details.branch_id"]?.[0]}
                    />
                </div>
            )}

            {/* 2. DURATION CALCULATOR (Modern Inputs) */}
            {!isPindahan && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Calculator className="w-5 h-5 text-gray-400" />
                        <InputLabel
                            value="Durasi & Waktu Titip"
                            className="!mb-0 text-base"
                        />
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Tanggal */}
                        <div className="relative">
                            <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">
                                Mulai Tanggal
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="date"
                                    name="start_date"
                                    value={data.start_date}
                                    onChange={handleChange}
                                    className="pl-10 w-full border-gray-200 bg-gray-50 rounded-xl text-sm font-medium focus:ring-emerald-500 focus:border-emerald-500 py-3"
                                />
                            </div>
                        </div>

                        {/* Durasi */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">
                                    Lama
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    name="duration_value"
                                    value={data.duration_value}
                                    onChange={handleChange}
                                    className="w-full text-center border-gray-200 bg-gray-50 rounded-xl text-sm font-bold focus:ring-emerald-500 focus:border-emerald-500 py-3"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">
                                    Satuan
                                </label>
                                <select
                                    name="duration_unit"
                                    value={data.duration_unit}
                                    onChange={handleChange}
                                    className="w-full border-gray-200 bg-gray-50 rounded-xl text-sm font-medium focus:ring-emerald-500 focus:border-emerald-500 py-3"
                                >
                                    <option value="hour">Jam</option>
                                    <option value="day">Hari</option>
                                    <option value="week">Minggu</option>
                                    <option value="month">Bulan</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. DELIVERY METHOD (Toggle Cards) */}
            {!isPindahan && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Truck className="w-5 h-5 text-gray-400" />
                        <InputLabel
                            value="Metode Penyerahan Barang"
                            className="!mb-0 text-base"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div
                            onClick={() =>
                                setData((prev) => ({
                                    ...prev,
                                    delivery_method: "drop_off",
                                }))
                            }
                            className={`cursor-pointer rounded-2xl p-4 border-2 flex flex-col items-center justify-center text-center transition-all ${
                                data.delivery_method === "drop_off"
                                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                    : "border-gray-200 text-gray-500 hover:border-emerald-200"
                            }`}
                        >
                            <Box className="w-6 h-6 mb-2" />
                            <span className="font-bold text-sm">
                                Antar Sendiri
                            </span>
                            <span className="text-[10px] mt-1 opacity-70">
                                Datang ke lokasi kami
                            </span>
                        </div>
                        <div
                            onClick={() =>
                                setData((prev) => ({
                                    ...prev,
                                    delivery_method: "pickup",
                                }))
                            }
                            className={`cursor-pointer rounded-2xl p-4 border-2 flex flex-col items-center justify-center text-center transition-all ${
                                data.delivery_method === "pickup"
                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                    : "border-gray-200 text-gray-500 hover:border-blue-200"
                            }`}
                        >
                            <Truck className="w-6 h-6 mb-2" />
                            <span className="font-bold text-sm">
                                Request Jemput
                            </span>
                            <span className="text-[10px] mt-1 opacity-70">
                                Kurir kami ke lokasi Anda
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* 4. CONDITIONAL PICKUP FORM */}
            {!isPindahan && data.delivery_method === "pickup" && (
                <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 space-y-4 animate-in slide-in-from-top-2">
                    <div>
                        <label className="text-xs font-bold text-blue-700 uppercase mb-1 block">
                            Alamat Penjemputan
                        </label>
                        <textarea
                            name="alamat_penjemputan"
                            value={data.alamat_penjemputan}
                            onChange={handleChange}
                            rows="2"
                            placeholder="Contoh: Jl. Mawar No. 12, Pagar Hitam..."
                            className="w-full border-blue-200 rounded-xl text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                        ></textarea>
                        <InputError
                            message={
                                errors["form_details.alamat_penjemputan"]?.[0]
                            }
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-blue-700 uppercase mb-1 block">
                            Kontak di Lokasi
                        </label>
                        <input
                            type="tel"
                            name="telepon"
                            value={data.telepon}
                            onChange={handleChange}
                            placeholder="08xxxxxxxx"
                            className="w-full border-blue-200 rounded-xl text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                        />
                    </div>
                </div>
            )}

            {/* 5. UPLOAD FOTO (Modern Dashed Box) */}
            {!isPindahan && (
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Camera className="w-5 h-5 text-gray-400" />
                        <InputLabel
                            value="Foto Barang (Opsional)"
                            className="!mb-0 text-base"
                        />
                    </div>
                    <label className="group flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50 hover:bg-emerald-50 hover:border-emerald-400 transition-all overflow-hidden relative">
                        {photoPreview ? (
                            <>
                                <img
                                    src={photoPreview}
                                    alt="Preview"
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                    Ganti Foto
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <div className="p-3 bg-white rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                                    <Camera className="w-6 h-6 text-gray-400" />
                                </div>
                                <p className="mb-1 text-sm text-gray-500">
                                    <span className="font-semibold text-emerald-600">
                                        Klik upload
                                    </span>{" "}
                                    atau drag & drop
                                </p>
                                <p className="text-xs text-gray-400">
                                    PNG, JPG (MAX. 2MB)
                                </p>
                            </div>
                        )}
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </label>
                </div>
            )}

            {/* FORM KHUSUS PINDAHAN (Simplifikasi) */}
            {isPindahan && (
                <div className="space-y-4 bg-gray-50 p-5 rounded-2xl border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <InputLabel value="Tanggal Rencana" />
                            <input
                                type="date"
                                name="tanggal_pindahan"
                                value={data.tanggal_pindahan}
                                onChange={handleChange}
                                className="mt-1 w-full border-gray-300 rounded-xl"
                            />
                        </div>
                        <div>
                            <InputLabel value="Nomor WhatsApp" />
                            <input
                                type="tel"
                                name="telepon"
                                value={data.telepon}
                                onChange={handleChange}
                                className="mt-1 w-full border-gray-300 rounded-xl"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <textarea
                            name="alamat_penjemputan"
                            value={data.alamat_penjemputan}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Alamat Asal"
                            className="w-full border-gray-300 rounded-xl"
                        ></textarea>
                        <textarea
                            name="alamat_tujuan"
                            value={data.alamat_tujuan}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Alamat Tujuan"
                            className="w-full border-gray-300 rounded-xl"
                        ></textarea>
                    </div>
                </div>
            )}

            {/* FOOTER ACTION */}
            <div className="pt-4 border-t border-gray-100">
                <PrimaryButton
                    disabled={processing}
                    className="w-full justify-center py-4 text-base font-bold rounded-xl shadow-xl shadow-emerald-200 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transform hover:-translate-y-1 transition-all"
                >
                    {processing ? (
                        "Memproses..."
                    ) : (
                        <span className="flex items-center">
                            Lanjut Pembayaran{" "}
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </span>
                    )}
                </PrimaryButton>
            </div>
        </form>
    );
}
