import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { Event } from "../types/event";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface MapViewProps {
    events: (Event & { distanceKm?: number })[];
    userLocation: { lat: number; lon: number } | null;
    selectedEventId?: string;
    distanceKm?: number;
    onSelectEvent?: (event: Event) => void;
    onMapCenterChange?: (center: { lat: number; lon: number }) => void;
}

export default function MapView({
    events,
    userLocation,
    selectedEventId,
    distanceKm = 10,
    onSelectEvent,
    onMapCenterChange,
}: MapViewProps) {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const markersRef = useRef<mapboxgl.Marker[]>([]);
    const radiusSourceRef = useRef<boolean>(false);
    const centerMarkerRef = useRef<mapboxgl.Marker | null>(null);
    const [mapCenter, setMapCenter] = useState<{ lat: number; lon: number } | null>(userLocation);

    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return;
        if (!mapboxgl.accessToken) {
            console.warn("Mapbox token is not set. Provide NEXT_PUBLIC_MAPBOX_TOKEN in .env.local");
        }

        const defaultCenter: [number, number] = userLocation
            ? [userLocation.lon, userLocation.lat]
            : [8.5417, 47.3769];

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/light-v11",
            center: defaultCenter,
            zoom: 11,
        });

        map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

        map.on("load", () => {
            map.addSource("radius-source", {
                type: "geojson",
                data: { type: "FeatureCollection", features: [] },
            });

            map.addLayer({
                id: "radius-circle",
                type: "fill",
                source: "radius-source",
                paint: {
                    "fill-color": "#3A8F4D",
                    "fill-opacity": 0.10,
                },
            });
            map.addLayer({
                id: "radius-outline",
                type: "line",
                source: "radius-source",
                paint: {
                    "line-color": "#3A8F4D",
                    "line-width": 2,
                    "line-opacity": 0.7,
                },
            });

            radiusSourceRef.current = true;
        });

        map.on("dragend", () => {
            const center = map.getCenter();
            const newCenter = { lat: center.lat, lon: center.lng };
            setMapCenter(newCenter);
            onMapCenterChange?.(newCenter);
        });

        mapRef.current = map;

        return () => {
            markersRef.current.forEach((m) => m.remove());
            centerMarkerRef.current?.remove();
            map.remove();
            mapRef.current = null;
        };
    }, []);

    // Center marker + Radius circle
    useEffect(() => {
        const map = mapRef.current;
        if (!map || !mapCenter || !radiusSourceRef.current) return;

        centerMarkerRef.current?.remove();

        const centerEl = document.createElement("div");
        centerEl.className = "center-marker";

        centerMarkerRef.current = new mapboxgl.Marker({ element: centerEl, anchor: "center" })
            .setLngLat([mapCenter.lon, mapCenter.lat])
            .addTo(map);

        const circlePoints = 64;
        const earthRadiusKm = 6371;
        const coordinates: [number, number][] = [];

        for (let i = 0; i < circlePoints; i++) {
            const angle = (i / circlePoints) * (2 * Math.PI);
            const lat =
                mapCenter.lat +
                (distanceKm / earthRadiusKm) * (180 / Math.PI) * Math.cos(angle);
            const lon =
                mapCenter.lon +
                (distanceKm / earthRadiusKm) * (180 / Math.PI) * Math.sin(angle) /
                Math.cos((mapCenter.lat * Math.PI) / 180);
            coordinates.push([lon, lat]);
        }
        coordinates.push(coordinates[0]);

        const source = map.getSource("radius-source") as mapboxgl.GeoJSONSource;
        source?.setData({
            type: "FeatureCollection",
            features: [{
                type: "Feature",
                geometry: { type: "Polygon", coordinates: [coordinates] },
                properties: {},
            }],
        });
    }, [mapCenter, distanceKm]);

    useEffect(() => {
        const map = mapRef.current;
        if (!map || !mapCenter) return;
        const earthRadiusKm = 6371;
        const dDeg = (distanceKm / earthRadiusKm) * (180 / Math.PI);
        map.fitBounds(
            [
                [mapCenter.lon - dDeg, mapCenter.lat - dDeg],
                [mapCenter.lon + dDeg, mapCenter.lat + dDeg],
            ],
            { padding: 60, duration: 500 },
        );
    }, [distanceKm, mapCenter]);

    useEffect(() => {
        if (userLocation && mapRef.current && !mapCenter) {
            setMapCenter(userLocation);
            mapRef.current.flyTo({
                center: [userLocation.lon, userLocation.lat],
                zoom: 12,
                essential: true,
            });
        }
    }, [userLocation, mapCenter]);

    // Sage pin markers
    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];

        events.forEach((event) => {
            if (typeof event.longitude !== "number" || typeof event.latitude !== "number") return;

            const el = document.createElement("div");
            el.className = "pin-marker" + (event.id === selectedEventId ? " is-active" : "");
            el.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/></svg>`;

            const marker = new mapboxgl.Marker({ element: el, anchor: "bottom" })
                .setLngLat([event.longitude, event.latitude])
                .addTo(map);

            el.addEventListener("click", () => {
                onSelectEvent?.(event);
                map.flyTo({
                    center: [event.longitude!, event.latitude!],
                    zoom: 13,
                    essential: true,
                });
            });

            markersRef.current.push(marker);
        });
    }, [events, selectedEventId, onSelectEvent]);

    return (
        <div className="h-full w-full">
            <div ref={mapContainerRef} className="h-full w-full" />
        </div>
    );
}
