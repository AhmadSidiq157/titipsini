import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// --- 1. DEFINISI ICON (LANGSUNG DI DALAM BIAR ANTI-ERROR) ---
const iconUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png";
const shadowUrl =
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png";

// Icon Default
let DefaultIcon = L.icon({
    iconUrl: iconUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Icon Pin Merah (Lokasi) - Menggunakan Filter CSS
const locationIcon = new L.DivIcon({
    className: "bg-transparent",
    html: `<div style="filter: hue-rotate(140deg); -webkit-filter: hue-rotate(140deg);">
        <img src="${iconUrl}" style="width: 25px; height: 41px; display: block;">
        <img src="${shadowUrl}" style="width: 41px; height: 41px; display: block; position: absolute; left: 0; top: 0; opacity: 0.5; z-index: -1;">
    </div>`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

// Icon Truk/Biru (Kurir)
const courierIcon = new L.DivIcon({
    className: "bg-transparent",
    html: `<div>
        <img src="${iconUrl}" style="width: 25px; height: 41px; display: block;">
        <img src="${shadowUrl}" style="width: 41px; height: 41px; display: block; position: absolute; left: 0; top: 0; opacity: 0.5; z-index: -1;">
    </div>`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

// --- 2. KOMPONEN BANTUAN (AUTO CENTER) ---
const RecenterAutomatically = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
        if (lat && lng) {
            map.setView([lat, lng], map.getZoom());
        }
    }, [lat, lng, map]);
    return null;
};

// --- 3. KOMPONEN UTAMA ---
export default function LiveMap({
    lat,
    lng,
    courierLat,
    courierLng,
    isTracking = false, // false = Mode Lokasi, true = Mode Kurir
}) {
    // Normalisasi Input Koordinat
    const latitude = lat || courierLat;
    const longitude = lng || courierLng;

    // Default Jakarta (Hanya dipakai jika data nol/kosong)
    const defaultCenter = [-6.2088, 106.8456];

    // Cek Validitas Data
    const isValidLocation =
        latitude && longitude && latitude !== 0 && longitude !== 0;

    const center = isValidLocation ? [latitude, longitude] : defaultCenter;

    // Pilih Icon
    const activeIcon = isTracking ? courierIcon : locationIcon;

    return (
        <div className="h-full w-full rounded-2xl overflow-hidden shadow-inner border border-gray-200 relative z-0">
            <MapContainer
                center={center}
                zoom={15}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {isValidLocation && (
                    <>
                        {/* MARKER STANDAR (TIDAK BISA DIGESER) */}
                        <Marker
                            position={[latitude, longitude]}
                            icon={activeIcon}
                            draggable={false} // KITA KUNCI SECARA EKSPLISIT
                        >
                            <Popup>
                                {isTracking
                                    ? "🚚 Lokasi Kurir"
                                    : "📍 Lokasi Penjemputan"}
                            </Popup>
                        </Marker>

                        {/* Paksa Peta Pindah ke Titik Tersebut */}
                        <RecenterAutomatically lat={latitude} lng={longitude} />
                    </>
                )}
            </MapContainer>

            {!isValidLocation && (
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow text-sm text-gray-600 text-center z-[1000]">
                    {isTracking
                        ? "📡 Menunggu sinyal GPS..."
                        : "🔍 Menunggu data lokasi..."}
                </div>
            )}
        </div>
    );
}
