// frontend/src/components/EventCard.tsx
import Link from "next/link";
import { Event } from "../types/event";
import { haversineDistanceKm } from "../utils/distance";

interface EventCardProps {
  event: Event & { distanceKm?: number };
  userLocation: { lat: number; lon: number } | null;
  onClick?: () => void;
}

export default function EventCard({
  event,
  userLocation,
  onClick,
}: EventCardProps) {
  const image =
    event.images && event.images.length > 0
      ? event.images[0]
      : "https://via.placeholder.com/400x200.png?text=Event";

  const start = new Date(event.startDate);
  const startFormatted = start.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  const distance =
    event.distanceKm ??
    (userLocation && event.latitude && event.longitude
      ? haversineDistanceKm(
          userLocation.lat,
          userLocation.lon,
          event.latitude,
          event.longitude,
        )
      : undefined);

  const distanceLabel =
    distance !== undefined ? `${distance.toFixed(1)} km away` : "";

  return (
    <Link
      href={`/events/${event.id}`}
      onClick={onClick}
      className="flex gap-3 rounded-2xl border border-slate-100 bg-white p-2 shadow-sm hover:border-slate-200 hover:shadow-md transition"
    >
      <div className="h-20 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
        <img
          src={image}
          alt={event.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="mb-1 flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold text-slate-900">
            {event.title}
          </p>
          <span className="whitespace-nowrap rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-600">
            {event.category}
          </span>
        </div>
        <p className="text-xs text-slate-600">
          {startFormatted} · {event.locationName}
        </p>
        <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
          <span>{distanceLabel}</span>
          <span className="font-medium text-emerald-600">
            {event.priceInfo || "Free / Check details"}
          </span>
        </div>
      </div>
    </Link>
  );
}
