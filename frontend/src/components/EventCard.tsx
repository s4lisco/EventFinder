import Link from "next/link";
import { Event } from "../types/event";
import { haversineDistanceKm } from "../utils/distance";

interface EventCardProps {
  event: Event & { distanceKm?: number };
  userLocation: { lat: number; lon: number } | null;
  onClick?: () => void;
}

export default function EventCard({ event, userLocation, onClick }: EventCardProps) {
  const image =
    event.images && event.images.length > 0
      ? event.images[0]
      : null;

  const start = new Date(event.startDate);
  const day   = start.toLocaleString("de-DE", { day: "2-digit" });
  const month = start.toLocaleString("de-DE", { month: "short" }).replace(".", "");
  const time  = start.toLocaleString("de-DE", { hour: "2-digit", minute: "2-digit" });

  const distance =
    event.distanceKm ??
    (userLocation && event.latitude && event.longitude
      ? haversineDistanceKm(userLocation.lat, userLocation.lon, event.latitude, event.longitude)
      : undefined);

  const distanceLabel = distance !== undefined ? `${distance.toFixed(1)} km` : null;
  const isFree = !event.priceInfo || /^kostenlos$/i.test(event.priceInfo);

  return (
    <Link
      href={`/events/${event.id}`}
      onClick={onClick}
      className="group card-bordered flex gap-3 overflow-hidden p-3 transition-all duration-150 hover:-translate-y-0.5"
    >
      {/* Date stamp */}
      <div className="flex h-24 w-16 flex-shrink-0 flex-col items-center justify-center rounded-button bg-primary text-white">
        <span className="font-display text-2xl font-bold leading-none">{day}</span>
        <span className="mt-1 font-mono text-[10px] uppercase tracking-widest">{month}</span>
        <span className="mt-1.5 nums text-[10px] text-primary-100">{time}</span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div>
          <div className="mb-1 flex items-start justify-between gap-2">
            <h3 className="truncate font-display text-base font-bold leading-tight text-text transition-colors duration-150 group-hover:text-primary-700">
              {event.title}
            </h3>
            {isFree && <span className="sticker flex-shrink-0">Free</span>}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{event.locationName}</span>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2 text-[11px]">
          <span className="badge-primary">{event.category}</span>
          {distanceLabel && (
            <span className="nums font-semibold text-text-muted">
              ↗ {distanceLabel}
            </span>
          )}
        </div>
      </div>

      {/* Image thumb — only on large screens */}
      {image && (
        <div className="hidden h-24 w-24 flex-shrink-0 overflow-hidden rounded-button bg-surface lg:block">
          <img
            src={image}
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        </div>
      )}
    </Link>
  );
}
