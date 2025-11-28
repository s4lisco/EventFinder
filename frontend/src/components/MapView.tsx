// frontend/src/components/MapView.tsx
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { Event } from "../types/event";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface MapViewProps {
  events: (Event & { distanceKm?: number })[];
  userLocation: { lat: number; lon: number } | null;
  selectedEventId?: string;
  onSelectEvent?: (event: Event) => void;
}

export default function MapView({
  events,
  userLocation,
  selectedEventId,
  onSelectEvent,
}: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    if (!mapboxgl.accessToken) {
      console.warn(
        "Mapbox token is not set. Provide NEXT_PUBLIC_MAPBOX_TOKEN in .env.local",
      );
    }

    const defaultCenter: [number, number] = userLocation
      ? [userLocation.lon, userLocation.lat]
      : [8.5417, 47.3769]; // default to Zurich

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: defaultCenter,
      zoom: 11,
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

    mapRef.current = map;

    return () => {
      markersRef.current.forEach((m) => m.remove());
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update center when userLocation changes
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;
    mapRef.current.flyTo({
      center: [userLocation.lon, userLocation.lat],
      zoom: 12,
      essential: true,
    });
  }, [userLocation]);

  // Render markers
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
        "flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-emerald-500 shadow-md";
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

    // fit bounds when events change
    if (events.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      events.forEach((e) => {
        if (
          typeof e.longitude === "number" &&
          typeof e.latitude === "number"
        ) {
          bounds.extend([e.longitude, e.latitude]);
        }
      });

      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, { padding: 40, maxZoom: 13 });
      }
    }
  }, [events, onSelectEvent]);

  // Highlight selected marker (simple re-render strategy)
  useEffect(() => {
    if (!selectedEventId) return;
    // Could be enhanced to actually style specific marker element
  }, [selectedEventId]);

  return (
    <div className="h-full w-full">
      <div ref={mapContainerRef} className="h-full w-full rounded-none lg:rounded-tl-3xl" />
    </div>
  );
}
