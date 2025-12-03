// frontend/src/pages/index.tsx
import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import EventCard from "../components/EventCard";
import { useEvents } from "../hooks/useEvents";
import { Event } from "../types/event";
import { haversineDistanceKm } from "../utils/distance";
import { getCurrentPosition } from "../utils/location";

const MapView = dynamic(() => import("../components/MapView"), {
  ssr: false,
});

type ViewMode = "map" | "list";

export default function HomePage() {
    const [viewMode, setViewMode] = useState<ViewMode>("map");
    const [searchText, setSearchText] = useState("");
    const [category, setCategory] = useState<string | undefined>(undefined);
    const [distanceKm, setDistanceKm] = useState<number>(10);
    const [mapCenter, setMapCenter] = useState<{
        lat: number;
        lon: number;
    } | null>(null);

    const [userLocation, setUserLocation] = useState<{
        lat: number;
        lon: number;
    } | null>(null);

    const { events, loading, error } = useEvents({
        category,
        text: searchText,
        distanceKm: distanceKm,
        lat: mapCenter?.lat ?? userLocation?.lat,
        lon: mapCenter?.lon ?? userLocation?.lon,
    });

  useEffect(() => {
    (async () => {
      try {
        const pos = await getCurrentPosition({ enableHighAccuracy: true });
        setUserLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      } catch {
        // silently ignore errors, user can still search manually
      }
    })();
  }, []);

  const eventsWithDistance = useMemo(() => {
    if (!userLocation) return events;
    return events.map((e) => {
      const distance =
        e.latitude && e.longitude
          ? haversineDistanceKm(
              userLocation.lat,
              userLocation.lon,
              e.latitude,
              e.longitude,
            )
          : undefined;
      return { ...e, distanceKm: distance };
    });
  }, [events, userLocation]);

  const sortedForList = useMemo(() => {
    return [...eventsWithDistance].sort((a, b) => {
      const aDate = new Date(a.startDate).getTime();
      const bDate = new Date(b.startDate).getTime();
      return aDate - bDate;
    });
  }, [eventsWithDistance]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleSearchSubmit = () => {
    // We already bind searchText to hook; this is a placeholder
    // Could be used for geocoding locationText in future
  };

  return (
    <>
      <Head>
        <title>Regional Events</title>
      </Head>
      <div className="flex min-h-screen flex-col bg-slate-50">
        <header className="border-b bg-white px-4 py-3 shadow-sm">
          <h1 className="text-lg font-semibold text-slate-900">
            Events near you
          </h1>
          <p className="text-xs text-slate-500">
            Discover local events on map or list view.
          </p>
        </header>

        <div className="flex flex-1 flex-col lg:flex-row">
          {/* Left column (map on desktop) */}
          <div className="relative h-[55vh] w-full lg:h-auto lg:flex-1">
            <div className="pointer-events-none absolute inset-x-0 top-2 z-20 flex justify-center px-3 lg:justify-start lg:px-4">
              <div className="pointer-events-auto w-full max-w-xl rounded-2xl bg-white/95 p-2 shadow-lg">
                <SearchBar
                  searchText={searchText}
                  onSearchTextChange={setSearchText}
                  onSubmit={handleSearchSubmit}
                />
                <button
                  type="button"
                  className="mt-2 inline-flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 lg:hidden"
                  onClick={() => setIsFilterOpen((v) => !v)}
                >
                  Filters
                  <span className="text-[10px] uppercase tracking-wide text-slate-500">
                    {isFilterOpen ? "Hide" : "Show"}
                  </span>
                </button>
                <div className="mt-2 hidden lg:block">
                  <FilterPanel
                    category={category}
                    onCategoryChange={setCategory}
                    distanceKm={distanceKm}
                    onDistanceKmChange={setDistanceKm}
                  />
                </div>
              </div>
            </div>
            <div className="mt-24 h-[calc(100%-6rem)] lg:mt-0 lg:h-full">
              <MapView
                  events={eventsWithDistance}
                  userLocation={userLocation}
                  selectedEventId={selectedEvent?.id}
                  distanceKm={distanceKm}
                  onSelectEvent={setSelectedEvent}
                  onMapCenterChange={setMapCenter}
              />
            </div>
            {/* Map/List toggle for mobile */}
            <div className="pointer-events-none fixed bottom-4 left-0 right-0 z-30 flex justify-center lg:hidden">
              <div className="pointer-events-auto inline-flex rounded-full bg-slate-900/90 p-1 text-xs text-white shadow-lg">
                <button
                  className={`rounded-full px-3 py-1 ${
                    viewMode === "map" ? "bg-white text-slate-900" : ""
                  }`}
                  onClick={() => setViewMode("map")}
                >
                  Map
                </button>
                <button
                  className={`rounded-full px-3 py-1 ${
                    viewMode === "list" ? "bg-white text-slate-900" : ""
                  }`}
                  onClick={() => setViewMode("list")}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Right column (list on desktop) / collapsible on mobile */}
          <aside
            className={`
              w-full border-t bg-white lg:h-auto lg:w-[380px] lg:border-l lg:border-t-0
              ${viewMode === "list" ? "block" : "hidden lg:block"}
            `}
          >
            <div className="h-full max-h-[45vh] overflow-y-auto px-4 py-3 lg:max-h-none">
              <div className="mb-3 lg:hidden">
                {isFilterOpen && (
                  <FilterPanel
                    category={category}
                    onCategoryChange={setCategory}
                    distanceKm={distanceKm}
                    onDistanceKmChange={setDistanceKm}
                  />
                )}
              </div>

              {loading && (
                <p className="py-4 text-sm text-slate-500">Loading events…</p>
              )}
              {error && (
                <p className="py-4 text-sm text-red-500">
                  Failed to load events. Please try again.
                </p>
              )}
              {!loading && !error && sortedForList.length === 0 && (
                <p className="py-4 text-sm text-slate-400">
                  No events found for these filters.
                </p>
              )}

              <div className="space-y-3">
                {sortedForList.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    userLocation={userLocation}
                    onClick={() => setSelectedEvent(event)}
                  />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
