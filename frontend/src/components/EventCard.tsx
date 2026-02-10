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
      className="group card-bordered flex gap-3 overflow-hidden p-3 transition-all duration-300 hover:scale-[1.02]"
    >
      <div className="relative h-24 w-28 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-primary-100 to-accent-100">
        <img
          src={image}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div>
          <div className="mb-1 flex items-start justify-between gap-2">
            <h3 className="truncate text-sm font-semibold text-slate-900 transition-colors duration-200 group-hover:text-primary-600">
              {event.title}
            </h3>
            <span className="badge-primary whitespace-nowrap text-[10px] uppercase tracking-wider">
              {event.category}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <svg className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="truncate">{startFormatted}</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-600">
            <svg className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{event.locationName}</span>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px]">
          {distanceLabel && (
            <span className="flex items-center gap-1 font-medium text-primary-600">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              {distanceLabel}
            </span>
          )}
          <span className="ml-auto rounded-full bg-gradient-to-r from-success-100 to-success-50 px-2 py-0.5 font-semibold text-success-700 ring-1 ring-success-200">
            {event.priceInfo || "Free"}
          </span>
        </div>
      </div>
    </Link>
  );
}
