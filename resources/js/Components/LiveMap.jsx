import React, { useEffect, useState, useMemo, useRef } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
    useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// --- 1. DEFINISI ICON ---
const iconUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png";
const shadowUrl =
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: iconUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Icon Pin Merah (Lokasi User/Input)
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

// --- 2. MAP CONTROLLER (Animasi Pindah) ---
const MapController = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            // Animasi 'terbang' halus ke lokasi baru
            map.flyTo(center, map.getZoom(), {
                animate: true,
                duration: 1.5,
            });
        }
    }, [center, map]);
    return null;
};

// --- 3. LOCATION MARKER (Pin yang Bisa Digeser) ---
const LocationMarker = ({ position, setPosition, onLocationSelect }) => {
    const markerRef = useRef(null);

    // Event handler: Saat marker selesai ditarik (dragend)
    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current;
                if (marker != null) {
                    const newPos = marker.getLatLng();
                    setPosition([newPos.lat, newPos.lng]);
                    // Kirim koordinat ke Parent (Step1_Form)
                    if (onLocationSelect)
                        onLocationSelect(newPos.lat, newPos.lng);
                }
            },
        }),
        [onLocationSelect, setPosition]
    );

    // Event handler: Saat peta diklik
    useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng]);
            // Kirim koordinat ke Parent
            if (onLocationSelect) onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });

    return (
        <Marker
            draggable={true} // [PENTING] Izinkan geser
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}
            icon={locationIcon}
        >
            <Popup>Geser marker ini ke titik penjemputan.</Popup>
        </Marker>
    );
};

// --- 4. KOMPONEN UTAMA ---
export default function LiveMap({
    lat,
    lng,
    courierLat,
    courierLng,
    isTracking = false, // false = Mode Pilih Lokasi, true = Mode Tracking Kurir
    onLocationSelect, // Callback function dari Parent (Step1_Form)
}) {
    // --- STEP 1: PARSING DATA ---
    const parseCoord = (val) => {
        const num = parseFloat(val);
        return isNaN(num) ? 0 : num;
    };

    const dbLat = parseCoord(lat || courierLat);
    const dbLng = parseCoord(lng || courierLng);

    // Validasi Data
    const isDbDataValid = Math.abs(dbLat) > 0.0001 && Math.abs(dbLng) > 0.0001;

    // Default Seturan (Fallback)
    const defaultCenter = [-7.770287, 110.410795];

    // State Posisi
    const [currentPos, setCurrentPos] = useState(
        isDbDataValid ? [dbLat, dbLng] : defaultCenter
    );
    const [statusText, setStatusText] = useState("");

    // --- STEP 2: LOGIKA LOAD AWAL ---
    useEffect(() => {
        // KASUS 1: Jika Mode Tracking (Lihat Kurir) & Ada Data -> Pakai Data DB
        if (isTracking && isDbDataValid) {
            setCurrentPos([dbLat, dbLng]);
            setStatusText("Lokasi Kurir");
            return;
        }

        // KASUS 2: Jika Mode Input (Pilih Lokasi) & Data Masih Kosong -> Cari GPS
        if (!isTracking && !isDbDataValid && "geolocation" in navigator) {
            setStatusText("Mencari lokasi kamu...");

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log("📍 GPS Ditemukan:", latitude, longitude);

                    setCurrentPos([latitude, longitude]);
                    setStatusText("Lokasi ditemukan!");

                    // Otomatis update parent form saat GPS ketemu
                    if (onLocationSelect) onLocationSelect(latitude, longitude);
                },
                (error) => {
                    console.error("Gagal GPS:", error);
                    setStatusText("Gagal deteksi lokasi. Geser peta manual.");
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        } else if (isDbDataValid) {
            // Jika data sudah ada (misal user balik dari step 2 ke step 1), pakai data itu
            setCurrentPos([dbLat, dbLng]);
        }
    }, [isTracking, dbLat, dbLng, isDbDataValid]);
    // Dependency array penting agar tidak loop, tapi tetap reaktif

    return (
        <div className="h-full w-full rounded-2xl overflow-hidden shadow-inner border border-gray-200 relative z-0">
            {/* Status Bar */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow text-xs font-bold text-emerald-600 border border-emerald-100 whitespace-nowrap">
                {statusText ||
                    (isTracking
                        ? "Menunggu Data..."
                        : "Geser Marker untuk Pilih Lokasi")}
            </div>

            <MapContainer
                center={currentPos}
                zoom={15}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution="&copy; OSM"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapController center={currentPos} />

                {isTracking ? (
                    // MODE TRACKING (Marker Diam / Kurir)
                    <Marker position={currentPos} icon={courierIcon}>
                        <Popup>Lokasi Kurir</Popup>
                    </Marker>
                ) : (
                    // MODE INPUT (Marker Bisa Digeser)
                    <LocationMarker
                        position={currentPos}
                        setPosition={setCurrentPos}
                        onLocationSelect={onLocationSelect}
                    />
                )}
            </MapContainer>
        </div>
    );
}
