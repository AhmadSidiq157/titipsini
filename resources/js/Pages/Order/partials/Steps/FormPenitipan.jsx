import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import axios from "axios";
import LiveMap from "@/Components/LiveMap";
import {
    Truck,
    Box,
    Building2,
    Calculator,
    Camera,
    ChevronDown,
    MapPin,
    Calendar as CalendarIcon,
    Bike,
    Search,
    Loader2,
    X,
    ArrowRight,
    StickyNote,
    Package, // Icon Paket
    Clock,
} from "lucide-react";

const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(number || 0);
};

export default function FormPenitipan({
    product,
    productModelClass,
    onFormSubmit,
    onPriceUpdate, // Terima props dari Parent
}) {
    const { branches, auth } = usePage().props;

    const [data, setData] = useState({
        branch_id: "",
        delivery_method: "drop_off",
        vehicle_type: "motor",
        latitude: null,
        longitude: null,
        shipping_cost: 0,
        start_date: new Date().toISOString().split("T")[0],
        duration_value: 1,
        duration_unit: "day",
        quantity: 1,
        notes: "",
        item_photo: null,
        alamat_penjemputan: auth.user.address || "",
        telepon: auth.user.phone || "",
    });

    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSearchingLoc, setIsSearchingLoc] = useState(false);

    // State Dropdown Pilihan
    const [shippingOptions, setShippingOptions] = useState([]);
    const [distanceInfo, setDistanceInfo] = useState(null);
    const [estimatedTotal, setEstimatedTotal] = useState(
        parseFloat(product.price) || 0
    );

    // State untuk Preview Gambar
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    // 1. Logic Hitung Total
    useEffect(() => {
        const basePrice = parseFloat(product.price) || 0;
        const duration =
            data.duration_value === "" ? 0 : parseFloat(data.duration_value);
        let qty = data.quantity === "" ? 1 : parseInt(data.quantity);
        if (qty < 1) qty = 1;

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
                break;
            case "month":
                multiplier = 25;
                break;
            default:
                multiplier = 1;
        }

        const servicePrice = Math.round(
            basePrice * duration * multiplier * qty
        );
        const shippingPrice = parseInt(data.shipping_cost) || 0;

        const total = servicePrice + shippingPrice;
        setEstimatedTotal(total);

        // Update Parent
        if (onPriceUpdate) {
            onPriceUpdate(total);
        }
    }, [
        data.duration_value,
        data.duration_unit,
        data.quantity,
        data.shipping_cost,
        product.price,
        onPriceUpdate,
    ]);

    // 2. Auto Update Ongkir
    useEffect(() => {
        if (
            data.delivery_method === "pickup" &&
            data.latitude &&
            data.longitude
        ) {
            calculateShippingCostBackend(
                data.latitude,
                data.longitude,
                data.vehicle_type
            );
        }
    }, [data.vehicle_type]);

    // --- Search Helper ---
    const searchAddress = async () => {
        if (!data.alamat_penjemputan) return alert("Harap isi alamat!");
        setIsSearchingLoc(true);
        try {
            let url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                data.alamat_penjemputan
            )}&limit=1&countrycodes=id`;
            let res = await fetch(url);
            let result = await res.json();

            if (result.length === 0) {
                const parts = data.alamat_penjemputan.split(",");
                if (parts.length > 1) {
                    url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                        parts.slice(0, 2).join(",") + ", Indonesia"
                    )}&limit=1&countrycodes=id`;
                    res = await fetch(url);
                    result = await res.json();
                }
            }

            if (result.length > 0) {
                const lat = parseFloat(result[0].lat);
                const lng = parseFloat(result[0].lon);
                setData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
                calculateShippingCostBackend(lat, lng, data.vehicle_type);
            } else {
                alert("Alamat tidak ditemukan.");
            }
        } catch (e) {
            console.error(e);
            alert("Gagal koneksi peta.");
        } finally {
            setIsSearchingLoc(false);
        }
    };

    // --- Backend Calculation ---
    const calculateShippingCostBackend = async (lat, lng, vehicle) => {
        try {
            const res = await axios.post(route("order.calculate_shipping"), {
                latitude: lat,
                longitude: lng,
                delivery_method: "pickup",
                vehicle_type: vehicle,
            });
            const options = res.data.options;
            setShippingOptions(options);

            if (options && options.length > 0) {
                const bestOption = options[0];
                setData((prev) => ({
                    ...prev,
                    shipping_cost: bestOption.shipping_cost,
                    branch_id: bestOption.branch.id,
                }));
                setDistanceInfo(bestOption);
            }
        } catch (e) {
            console.error(e);
        }
    };

    // --- Handlers ---
    const handleSelectBranch = (e) => {
        const branchId = parseInt(e.target.value);
        const selected = shippingOptions.find(
            (opt) => opt.branch.id === branchId
        );
        if (selected) {
            setData((prev) => ({
                ...prev,
                branch_id: selected.branch.id,
                shipping_cost: selected.shipping_cost,
            }));
            setDistanceInfo(selected);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData((prev) => ({ ...prev, item_photo: file }));
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setData((prev) => ({ ...prev, item_photo: null }));
        setPreviewUrl(null);
    };

    const submit = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        if (data.delivery_method === "drop_off" && !data.branch_id) {
            setErrors({
                "form_details.branch_id": ["Wajib memilih lokasi cabang."],
            });
            setProcessing(false);
            return;
        }
        if (data.delivery_method === "pickup") {
            if (!data.latitude) {
                alert("Wajib hitung ongkir!");
                setProcessing(false);
                return;
            }
            if (!data.telepon) {
                setErrors({ "form_details.telepon": ["Wajib diisi."] });
                setProcessing(false);
                return;
            }
        }

        const formData = new FormData();
        formData.append("product_id", product.id);
        formData.append("product_model", productModelClass);
        formData.append("final_amount", estimatedTotal);

        Object.keys(data).forEach((key) =>
            formData.append(
                `form_details[${key}]`,
                data[key] === null ? "" : data[key]
            )
        );
        formData.append("form_details[shipping_cost]", data.shipping_cost);

        axios
            .post(route("order.store"), formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((res) => onFormSubmit(res.data.order))
            .catch((err) => {
                if (err.response?.status === 422)
                    setErrors(err.response.data.errors);
                else alert("Terjadi kesalahan.");
            })
            .finally(() => setProcessing(false));
    };

    return (
        <form onSubmit={submit} className="space-y-6 animate-in fade-in pb-10">
            {/* CSS Hack: Sembunyikan Spinner */}
            <style>{`
                input[type=number]::-webkit-inner-spin-button, 
                input[type=number]::-webkit-outer-spin-button { 
                    -webkit-appearance: none; 
                    margin: 0; 
                }
                input[type=number] {
                    -moz-appearance: textfield;
                }
            `}</style>

            {/* Total Mobile Sticky */}
            <div className="sm:hidden flex justify-between items-center bg-white/90 backdrop-blur-md p-4 rounded-xl border border-gray-200 sticky top-0 z-30 shadow-sm">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Total Estimasi
                </span>
                <span className="text-lg font-black text-emerald-600">
                    {formatRupiah(estimatedTotal)}
                </span>
            </div>

            {/* 1. Pilih Cabang */}
            {data.delivery_method === "drop_off" && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-emerald-600" />
                        <InputLabel
                            value="Pilih Lokasi Gudang"
                            className="!mb-0 text-sm font-bold text-gray-800"
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-3 max-h-52 overflow-y-auto pr-1 custom-scrollbar">
                        {branches &&
                            branches.map((branch) => (
                                <div
                                    key={branch.id}
                                    onClick={() =>
                                        setData((p) => ({
                                            ...p,
                                            branch_id: branch.id,
                                        }))
                                    }
                                    className={`cursor-pointer p-3.5 rounded-xl border transition-all flex items-center gap-3 group hover:shadow-md ${
                                        parseInt(data.branch_id) === branch.id
                                            ? "border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500"
                                            : "border-gray-200 bg-white hover:border-emerald-300"
                                    }`}
                                >
                                    <div
                                        className={`p-2 rounded-lg transition-colors ${
                                            parseInt(data.branch_id) ===
                                            branch.id
                                                ? "bg-emerald-500 text-white"
                                                : "bg-gray-100 text-gray-400 group-hover:bg-emerald-100 group-hover:text-emerald-600"
                                        }`}
                                    >
                                        <MapPin size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h5 className="font-bold text-sm text-gray-800 truncate">
                                            {branch.name}
                                        </h5>
                                        <p className="text-xs text-gray-500 truncate">
                                            {branch.address}
                                        </p>
                                    </div>
                                    {parseInt(data.branch_id) === branch.id && (
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                    )}
                                </div>
                            ))}
                    </div>
                    <InputError
                        message={errors["form_details.branch_id"]?.[0]}
                    />
                </div>
            )}

            {/* [REVISI TOTAL] Detail Pesanan: Layout Grid 2x2 yang Lega */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-emerald-600" />
                    <InputLabel
                        value="Detail Pesanan"
                        className="!mb-0 text-sm font-bold text-gray-800"
                    />
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-5 space-y-5">
                    {/* Baris 1: Mulai Tanggal & Lama Titip */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* 1. Mulai Tanggal */}
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block tracking-wider">
                                Mulai Tanggal
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                                    <CalendarIcon className="w-4 h-4" />
                                </div>
                                <input
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) =>
                                        setData((p) => ({
                                            ...p,
                                            start_date: e.target.value,
                                        }))
                                    }
                                    className="pl-10 w-full h-11 border border-gray-200 bg-gray-50 rounded-lg text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* 2. Lama Titip (Split Input: Kiri Angka | Kanan Dropdown) */}
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block tracking-wider">
                                Lama Titip
                            </label>
                            <div className="flex h-11 border border-gray-200 rounded-lg bg-gray-50 overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-transparent transition-all">
                                {/* Input Angka */}
                                <input
                                    type="number"
                                    min="1"
                                    value={data.duration_value}
                                    onChange={(e) =>
                                        setData((p) => ({
                                            ...p,
                                            duration_value: e.target.value,
                                        }))
                                    }
                                    className="w-16 border-none bg-transparent text-center font-bold text-gray-800 focus:ring-0 px-0"
                                    placeholder="1"
                                />
                                {/* Garis Pemisah */}
                                <div className="w-px bg-gray-200 my-2"></div>
                                {/* Dropdown Unit */}
                                <div className="flex-1 relative">
                                    <select
                                        value={data.duration_unit}
                                        onChange={(e) =>
                                            setData((p) => ({
                                                ...p,
                                                duration_unit: e.target.value,
                                            }))
                                        }
                                        className="w-full h-full border-none bg-transparent text-sm font-medium text-gray-600 focus:ring-0 cursor-pointer pl-3 pr-8 appearance-none"
                                    >
                                        <option value="hour">Jam</option>
                                        <option value="day">Hari</option>
                                        <option value="week">Minggu</option>
                                        <option value="month">Bulan</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-gray-100"></div>

                    {/* Baris 2: Jumlah Barang & Catatan */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* 3. Jumlah Barang */}
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block tracking-wider">
                                Jumlah Barang
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                                    <Package className="w-4 h-4" />
                                </div>
                                <input
                                    type="number"
                                    min="1"
                                    value={data.quantity}
                                    onChange={(e) =>
                                        setData((p) => ({
                                            ...p,
                                            quantity: e.target.value,
                                        }))
                                    }
                                    className="pl-10 w-full h-11 border border-gray-200 bg-gray-50 rounded-lg text-sm font-bold text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                    placeholder="1"
                                />
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-xs font-semibold text-gray-400">
                                    Unit
                                </div>
                            </div>
                        </div>

                        {/* 4. Catatan */}
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block tracking-wider">
                                Catatan (Opsional)
                            </label>
                            <div className="relative group">
                                <div className="absolute top-3.5 left-3 flex items-start pointer-events-none text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                                    <StickyNote className="w-4 h-4" />
                                </div>
                                <textarea
                                    value={data.notes}
                                    onChange={(e) =>
                                        setData((p) => ({
                                            ...p,
                                            notes: e.target.value,
                                        }))
                                    }
                                    rows="1"
                                    className="pl-10 w-full h-11 py-2.5 border border-gray-200 bg-gray-50 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none overflow-hidden placeholder-gray-400"
                                    placeholder="Cth: Barang pecah belah..."
                                    onFocus={(e) => (e.target.rows = 3)}
                                    onBlur={(e) =>
                                        !e.target.value && (e.target.rows = 1)
                                    }
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Metode Pengiriman */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <InputLabel
                        value="Metode Penyerahan"
                        className="!mb-0 text-sm font-bold text-gray-800"
                    />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div
                        onClick={() =>
                            setData((p) => ({
                                ...p,
                                delivery_method: "drop_off",
                                shipping_cost: 0,
                            }))
                        }
                        className={`cursor-pointer rounded-xl p-3 border flex flex-col items-center text-center transition-all duration-200 hover:shadow-sm ${
                            data.delivery_method === "drop_off"
                                ? "border-emerald-500 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500"
                                : "border-gray-200 bg-white text-gray-600 hover:border-emerald-300"
                        }`}
                    >
                        <div
                            className={`p-2 rounded-full mb-2 ${
                                data.delivery_method === "drop_off"
                                    ? "bg-white"
                                    : "bg-gray-100"
                            }`}
                        >
                            <Box className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-xs">Antar Sendiri</span>
                    </div>
                    <div
                        onClick={() =>
                            setData((p) => ({
                                ...p,
                                delivery_method: "pickup",
                            }))
                        }
                        className={`cursor-pointer rounded-xl p-3 border flex flex-col items-center text-center transition-all duration-200 hover:shadow-sm ${
                            data.delivery_method === "pickup"
                                ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500"
                                : "border-gray-200 bg-white text-gray-600 hover:border-blue-300"
                        }`}
                    >
                        <div
                            className={`p-2 rounded-full mb-2 ${
                                data.delivery_method === "pickup"
                                    ? "bg-white"
                                    : "bg-gray-100"
                            }`}
                        >
                            <Truck className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-xs">
                            Request Jemput
                        </span>
                    </div>
                </div>
            </div>

            {/* 4. Form Pickup */}
            {data.delivery_method === "pickup" && (
                <div className="space-y-5 bg-white p-5 rounded-xl border border-blue-100 shadow-sm animate-in slide-in-from-top-2">
                    <div className="flex items-center gap-2 text-blue-700 mb-2 pb-2 border-b border-blue-50">
                        <MapPin size={16} />
                        <span className="font-bold text-sm">
                            Detail Penjemputan
                        </span>
                    </div>

                    {/* Armada */}
                    <div>
                        <InputLabel
                            value="Pilih Armada"
                            className="text-gray-600 mb-2 text-xs uppercase"
                        />
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { id: "motor", label: "Motor", icon: Bike },
                                { id: "pickup", label: "Pickup", icon: Truck },
                                { id: "truck", label: "Truk", icon: Truck },
                            ].map((v) => (
                                <div
                                    key={v.id}
                                    onClick={() =>
                                        setData((p) => ({
                                            ...p,
                                            vehicle_type: v.id,
                                        }))
                                    }
                                    className={`cursor-pointer p-3 rounded-lg border flex flex-col items-center justify-center text-center transition-all ${
                                        data.vehicle_type === v.id
                                            ? "bg-blue-50 border-blue-500 text-blue-700 shadow-sm ring-1 ring-blue-200"
                                            : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                                    }`}
                                >
                                    <v.icon
                                        className={`w-5 h-5 mb-1 ${
                                            data.vehicle_type === v.id
                                                ? "text-blue-600"
                                                : "text-gray-400"
                                        }`}
                                    />
                                    <span className="text-[10px] font-bold uppercase">
                                        {v.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Alamat & Peta */}
                    <div>
                        <InputLabel
                            value="Alamat Lengkap"
                            className="text-gray-600 text-xs uppercase"
                        />
                        <div className="relative mt-1">
                            <textarea
                                value={data.alamat_penjemputan}
                                onChange={(e) =>
                                    setData((p) => ({
                                        ...p,
                                        alamat_penjemputan: e.target.value,
                                    }))
                                }
                                rows="2"
                                className="w-full border-gray-200 rounded-lg text-sm p-3 pr-10 shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50/50"
                                placeholder="Contoh: Jl. Malioboro No. 12..."
                            ></textarea>
                            <div className="absolute top-3 right-3 text-gray-400">
                                <MapPin size={16} />
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={searchAddress}
                            disabled={
                                isSearchingLoc || !data.alamat_penjemputan
                            }
                            className="mt-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs flex justify-center gap-2 transition-colors shadow-sm uppercase tracking-wide"
                        >
                            {isSearchingLoc ? (
                                <Loader2 className="animate-spin" size={16} />
                            ) : (
                                <Search size={16} />
                            )}{" "}
                            Cek Lokasi & Hitung Ongkir
                        </button>
                    </div>

                    {/* Peta Paten */}
                    {data.latitude && (
                        <div className="h-40 w-full rounded-lg border border-gray-200 overflow-hidden relative shadow-inner">
                            <LiveMap
                                isTracking={false}
                                lat={data.latitude}
                                lng={data.longitude}
                                onLocationSelect={() => {}}
                            />
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold shadow text-gray-700 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>{" "}
                                Lokasi OK
                            </div>
                        </div>
                    )}

                    {/* DROPDOWN PILIHAN CABANG */}
                    {shippingOptions.length > 0 && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2">
                            <InputLabel
                                value="Pilih Lokasi Penyimpanan"
                                className="text-gray-600 text-xs uppercase"
                            />
                            <select
                                value={data.branch_id}
                                onChange={handleSelectBranch}
                                className="w-full border-gray-200 rounded-lg text-sm p-2.5 shadow-sm bg-white focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                            >
                                {shippingOptions.map((opt, i) => (
                                    <option
                                        key={opt.branch.id}
                                        value={opt.branch.id}
                                    >
                                        {opt.branch.name} ({opt.distance} KM) -{" "}
                                        {formatRupiah(opt.shipping_cost)}{" "}
                                        {i === 0 ? "(Rekomendasi)" : ""}
                                    </option>
                                ))}
                            </select>
                            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 flex justify-between items-center mt-2 shadow-sm">
                                <div>
                                    <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                                        Ongkos Kirim
                                    </p>
                                    <p className="text-xs text-gray-600 font-medium">
                                        {distanceInfo?.branch?.name}
                                    </p>
                                </div>
                                <span className="font-black text-base text-emerald-600">
                                    + {formatRupiah(data.shipping_cost)}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Kontak */}
                    <div>
                        <InputLabel
                            value="Nomor WhatsApp"
                            className="text-gray-600 text-xs uppercase"
                        />
                        <input
                            type="tel"
                            value={data.telepon}
                            onChange={(e) =>
                                setData((p) => ({
                                    ...p,
                                    telepon: e.target.value,
                                }))
                            }
                            className="w-full border-gray-200 rounded-lg text-sm px-4 py-2.5 focus:ring-blue-500 focus:border-blue-500 shadow-sm bg-gray-50/50"
                            placeholder="08xxx"
                        />
                        <InputError message={errors["form_details.telepon"]} />
                    </div>
                </div>
            )}

            {/* 5. Foto Barang */}
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <Camera className="w-4 h-4 text-emerald-600" />
                    <InputLabel
                        value="Foto Barang (Opsional)"
                        className="!mb-0 text-sm font-bold text-gray-800"
                    />
                </div>

                {previewUrl ? (
                    <div className="mt-2 relative group w-full h-48 bg-gray-50 rounded-xl border border-emerald-500 overflow-hidden shadow-sm">
                        <img
                            src={previewUrl}
                            alt="Preview Barang"
                            className="w-full h-full object-contain p-2"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <button
                                type="button"
                                onClick={removeImage}
                                className="bg-white text-red-500 px-4 py-2 rounded-full hover:bg-red-50 transition-all font-bold text-xs flex items-center gap-2 shadow-lg uppercase tracking-wide"
                            >
                                <X size={14} /> Hapus
                            </button>
                        </div>
                        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold shadow text-emerald-600 flex items-center gap-1">
                            <Camera size={10} /> Terupload
                        </div>
                    </div>
                ) : (
                    <div className="mt-1">
                        <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-white hover:border-emerald-500 transition-all group">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <div className="p-2.5 bg-white rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                                    <Camera className="w-5 h-5 text-gray-400 group-hover:text-emerald-500" />
                                </div>
                                <p className="mb-0.5 text-xs text-gray-500 font-medium group-hover:text-emerald-600">
                                    Klik upload foto
                                </p>
                                <p className="text-[10px] text-gray-400">
                                    Max 2MB
                                </p>
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>
                )}
            </div>

            {/* Footer Button */}
            <div className="pt-4 border-t border-gray-100">
                <PrimaryButton
                    disabled={processing}
                    className="w-full justify-center py-3.5 text-sm font-bold rounded-xl shadow-lg shadow-emerald-200 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 transform hover:-translate-y-0.5 active:translate-y-0 transition-all uppercase tracking-wide"
                >
                    {processing ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="animate-spin" size={18} />
                            <span>Memproses...</span>
                        </div>
                    ) : (
                        <span className="flex items-center gap-2">
                            Lanjut Pembayaran <ArrowRight size={18} />
                        </span>
                    )}
                </PrimaryButton>
            </div>
        </form>
    );
}
