"use client";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
} from "react-leaflet";

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

const posicao: [number, number] = [
    -23.535763,
    -46.786853,
];

export default function MapaLoja() {
    return (
        <MapContainer
            center={posicao}
            zoom={15}
            dragging={false}
            touchZoom={false}
            doubleClickZoom={false}
            scrollWheelZoom={false}
            boxZoom={false}
            keyboard={false}
            zoomControl={false}
            className="h-[400px] w-full rounded-2xl"
        >
            <TileLayer 
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={posicao}>
                <Popup>
                    Estamos aqui.
                </Popup>
            </Marker>
        </MapContainer>
    );
}