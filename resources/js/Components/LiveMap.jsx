import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const courierIcon = new L.DivIcon({
    className: "bg-transparent",
    html: `<div style="background-color: white; border-radius: 50%; padding: 6px; border: 2px solid #3b82f6; box-shadow: 0 4px 10px rgba(0,0,0,0.2); display: flex; justify-content: center; align-items: center;">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
    </div>`,
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -40],
});

const RecenterAutomatically = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
        if (lat && lng) {
            map.setView([lat, lng], map.getZoom());
        }
    }, [lat, lng, map]);
    return null;
};

export default function LiveMap({ courierLat, courierLng }) {
    // Default Center (Jakarta) - Dipakai jika koordinat kurir kosong/null/0
    const defaultCenter = [-6.2088, 106.8456];

    // Pastikan koordinat valid (tidak null, tidak 0)
    const isValidLocation =
        courierLat && courierLng && courierLat !== 0 && courierLng !== 0;

    const center = isValidLocation ? [courierLat, courierLng] : defaultCenter;

    return (
        <div className="h-80 w-full rounded-2xl overflow-hidden shadow-inner border border-gray-200 relative z-0">
            <MapContainer
                center={center}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Marker Kurir hanya muncul jika lokasi valid */}
                {isValidLocation && (
                    <>
                        <Marker
                            position={[courierLat, courierLng]}
                            icon={courierIcon}
                        >
                            <Popup>🚚 Lokasi Kurir</Popup>
                        </Marker>
                        <RecenterAutomatically
                            lat={courierLat}
                            lng={courierLng}
                        />
                    </>
                )}
            </MapContainer>

            {!isValidLocation && (
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow text-sm text-gray-600 text-center z-[1000]">
                    📡 Menunggu sinyal GPS dari kurir... (Menampilkan Peta
                    Default)
                </div>
            )}
        </div>
    );
}
