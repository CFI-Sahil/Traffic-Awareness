import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Red Pulsing Icon
const pulsingIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<span class="relative flex h-4 w-4">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-4 w-4 bg-red-600 border-2 border-white"></span>
           </span>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10]
});

// Component to handle map view updates
const MapUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 12, { duration: 2 });
        }
    }, [center, map]);
    return null;
};

const LiveTrafficMap = ({ incidents, center }) => {
    // Default New Delhi Coordinates if center not provided
    const position = center || [28.6139, 77.2090];

    // Simulate traffic polylines (Green, Yellow, Red) based on major roads
    // In a real app with Mapbox/TomTom tiles, this is built-in. 
    // For Leaflet + Dark Matter, we overlay synthetic lines or use a traffic tile layer (e.g. TomTom) if available.
    // Using OpenRailwayMap or similar is complex. We'll simulate a few key routes.
    const routes = [
        { positions: [[position[0], position[1]], [position[0] + 0.04, position[1] + 0.02], [position[0] + 0.09, position[1] - 0.1]], color: '#ef4444' }, // Red (Congested)
        { positions: [[position[0] - 0.05, position[1] + 0.05], [position[0], position[1] + 0.05], [position[0] + 0.02, position[1] + 0.02]], color: '#eab308' }, // Yellow (Slow)
        { positions: [[position[0] - 0.1, position[1] - 0.1], [position[0] - 0.05, position[1] - 0.05], [position[0] - 0.02, position[1]]], color: '#22c55e' }, // Green (Smooth)
    ];

    return (
        <div className="h-full w-full rounded-xl overflow-hidden relative z-0">
            <MapContainer center={position} zoom={11} scrollWheelZoom={false} style={{ height: '100%', width: '100%', background: '#111' }}>
                <MapUpdater center={center} />
                {/* Dark Matter Tiles */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {/* Traffic Routes */}
                {routes.map((route, idx) => (
                    <Polyline key={idx} positions={route.positions} color={route.color} weight={4} opacity={0.7} />
                ))}

                {/* Incident Markers */}
                {incidents && incidents.map((incident) => {
                    // Generate random offset for demo purposes if coords missing
                    // TomTom incidents have geometry.coordinates
                    // If we receive data from our trafficService, we need to ensure it has lat/lon.
                    // For now, mocking positions within valid range if not present.
                    const lat = incident.lat || 28.6 + (Math.random() - 0.5) * 0.1;
                    const lon = incident.lon || 77.2 + (Math.random() - 0.5) * 0.1;

                    return (
                        <Marker key={incident.id} position={[lat, lon]} icon={pulsingIcon}>
                            <Popup className="custom-popup">
                                <div className="text-gray-800 text-xs">
                                    <strong className="block text-sm mb-1">{incident.location}</strong>
                                    <span className={`px-2 py-0.5 rounded text-white ${incident.status === 'Critical' ? 'bg-red-500' : 'bg-yellow-500'
                                        }`}>{incident.status}</span>
                                    <div className="mt-1 text-gray-500">{incident.time}</div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>

            {/* Map Overlay Text */}
            <div className="absolute top-4 left-4 z-[400] bg-black/60 backdrop-blur-md px-3 py-1 rounded text-xs text-white border border-white/10">
                Live Traffic Feed • Mappls Source
            </div>
        </div>
    );
};

export default LiveTrafficMap;
