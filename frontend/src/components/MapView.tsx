// frontend/src/components/MapView.tsx
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
            console.warn(
                "Mapbox token is not set. Provide NEXT_PUBLIC_MAPBOX_TOKEN in .env.local",
            );
        }

        const defaultCenter: [number, number] = userLocation
            ? [userLocation.lon, userLocation.lat]
            : [8.5417, 47.3769];

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: defaultCenter,
            zoom: 11,
        });

        map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

        // Add radius source and layer
        map.on("load", () => {
            map.addSource("radius-source", {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: [],
                },
            });

            map.addLayer({
                id: "radius-circle",
                type: "fill",
                source: "radius-source",
                paint: {
                    "fill-color": "#10b981",
                    "fill-opacity": 0.15,
                },
            });

            map.addLayer({
                id: "radius-outline",
                type: "line",
                source: "radius-source",
                paint: {
                    "line-color": "#10b981",
                    "line-width": 2,
                    "line-opacity": 0.6,
                    "line-dasharray": [4, 4],
                },
            });

            radiusSourceRef.current = true;
        });

        // Update map center when user drags the map
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

    // Update center marker and radius circle
    useEffect(() => {
        const map = mapRef.current;
        if (!map || !mapCenter || !radiusSourceRef.current) return;

        // Remove old center marker
        centerMarkerRef.current?.remove();

        // Add new center marker
        const centerEl = document.createElement("div");
        centerEl.className =
            "flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 border-2 border-white shadow-md";
        centerEl.innerHTML = "";

        centerMarkerRef.current = new mapboxgl.Marker({
            element: centerEl,
            anchor: "center",
        })
            .setLngLat([mapCenter.lon, mapCenter.lat])
            .addTo(map);

        // Generate circle polygon
        const circlePoints = 64;
        const earthRadiusKm = 6371;
        const coordinates: [number, number][] = [];

        for (let i = 0; i < circlePoints; i++) {
            const angle = (i / circlePoints) * (2 * Math.PI);
            const lat =
                mapCenter.lat +
                (distanceKm / earthRadiusKm) *
                (180 / Math.PI) *
                Math.cos(angle);
            const lon =
                mapCenter.lon +
                (distanceKm / earthRadiusKm) *
                (180 / Math.PI) *
                Math.sin(angle) /
                Math.cos((mapCenter.lat * Math.PI) / 180);

            coordinates.push([lon, lat]);
        }
        coordinates.push(coordinates[0]);

        const feature = {
            type: "Feature" as const,
            geometry: {
                type: "Polygon" as const,
                coordinates: [coordinates],
            },
            properties: {},
        };

        const source = map.getSource("radius-source") as mapboxgl.GeoJSONSource;
        if (source) {
            source.setData({
                type: "FeatureCollection",
                features: [feature],
            });
        }
    }, [mapCenter, distanceKm]);

    // Fit bounds to show entire circle when distance changes
    useEffect(() => {
        const map = mapRef.current;
        if (!map || !mapCenter) return;

        const earthRadiusKm = 6371;
        const distanceInDegrees =
            (distanceKm / earthRadiusKm) * (180 / Math.PI);

        const bounds = [
            [mapCenter.lon - distanceInDegrees, mapCenter.lat - distanceInDegrees],
            [mapCenter.lon + distanceInDegrees, mapCenter.lat + distanceInDegrees],
        ] as [[number, number], [number, number]];

        map.fitBounds(bounds, {
            padding: 50,
            duration: 500,
        });
    }, [distanceKm, mapCenter]);

    // Initialize map center on first user location load
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

    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];

        events.forEach((event) => {
            if (
                typeof event.longitude !== "number" ||
                typeof event.latitude !== "number"
            ) {
                return;
            }

            const el = document.createElement("div");
            el.className =
                "flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-emerald-500 shadow-md cursor-pointer hover:bg-emerald-600";
            el.innerHTML = `<span style="font-size: 12px;">📍</span>`;

            const marker = new mapboxgl.Marker({
                element: el,
                anchor: "bottom",
            })
                .setLngLat([event.longitude, event.latitude])
                .addTo(map);

            el.addEventListener("click", () => {
                onSelectEvent && onSelectEvent(event);
                map.flyTo({
                    center: [event.longitude, event.latitude],
                    zoom: 13,
                    essential: true,
                });
            });

            markersRef.current.push(marker);
        });
    }, [events, onSelectEvent]);

    return (
        <div className="h-full w-full">
            <div ref={mapContainerRef} className="h-full w-full rounded-none lg:rounded-tl-3xl" />
        </div>
    );
}
