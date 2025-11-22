import React, { useState, useEffect } from "react";
// Ganti import alias dengan path relatif atau komponen yang tersedia
import Modal from "@/Components/Modal";
import { Link, usePage } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import axios from "axios";
import {
    Check,
    X,
    Truck,
    Box,
    ArrowRight,
    Clock,
    Calendar,
    Building2,
    Calculator,
    Camera,
    Info,
} from "lucide-react";

// --- Helper Format Rupiah ---
const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(number || 0);
};

// --- Sub-Komponen: Loading ---
const StepLoading = () => (
    <div className="p-8 flex flex-col items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
        <p className="text-gray-600 animate-pulse">Memuat detail layanan...</p>
    </div>
);

// --- Sub-Komponen: Step 1 (Formulir Data) ---
const StepForm = ({ product, productModelClass, onFormSubmit }) => {
    // Mengambil data cabang dari props global (HandleInertiaRequests)
    const { branches } = usePage().props;

    const isPindahan = productModelClass.includes("MovingPackage");

    // Inisialisasi Data Form
    const initialData = isPindahan
        ? {
              branch_id: "",
              tanggal_pindahan: "",
              telepon: "",
              alamat_penjemputan: "",
              alamat_tujuan: "",
              notes: "",
          }
        : {
              branch_id: "",
              delivery_method: "drop_off",
              start_date: new Date().toISOString().split("T")[0], // Default hari ini
              duration_value: 1,
              duration_unit: "day",
              notes: "",
              item_photo: null,
              alamat_penjemputan: "", // Default kosong
              telepon: "", // Default kosong
          };

    const [data, setData] = useState(initialData);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [photoPreview, setPhotoPreview] = useState(null);

    // State untuk harga yang berubah-ubah (khusus penitipan)
    const [estimatedTotal, setEstimatedTotal] = useState(
        parseFloat(product.price) || 0
    );

    // --- LOGIKA KALKULASI HARGA ---
    useEffect(() => {
        if (!isPindahan) {
            const basePrice = parseFloat(product.price) || 0;
            const duration = parseFloat(data.duration_value) || 0;
            let multiplier = 1;

            // Asumsi: product.price adalah harga dasar per HARI
            switch (data.duration_unit) {
                case "hour":
                    // Contoh: Harga per jam adalah 10% dari harga harian
                    multiplier = 0.1;
                    break;
                case "day":
                    multiplier = 1;
                    break;
                case "week":
                    // Contoh: Seminggu dihitung 6 hari (Diskon)
                    multiplier = 6;
                    break;
                case "month":
                    // Contoh: Sebulan dihitung 25 hari (Diskon Besar)
                    multiplier = 25;
                    break;
                default:
                    multiplier = 1;
            }

            const total = Math.round(basePrice * duration * multiplier);
            setEstimatedTotal(total);
        } else {
            // Untuk pindahan, harga tetap sesuai paket
            setEstimatedTotal(parseFloat(product.price) || 0);
        }
    }, [data.duration_value, data.duration_unit, product.price, isPindahan]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
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

        // Validasi Manual Sederhana di Client Side

        // 1. Validasi Cabang (Hanya wajib untuk penitipan)
        if (!isPindahan && !data.branch_id) {
            setErrors({
                "form_details.branch_id": [
                    "Silakan pilih cabang terlebih dahulu.",
                ],
            });
            setProcessing(false);
            return;
        }

        // 2. Validasi Alamat Jemput (Hanya jika Request Jemput dipilih di Penitipan)
        if (!isPindahan && data.delivery_method === "pickup") {
            const newErrors = {};
            if (!data.alamat_penjemputan)
                newErrors["form_details.alamat_penjemputan"] = [
                    "Alamat penjemputan wajib diisi.",
                ];
            if (!data.telepon)
                newErrors["form_details.telepon"] = ["Nomor HP wajib diisi."];

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                setProcessing(false);
                return;
            }
        }

        const formData = new FormData();
        formData.append("product_id", product.id);
        formData.append("product_model", productModelClass);
        // Kirim total yang sudah dihitung agar backend tahu
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
                if (error.response && error.response.status === 422) {
                    setErrors(error.response.data.errors);
                } else {
                    alert("Terjadi kesalahan saat membuat pesanan.");
                    console.error(error);
                }
            })
            .finally(() => {
                setProcessing(false);
            });
    };

    return (
        <form onSubmit={submit} className="p-6 md:p-8">
            {/* Header Modal */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-extrabold text-gray-900">
                    Detail Pemesanan
                </h2>
                <div className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold uppercase rounded-full">
                    Langkah 1/3
                </div>
            </div>

            {/* Kartu Info Produk & Harga */}
            <div className="mb-8 bg-gradient-to-br from-gray-50 to-white p-5 rounded-2xl border border-emerald-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md ${
                            isPindahan ? "bg-emerald-600" : "bg-emerald-500"
                        }`}
                    >
                        {isPindahan ? <Truck size={24} /> : <Box size={24} />}
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-gray-800">
                            {product.name || product.title}
                        </h4>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                            {isPindahan
                                ? "Paket Pindahan"
                                : "Layanan Penitipan"}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-400 font-medium uppercase">
                        Estimasi Biaya
                    </p>
                    <p className="text-xl font-bold text-emerald-600">
                        {formatRupiah(estimatedTotal)}
                    </p>
                </div>
            </div>

            {/* --- INPUT CABANG (Hanya Tampil Jika BUKAN Pindahan / Khusus Penitipan) --- */}
            {!isPindahan && (
                <div className="mb-6">
                    <InputLabel
                        htmlFor="branch_id"
                        value="Pilih Lokasi Cabang"
                    />
                    <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Building2 className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                            name="branch_id"
                            value={data.branch_id}
                            onChange={handleChange}
                            className="pl-10 block w-full border-gray-300 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 shadow-sm text-sm bg-white"
                            required={!isPindahan}
                        >
                            <option value="">
                                -- Pilih Cabang Terdekat --
                            </option>
                            {branches && branches.length > 0 ? (
                                branches.map((branch) => (
                                    <option key={branch.id} value={branch.id}>
                                        {/* [FIX] Menampilkan Nama Cabang dan Alamat tanpa tanda kurung aneh */}
                                        {branch.name} - {branch.address}
                                    </option>
                                ))
                            ) : (
                                <option disabled>Tidak ada data cabang</option>
                            )}
                        </select>
                    </div>
                    <InputError
                        message={errors["form_details.branch_id"]?.[0]}
                        className="mt-1"
                    />
                </div>
            )}

            {isPindahan ? (
                // --- FORM KHUSUS PINDAHAN ---
                <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <InputLabel
                                htmlFor="tanggal_pindahan"
                                value="Tanggal Pindahan"
                            />
                            <input
                                type="date"
                                name="tanggal_pindahan"
                                value={data.tanggal_pindahan}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
                                required
                            />
                            <InputError
                                message={
                                    errors["form_details.tanggal_pindahan"]?.[0]
                                }
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="telepon"
                                value="No. HP di Lokasi"
                            />
                            <input
                                type="tel"
                                name="telepon"
                                value={data.telepon}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
                                placeholder="08..."
                                required
                            />
                            <InputError
                                message={errors["form_details.telepon"]?.[0]}
                                className="mt-1"
                            />
                        </div>
                    </div>
                    <div>
                        <InputLabel
                            htmlFor="alamat_penjemputan"
                            value="Alamat Penjemputan"
                        />
                        <textarea
                            name="alamat_penjemputan"
                            value={data.alamat_penjemputan}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
                            rows="2"
                            placeholder="Alamat lengkap..."
                            required
                        ></textarea>
                        <InputError
                            message={
                                errors["form_details.alamat_penjemputan"]?.[0]
                            }
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <InputLabel
                            htmlFor="alamat_tujuan"
                            value="Alamat Tujuan"
                        />
                        <textarea
                            name="alamat_tujuan"
                            value={data.alamat_tujuan}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
                            rows="2"
                            placeholder="Alamat lengkap..."
                            required
                        ></textarea>
                        <InputError
                            message={errors["form_details.alamat_tujuan"]?.[0]}
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <InputLabel
                            htmlFor="notes"
                            value="Catatan (Opsional)"
                        />
                        <textarea
                            name="notes"
                            value={data.notes}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
                            rows="2"
                            placeholder="Info tambahan (misal: lantai 2, gang sempit)"
                        ></textarea>
                    </div>
                </div>
            ) : (
                // --- FORM KHUSUS PENITIPAN (Durasi & Foto) ---
                <div className="space-y-6">
                    {/* Pilihan Metode Penyerahan */}
                    <div>
                        <InputLabel
                            value="Metode Penyerahan Barang"
                            className="mb-2"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <div
                                onClick={() =>
                                    setData((prev) => ({
                                        ...prev,
                                        delivery_method: "drop_off",
                                    }))
                                }
                                className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center text-center transition-all ${
                                    data.delivery_method === "drop_off"
                                        ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500"
                                        : "border-gray-200 hover:border-emerald-300"
                                }`}
                            >
                                <Box
                                    className={`w-6 h-6 mb-2 ${
                                        data.delivery_method === "drop_off"
                                            ? "text-emerald-600"
                                            : "text-gray-400"
                                    }`}
                                />
                                <span
                                    className={`font-bold text-sm ${
                                        data.delivery_method === "drop_off"
                                            ? "text-emerald-700"
                                            : "text-gray-600"
                                    }`}
                                >
                                    Antar Sendiri
                                </span>
                            </div>
                            <div
                                onClick={() =>
                                    setData((prev) => ({
                                        ...prev,
                                        delivery_method: "pickup",
                                    }))
                                }
                                className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center text-center transition-all ${
                                    data.delivery_method === "pickup"
                                        ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500"
                                        : "border-gray-200 hover:border-emerald-300"
                                }`}
                            >
                                <Truck
                                    className={`w-6 h-6 mb-2 ${
                                        data.delivery_method === "pickup"
                                            ? "text-emerald-600"
                                            : "text-gray-400"
                                    }`}
                                />
                                <span
                                    className={`font-bold text-sm ${
                                        data.delivery_method === "pickup"
                                            ? "text-emerald-700"
                                            : "text-gray-600"
                                    }`}
                                >
                                    Request Jemput
                                </span>
                            </div>
                        </div>
                        <InputError
                            message={
                                errors["form_details.delivery_method"]?.[0]
                            }
                            className="mt-1"
                        />
                    </div>

                    {/* [FIX] INPUT LOKASI & HP JIKA PILIH PICKUP */}
                    {data.delivery_method === "pickup" && (
                        <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-100 space-y-4 animate-in fade-in slide-in-from-top-2">
                            <div className="flex items-center gap-2 text-emerald-700 font-bold mb-2 border-b border-emerald-200 pb-2">
                                <Truck className="w-5 h-5" />
                                <span>Detail Penjemputan</span>
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="alamat_penjemputan"
                                    value="Alamat Lengkap Penjemputan"
                                />
                                <textarea
                                    name="alamat_penjemputan"
                                    value={data.alamat_penjemputan}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border-gray-300 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
                                    rows="2"
                                    placeholder="Nama Jalan, Nomor Rumah, RT/RW..."
                                    required
                                ></textarea>
                                <InputError
                                    message={
                                        errors[
                                            "form_details.alamat_penjemputan"
                                        ]?.[0]
                                    }
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="telepon"
                                    value="No. HP / WhatsApp yang bisa dihubungi"
                                />
                                <input
                                    type="tel"
                                    name="telepon"
                                    value={data.telepon}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border-gray-300 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
                                    placeholder="Contoh: 081234567890"
                                    required
                                />
                                <InputError
                                    message={
                                        errors["form_details.telepon"]?.[0]
                                    }
                                    className="mt-1"
                                />
                            </div>
                        </div>
                    )}
                    {/* ------------------------------------------ */}

                    {/* Kalkulator Durasi */}
                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-2 mb-4 text-gray-700 font-semibold">
                            <Clock className="w-4 h-4" />
                            <span>Pilih Durasi Penitipan</span>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-3">
                                <label className="text-xs text-gray-500 font-bold uppercase">
                                    Mulai Tanggal
                                </label>
                                <input
                                    type="date"
                                    name="start_date"
                                    value={data.start_date}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border-gray-300 rounded-lg text-sm focus:ring-emerald-500 focus:border-emerald-500"
                                    required
                                />
                            </div>

                            <div className="col-span-1">
                                <label className="text-xs text-gray-500 font-bold uppercase">
                                    Lama
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    name="duration_value"
                                    value={data.duration_value}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border-gray-300 rounded-lg text-sm text-center focus:ring-emerald-500 focus:border-emerald-500"
                                    required
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="text-xs text-gray-500 font-bold uppercase">
                                    Satuan
                                </label>
                                <select
                                    name="duration_unit"
                                    value={data.duration_unit}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border-gray-300 rounded-lg text-sm focus:ring-emerald-500 focus:border-emerald-500"
                                >
                                    <option value="hour">Jam</option>
                                    <option value="day">Hari</option>
                                    <option value="week">Minggu</option>
                                    <option value="month">Bulan</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-3 text-xs text-emerald-600 bg-emerald-50 p-2 rounded border border-emerald-100">
                            <Calculator className="w-3 h-3 flex-shrink-0" />
                            <span>
                                Harga otomatis disesuaikan dengan durasi &
                                paket.
                            </span>
                        </div>
                    </div>

                    {/* Upload Foto Barang */}
                    <div>
                        <InputLabel
                            htmlFor="item_photo"
                            value="Foto Barang (Opsional)"
                        />
                        <div className="mt-2">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-emerald-50 hover:border-emerald-400 transition-colors">
                                {photoPreview ? (
                                    <img
                                        src={photoPreview}
                                        alt="Preview"
                                        className="h-full object-contain rounded-lg"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Camera className="w-8 h-8 text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-500">
                                            Klik untuk upload foto
                                        </p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    name="item_photo"
                                    id="item_photo"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>
                        <InputError
                            message={errors["form_details.item_photo"]?.[0]}
                            className="mt-1"
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <InputLabel htmlFor="notes" value="Deskripsi Barang" />
                        <textarea
                            name="notes"
                            value={data.notes}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
                            rows="2"
                            placeholder="Contoh: 2 Koper Merah, 1 Kardus Buku"
                        ></textarea>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-end mt-8 pt-6 border-t border-gray-100">
                <PrimaryButton
                    disabled={processing}
                    className="w-full sm:w-auto justify-center py-3 text-base font-bold rounded-xl shadow-lg shadow-emerald-200 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                    Lanjut Pembayaran <ArrowRight className="ml-2 w-4 h-4" />
                </PrimaryButton>
            </div>
        </form>
    );
};

// --- Sub-Komponen: Step 2 (Pembayaran) ---
const StepPayment = ({ order, onPaymentSubmit }) => {
    const [data, setData] = useState({ payment_proof: null, notes: "" });
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const handleFileChange = (e) =>
        setData((prev) => ({ ...prev, payment_proof: e.target.files[0] }));
    const handleNotesChange = (e) =>
        setData((prev) => ({ ...prev, notes: e.target.value }));

    const submit = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        const formData = new FormData();
        formData.append("payment_proof", data.payment_proof);
        formData.append("notes", data.notes);
        formData.append("_method", "POST");

        axios
            .post(route("order.submitPayment", order.id), formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((response) => onPaymentSubmit(response.data.orderStatus))
            .catch((error) => {
                if (error.response?.status === 422)
                    setErrors(error.response.data.errors);
                else alert("Gagal submit pembayaran.");
            })
            .finally(() => setProcessing(false));
    };

    return (
        <form onSubmit={submit} className="p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
                Langkah 2: Pembayaran
            </h2>
            <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">Total Tagihan</span>
                    <span className="font-bold text-2xl text-emerald-600">
                        {formatRupiah(order.final_amount)}
                    </span>
                </div>
                <div className="pt-4 border-t border-emerald-200">
                    <p className="text-sm text-gray-500 mb-1">
                        Transfer ke Rekening BCA:
                    </p>
                    <p className="font-mono font-bold text-lg text-gray-800 bg-white p-2 rounded border inline-block">
                        1234-567-890
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        a/n Titipsini Indonesia
                    </p>
                </div>
            </div>
            <div className="space-y-5">
                <div>
                    <InputLabel
                        htmlFor="payment_proof"
                        value="Upload Bukti Transfer"
                    />
                    <input
                        id="payment_proof"
                        type="file"
                        className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
                        onChange={handleFileChange}
                        required
                    />
                    <InputError
                        message={errors.payment_proof?.[0]}
                        className="mt-1"
                    />
                </div>
                <div>
                    <InputLabel
                        htmlFor="notes"
                        value="Catatan Pembayaran (Opsional)"
                    />
                    <textarea
                        id="notes"
                        value={data.notes}
                        className="mt-1 block w-full border-gray-300 rounded-xl"
                        rows="2"
                        onChange={handleNotesChange}
                        placeholder="Contoh: Atas nama Budi"
                    ></textarea>
                </div>
            </div>
            <div className="flex items-center justify-end mt-8 pt-6 border-t border-gray-100">
                <PrimaryButton
                    disabled={processing}
                    className="w-full sm:w-auto justify-center py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700"
                >
                    Kirim Bukti Bayar
                </PrimaryButton>
            </div>
        </form>
    );
};

// --- Sub-Komponen: Step 3 (Sukses) ---
const StepSuccess = ({ orderId, initialStatus, onClose }) => {
    const [status, setStatus] = useState(initialStatus);
    useEffect(() => {
        if (status !== "awaiting_verification") return;
        const interval = setInterval(() => {
            axios
                .get(route("order.status", orderId))
                .then((response) => {
                    if (response.data.status !== "awaiting_verification") {
                        setStatus(response.data.status);
                        clearInterval(interval);
                    }
                })
                .catch(() => clearInterval(interval));
        }, 3000);
        return () => clearInterval(interval);
    }, [status, orderId]);

    if (status === "awaiting_verification") {
        return (
            <div className="p-8 text-center">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <Clock className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                    Pembayaran Diterima
                </h3>
                <p className="mt-2 text-gray-600">
                    Mohon tunggu, admin sedang memverifikasi bukti pembayaran
                    Anda.
                </p>
                <div className="mt-8">
                    <PrimaryButton onClick={onClose} className="bg-gray-600">
                        Tutup
                    </PrimaryButton>
                </div>
            </div>
        );
    } else {
        const isApproved = [
            "processing",
            "completed",
            "ready_for_pickup",
        ].includes(status);
        return (
            <div className="p-8 text-center">
                {isApproved ? (
                    <Check className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
                ) : (
                    <X className="w-20 h-20 text-red-500 mx-auto mb-6" />
                )}
                <h3 className="text-2xl font-bold text-gray-900">
                    {isApproved ? "Pesanan Disetujui!" : "Pembayaran Ditolak"}
                </h3>
                <p className="mt-2 text-gray-600">
                    {isApproved
                        ? "Terima kasih! Pesanan Anda sedang diproses."
                        : "Bukti pembayaran Anda tidak valid."}
                </p>
                <div className="mt-8">
                    <PrimaryButton
                        onClick={onClose}
                        className="bg-emerald-600 hover:bg-emerald-700"
                    >
                        Selesai
                    </PrimaryButton>
                </div>
            </div>
        );
    }
};

export default function OrderModal({ show, onClose, product, productType }) {
    const [step, setStep] = useState("loading");
    const [productData, setProductData] = useState(null);
    const [orderData, setOrderData] = useState(null);
    const [orderStatus, setOrderStatus] = useState(null);

    useEffect(() => {
        if (show && product) {
            setStep("loading");
            const type =
                productType === "moving_package" ? "moving_package" : "service";
            axios
                .get(route("order.create", { type, id: product.id }))
                .then((res) => {
                    setProductData({
                        product: res.data.product,
                        productModelClass: res.data.productModelClass,
                    });
                    setStep("form");
                })
                .catch(() => {
                    alert("Gagal memuat data.");
                    onClose();
                });
        }
    }, [show, product]);

    const handleFormSubmit = (newOrderData) => {
        setOrderData(newOrderData);
        setStep("payment");
    };
    const handlePaymentSubmit = (newOrderStatus) => {
        setOrderStatus(newOrderStatus);
        setStep("success");
    };

    const renderStep = () => {
        switch (step) {
            case "form":
                return productData ? (
                    <StepForm
                        product={productData.product}
                        productModelClass={productData.productModelClass}
                        onFormSubmit={handleFormSubmit}
                    />
                ) : (
                    <StepLoading />
                );
            case "payment":
                return (
                    <StepPayment
                        order={orderData}
                        onPaymentSubmit={handlePaymentSubmit}
                    />
                );
            case "success":
                return (
                    <StepSuccess
                        orderId={orderData?.id}
                        initialStatus={orderStatus}
                        onClose={onClose}
                    />
                );
            default:
                return <StepLoading />;
        }
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="xl">
            {renderStep()}
        </Modal>
    );
}
