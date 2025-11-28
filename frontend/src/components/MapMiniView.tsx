// frontend/src/components/MapMiniView.tsx
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface MapMiniViewProps {
  latitude: number;
  longitude: number;
  title: string;
  locationName: string;
}

export default function MapMiniView({
  latitude,
  longitude,
  title,
  locationName,
}: MapMiniViewProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      Number.isNaN(latitude) ||
      Number.isNaN(longitude)
    ) {
      return;
    }

    const center: [number, number] = [longitude, latitude];

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center,
      zoom: 13,
    });

    const popupHtml = `
      <div style="font-size: 12px;">
        <strong>${title}</strong><br/>
        ${locationName}
      </div>
    `;

    new mapboxgl.Marker({ color: "#10b981" })
      .setLngLat(center)
      .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupHtml))
      .addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [latitude, longitude, title, locationName]);

  const handleClick = () => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({ zoom: 15, essential: true });
  };

  return (
    <div
      className="h-56 w-full overflow-hidden rounded-2xl border border-slate-100"
      onClick={handleClick}
    >
      <div ref={mapContainerRef} className="h-full w-full" />
    </div>
  );
}
