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
    ArrowRight,
    MapPin,
    Calendar as CalendarIcon,
    Bike,
    Search,
    Loader2,
    Info,
    CheckCircle2,
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
        notes: "",
        item_photo: null,
        alamat_penjemputan: auth.user.address || "",
        telepon: auth.user.phone || "",
    });

    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSearchingLoc, setIsSearchingLoc] = useState(false);
    const [shippingOptions, setShippingOptions] = useState([]);
    const [distanceInfo, setDistanceInfo] = useState(null);
    const [estimatedTotal, setEstimatedTotal] = useState(
        parseFloat(product.price) || 0
    );

    // 1. Hitung Harga Total (Layanan + Ongkir)
    useEffect(() => {
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
                break;
            case "month":
                multiplier = 25;
                break;
            default:
                multiplier = 1;
        }

        const servicePrice = Math.round(basePrice * duration * multiplier);
        const shippingPrice = parseInt(data.shipping_cost) || 0;
        setEstimatedTotal(servicePrice + shippingPrice);
    }, [
        data.duration_value,
        data.duration_unit,
        data.shipping_cost,
        product.price,
    ]);

    // 2. Auto Update Ongkir saat Ganti Armada
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

            // Fallback search
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
        if (
            data.delivery_method === "pickup" &&
            (!data.latitude || !data.telepon)
        ) {
            if (!data.latitude) alert("Wajib hitung ongkir!");
            if (!data.telepon)
                setErrors({ "form_details.telepon": ["Wajib diisi."] });
            setProcessing(false);
            return;
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
        <form onSubmit={submit} className="space-y-8 animate-in fade-in">
            {/* Total Mobile */}
            <div className="sm:hidden flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
                <span className="text-sm font-bold text-gray-500 uppercase">
                    Total Estimasi
                </span>
                <span className="text-xl font-black text-emerald-600">
                    {formatRupiah(estimatedTotal)}
                </span>
            </div>

            {/* 1. Pilih Cabang (Drop Off) */}
            {data.delivery_method === "drop_off" && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-5 h-5 text-gray-400" />
                        <InputLabel
                            value="Pilih Lokasi Gudang"
                            className="!mb-0 text-base"
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
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
                                    className={`cursor-pointer p-4 rounded-2xl border-2 transition-all ${
                                        parseInt(data.branch_id) === branch.id
                                            ? "border-emerald-500 bg-emerald-50"
                                            : "border-gray-100 bg-white"
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div
                                            className={`mt-1 p-2 rounded-full ${
                                                parseInt(data.branch_id) ===
                                                branch.id
                                                    ? "bg-emerald-500 text-white"
                                                    : "bg-gray-100"
                                            }`}
                                        >
                                            <MapPin size={18} />
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-sm">
                                                {branch.name}
                                            </h5>
                                            <p className="text-xs text-gray-500">
                                                {branch.address}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                    <InputError
                        message={errors["form_details.branch_id"]?.[0]}
                    />
                </div>
            )}

            {/* 2. Durasi (Layout Rapi) */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <Calculator className="w-5 h-5 text-gray-400" />
                    <InputLabel
                        value="Durasi & Waktu Titip"
                        className="!mb-0 text-base font-semibold"
                    />
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                        <label className="text-xs font-bold text-gray-400 uppercase mb-2 block tracking-wider">
                            Mulai Tanggal
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <CalendarIcon className="w-5 h-5 text-gray-400" />
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
                                className="pl-12 w-full h-14 border border-gray-200 bg-gray-50 rounded-xl text-sm font-semibold"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase mb-2 block tracking-wider">
                            Lama Penitipan
                        </label>
                        <div className="grid grid-cols-2 gap-4">
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
                                className="w-full h-14 text-center border border-gray-200 bg-gray-50 rounded-xl text-lg font-bold"
                            />
                            <div className="relative">
                                <select
                                    value={data.duration_unit}
                                    onChange={(e) =>
                                        setData((p) => ({
                                            ...p,
                                            duration_unit: e.target.value,
                                        }))
                                    }
                                    className="w-full h-14 border border-gray-200 bg-gray-50 rounded-xl text-sm font-semibold px-4 appearance-none"
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
            </div>

            {/* 3. Metode Pengiriman */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <Truck className="w-5 h-5 text-gray-400" />
                    <InputLabel
                        value="Metode Penyerahan"
                        className="!mb-0 text-base"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div
                        onClick={() =>
                            setData((p) => ({
                                ...p,
                                delivery_method: "drop_off",
                                shipping_cost: 0,
                            }))
                        }
                        className={`cursor-pointer rounded-2xl p-4 border-2 flex flex-col items-center text-center transition-all ${
                            data.delivery_method === "drop_off"
                                ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                : "border-gray-200"
                        }`}
                    >
                        <Box className="w-6 h-6 mb-2" />
                        <span className="font-bold text-sm">Antar Sendiri</span>
                    </div>
                    <div
                        onClick={() =>
                            setData((p) => ({
                                ...p,
                                delivery_method: "pickup",
                            }))
                        }
                        className={`cursor-pointer rounded-2xl p-4 border-2 flex flex-col items-center text-center transition-all ${
                            data.delivery_method === "pickup"
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-gray-200"
                        }`}
                    >
                        <Truck className="w-6 h-6 mb-2" />
                        <span className="font-bold text-sm">
                            Request Jemput
                        </span>
                    </div>
                </div>
            </div>

            {/* 4. Form Pickup (Lengkap & Rapi) */}
            {data.delivery_method === "pickup" && (
                <div className="space-y-6 bg-blue-50/50 p-5 rounded-2xl border border-blue-100 animate-in slide-in-from-top-2">
                    <div>
                        <InputLabel
                            value="Pilih Armada"
                            className="text-blue-800"
                        />
                        <div className="grid grid-cols-3 gap-3 mt-2">
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
                                    className={`cursor-pointer p-4 rounded-xl border flex flex-col items-center justify-center text-center transition-all shadow-sm ${
                                        data.vehicle_type === v.id
                                            ? "bg-white border-blue-500 text-blue-800 shadow-md ring-2 ring-blue-500"
                                            : "bg-white/60 border-blue-200 text-gray-500"
                                    }`}
                                >
                                    <v.icon
                                        className={`w-6 h-6 mb-2 ${
                                            data.vehicle_type === v.id
                                                ? "text-blue-600"
                                                : "text-gray-400"
                                        }`}
                                    />
                                    <span className="text-xs font-bold">
                                        {v.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <InputLabel
                            value="Alamat Lengkap"
                            className="text-blue-800"
                        />
                        <textarea
                            value={data.alamat_penjemputan}
                            onChange={(e) =>
                                setData((p) => ({
                                    ...p,
                                    alamat_penjemputan: e.target.value,
                                }))
                            }
                            rows="2"
                            className="w-full border-blue-200 rounded-xl text-sm mb-3 px-4 py-3"
                            placeholder="Contoh: Jl. Malioboro..."
                        ></textarea>
                        <button
                            type="button"
                            onClick={searchAddress}
                            disabled={
                                isSearchingLoc || !data.alamat_penjemputan
                            }
                            className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold text-sm flex justify-center gap-2"
                        >
                            {isSearchingLoc ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <Search />
                            )}{" "}
                            Hitung Ongkos Kirim
                        </button>
                    </div>
                    {data.latitude && (
                        <div className="h-48 w-full rounded-xl border border-gray-300 overflow-hidden relative">
                            <LiveMap
                                isTracking={false}
                                lat={data.latitude}
                                lng={data.longitude}
                                onLocationSelect={() => {}}
                            />
                            <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-xs font-bold shadow">
                                <MapPin
                                    size={12}
                                    className="text-red-500 inline"
                                />{" "}
                                Lokasi
                            </div>
                        </div>
                    )}
                    {shippingOptions.length > 0 && (
                        <div className="space-y-2 animate-in zoom-in">
                            <InputLabel
                                value="Pilih Lokasi Penyimpanan"
                                className="text-blue-800"
                            />
                            <select
                                value={data.branch_id}
                                onChange={handleSelectBranch}
                                className="w-full border-blue-200 rounded-xl text-sm p-3 shadow-sm"
                            >
                                {shippingOptions.map((opt, i) => (
                                    <option
                                        key={opt.branch.id}
                                        value={opt.branch.id}
                                    >
                                        {opt.branch.name} ({opt.distance} KM) -{" "}
                                        {formatRupiah(opt.shipping_cost)}{" "}
                                        {i === 0 ? "★ Rekomendasi" : ""}
                                    </option>
                                ))}
                            </select>
                            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between items-center mt-2 shadow-sm">
                                <div>
                                    <p className="text-xs text-emerald-600 font-bold uppercase">
                                        Total Ongkir
                                    </p>
                                    <p className="text-xs text-gray-500 font-medium">
                                        Ke: {distanceInfo?.branch?.name}
                                    </p>
                                </div>
                                <span className="font-black text-xl text-emerald-700">
                                    {formatRupiah(data.shipping_cost)}
                                </span>
                            </div>
                        </div>
                    )}
                    <div>
                        <InputLabel value="No HP" className="text-blue-800" />
                        <input
                            type="tel"
                            value={data.telepon}
                            onChange={(e) =>
                                setData((p) => ({
                                    ...p,
                                    telepon: e.target.value,
                                }))
                            }
                            className="w-full border-blue-200 rounded-xl text-sm px-4 py-3"
                            placeholder="08xxx"
                        />
                        <InputError message={errors["form_details.telepon"]} />
                    </div>
                </div>
            )}

            {/* 5. Foto Barang */}
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <Camera className="w-5 h-5 text-gray-400" />
                    <InputLabel value="Foto Barang (Opsional)" />
                </div>
                <input
                    type="file"
                    onChange={(e) =>
                        setData((p) => ({
                            ...p,
                            item_photo: e.target.files[0],
                        }))
                    }
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700"
                />
            </div>

            {/* Footer */}
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
