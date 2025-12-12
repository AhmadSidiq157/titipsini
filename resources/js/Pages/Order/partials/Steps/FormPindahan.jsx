import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import axios from "axios";
import LiveMap from "@/Components/LiveMap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    Truck,
    MapPin,
    Calendar as CalendarIcon,
    Search,
    Loader2,
    Info,
    AlertCircle,
    XCircle,
    ArrowRight,
} from "lucide-react";

const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(number || 0);
};

// Helper Haversine (Sama)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(2));
};

export default function FormPindahan({
    product,
    productModelClass,
    blockedDates = [],
    onFormSubmit,
}) {
    const { auth } = usePage().props;
    const excludedDates = blockedDates.map(
        (dateString) => new Date(dateString)
    );

    const [data, setData] = useState({
        tanggal_pindahan: "",
        telepon: auth.user.phone || "",
        alamat_penjemputan: "",
        alamat_tujuan: "",
        notes: "",
        origin_latitude: null,
        origin_longitude: null,
        destination_latitude: null,
        destination_longitude: null,
        distance_km: 0,
    });

    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSearchingOrigin, setIsSearchingOrigin] = useState(false);
    const [isSearchingDest, setIsSearchingDest] = useState(false);
    const [estimatedTotal, setEstimatedTotal] = useState(
        parseFloat(product.price) || 0
    );
    const [selectedDate, setSelectedDate] = useState(null);

    const isOverDistanceLimit =
        product.max_distance && data.distance_km > product.max_distance;

    // Hitung Harga Pindahan
    useEffect(() => {
        let total = parseFloat(product.price) || 0;
        if (data.origin_latitude && data.destination_latitude) {
            const dist = calculateDistance(
                data.origin_latitude,
                data.origin_longitude,
                data.destination_latitude,
                data.destination_longitude
            );
            if (data.distance_km !== dist)
                setData((p) => ({ ...p, distance_km: dist }));

            if (dist > 3) {
                // Asumsi 3KM pertama gratis/include base price
                const extra = dist - 3;
                total += extra * (parseFloat(product.price_per_km) || 0);
            }
        }
        setEstimatedTotal(Math.ceil(total / 1000) * 1000);
    }, [
        data.origin_latitude,
        data.destination_latitude,
        product.price,
        product.price_per_km,
    ]);

    // Search Helper
    const searchAddress = async (address, setLoading, onSuccess) => {
        if (!address) return alert("Isi alamat!");
        setLoading(true);
        try {
            let url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                address
            )}&limit=1&countrycodes=id`;
            let res = await fetch(url);
            let result = await res.json();
            if (result.length === 0) {
                const parts = address.split(",");
                if (parts.length > 1) {
                    url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                        parts.slice(0, 2).join(",") + ", Indonesia"
                    )}&limit=1&countrycodes=id`;
                    res = await fetch(url);
                    result = await res.json();
                }
            }
            if (result.length > 0)
                onSuccess(parseFloat(result[0].lat), parseFloat(result[0].lon));
            else alert("Alamat tidak ditemukan.");
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        if (blockedDates.includes(data.tanggal_pindahan)) {
            setErrors({ "form_details.tanggal_pindahan": ["Tanggal penuh."] });
            setProcessing(false);
            return;
        }
        if (!data.origin_latitude || !data.destination_latitude) {
            alert("Harap cari lokasi Asal & Tujuan.");
            setProcessing(false);
            return;
        }
        if (isOverDistanceLimit) {
            alert("Jarak melebihi batas.");
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
        <form onSubmit={submit} className="space-y-6 animate-in fade-in">
            {/* Total Mobile */}
            <div className="sm:hidden flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
                <span className="text-sm font-bold text-gray-500 uppercase">
                    Total Estimasi
                </span>
                <span className="text-xl font-black text-emerald-600">
                    {formatRupiah(estimatedTotal)}
                </span>
            </div>

            {/* 1. Tanggal & Kontak */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative z-50">
                    <InputLabel value="Tanggal Pindahan" />
                    <div className="relative mt-1">
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => {
                                setSelectedDate(date);
                                if (date) {
                                    const offset = date.getTimezoneOffset();
                                    const local = new Date(
                                        date.getTime() - offset * 60 * 1000
                                    );
                                    setData((p) => ({
                                        ...p,
                                        tanggal_pindahan: local
                                            .toISOString()
                                            .split("T")[0],
                                    }));
                                }
                            }}
                            minDate={new Date()}
                            excludeDates={excludedDates}
                            dateFormat="dd MMMM yyyy"
                            placeholderText="Pilih tanggal..."
                            className="w-full pl-10 border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                        />
                    </div>
                    {blockedDates.length > 0 && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle size={10} /> Tanggal penuh.
                        </p>
                    )}
                    <InputError
                        message={errors["form_details.tanggal_pindahan"]?.[0]}
                    />
                </div>
                <div>
                    <InputLabel value="No WhatsApp" />
                    <input
                        type="tel"
                        value={data.telepon}
                        onChange={(e) =>
                            setData((p) => ({ ...p, telepon: e.target.value }))
                        }
                        className="mt-1 w-full border-gray-300 rounded-xl"
                        placeholder="08xxx"
                    />
                    <InputError message={errors["form_details.telepon"]?.[0]} />
                </div>
            </div>

            {/* 2. Lokasi Asal */}
            <div className="space-y-4 bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100">
                <div>
                    <InputLabel
                        value="Alamat Asal"
                        className="text-emerald-800"
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
                        className="w-full border-emerald-200 rounded-xl text-sm mb-2"
                        placeholder="Alamat asal..."
                    ></textarea>
                    <button
                        type="button"
                        onClick={() =>
                            searchAddress(
                                data.alamat_penjemputan,
                                setIsSearchingOrigin,
                                (lat, lng) =>
                                    setData((p) => ({
                                        ...p,
                                        origin_latitude: lat,
                                        origin_longitude: lng,
                                    }))
                            )
                        }
                        className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm flex justify-center gap-2"
                    >
                        {isSearchingOrigin ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <Search />
                        )}{" "}
                        Cari Lokasi Asal
                    </button>
                </div>
                {data.origin_latitude && (
                    <div className="h-48 w-full rounded-xl border border-gray-300 overflow-hidden relative">
                        <LiveMap
                            readOnly={true}
                            lat={data.origin_latitude}
                            lng={data.origin_longitude}
                            onLocationSelect={() => {}}
                        />
                        <div className="absolute top-2 right-2 bg-white px-3 py-1 rounded-full text-xs font-bold shadow">
                            <MapPin
                                size={12}
                                className="text-emerald-600 inline"
                            />{" "}
                            Asal
                        </div>
                    </div>
                )}
            </div>

            {/* 3. Lokasi Tujuan */}
            <div className="space-y-4 bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
                <div>
                    <InputLabel
                        value="Alamat Tujuan"
                        className="text-blue-800"
                    />
                    <textarea
                        value={data.alamat_tujuan}
                        onChange={(e) =>
                            setData((p) => ({
                                ...p,
                                alamat_tujuan: e.target.value,
                            }))
                        }
                        rows="2"
                        className="w-full border-blue-200 rounded-xl text-sm mb-2"
                        placeholder="Alamat tujuan..."
                    ></textarea>
                    <button
                        type="button"
                        onClick={() =>
                            searchAddress(
                                data.alamat_tujuan,
                                setIsSearchingDest,
                                (lat, lng) =>
                                    setData((p) => ({
                                        ...p,
                                        destination_latitude: lat,
                                        destination_longitude: lng,
                                    }))
                            )
                        }
                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm flex justify-center gap-2"
                    >
                        {isSearchingDest ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <Search />
                        )}{" "}
                        Cari Lokasi Tujuan
                    </button>
                </div>
                {data.destination_latitude && (
                    <div className="h-48 w-full rounded-xl border border-gray-300 overflow-hidden relative">
                        <LiveMap
                            readOnly={true}
                            lat={data.destination_latitude}
                            lng={data.destination_longitude}
                            onLocationSelect={() => {}}
                        />
                        <div className="absolute top-2 right-2 bg-white px-3 py-1 rounded-full text-xs font-bold shadow">
                            <MapPin
                                size={12}
                                className="text-blue-600 inline"
                            />{" "}
                            Tujuan
                        </div>
                    </div>
                )}
            </div>

            {/* Info Jarak */}
            {data.distance_km > 0 && (
                <div
                    className={`p-4 rounded-xl flex gap-3 items-center border shadow-sm ${
                        isOverDistanceLimit
                            ? "bg-red-50 border-red-200"
                            : "bg-gray-50 border-gray-200"
                    }`}
                >
                    <div
                        className={`p-2 rounded-full ${
                            isOverDistanceLimit
                                ? "bg-red-100 text-red-600"
                                : "bg-emerald-100 text-emerald-600"
                        }`}
                    >
                        {isOverDistanceLimit ? (
                            <XCircle size={20} />
                        ) : (
                            <Truck size={20} />
                        )}
                    </div>
                    <div className="text-sm text-gray-700">
                        <span
                            className={`font-bold block text-lg ${
                                isOverDistanceLimit
                                    ? "text-red-700"
                                    : "text-gray-800"
                            }`}
                        >
                            {data.distance_km} KM
                        </span>
                        <span className="opacity-80">
                            {isOverDistanceLimit
                                ? `Melebihi batas (${product.max_distance} KM).`
                                : "Estimasi jarak tempuh."}
                        </span>
                    </div>
                </div>
            )}

            <div className="pt-4 border-t border-gray-100">
                <PrimaryButton
                    disabled={processing || isOverDistanceLimit}
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
