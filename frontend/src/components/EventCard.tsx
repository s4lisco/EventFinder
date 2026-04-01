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
      className="group flex gap-3 overflow-hidden rounded-card border border-border bg-white p-3 shadow-soft transition-all duration-200 hover:border-secondary hover:shadow-soft-lg"
    >
      <div className="relative h-24 w-28 flex-shrink-0 overflow-hidden rounded-xl bg-surface">
        <img
          src={image}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-1.5 top-1.5">
          <span className="rounded-pill bg-primary/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
            {event.category}
          </span>
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div>
          <h3 className="truncate text-sm font-bold text-text transition-colors duration-200 group-hover:text-primary font-sans">
            {event.title}
          </h3>
          <div className="mt-1.5 flex items-center gap-1.5 text-xs font-body text-text-muted">
            <svg className="h-3.5 w-3.5 flex-shrink-0 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="truncate">{startFormatted}</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs font-body text-text-muted">
            <svg className="h-3.5 w-3.5 flex-shrink-0 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{event.locationName}</span>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          {distanceLabel && (
            <span className="flex items-center gap-1 text-[11px] font-semibold font-body text-primary">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              {distanceLabel}
            </span>
          )}
          <span className="ml-auto rounded-pill bg-success-500/10 px-2.5 py-0.5 text-[10px] font-semibold font-body text-success-700">
            {event.priceInfo || "Free"}
          </span>
        </div>
      </div>
    </Link>
  );
}
