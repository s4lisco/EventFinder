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
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      () => {
        // silently ignore errors, user can still search manually
      },
    );
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
    // search state is already bound to hook via searchText
  };

  return (
    <>
      <Head>
        <title>Discover Events Near You | The Urban Pulse</title>
      </Head>
      <div className="flex min-h-screen flex-col bg-surface">
        {/* Discovery header bar */}
        <header className="border-b border-border bg-white px-4 py-4 shadow-soft lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-button bg-primary shadow-purple">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="font-sans text-xl font-bold text-text">
                Discover <span className="text-gradient">Events Near You</span>
              </h1>
              <p className="font-body text-sm text-text-muted">
                Find exciting local experiences on the map
              </p>
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col lg:flex-row">
          {/* Left column (map on desktop) */}
          <div className="relative h-[55vh] w-full lg:h-auto lg:flex-1">
            <div className="pointer-events-none absolute inset-x-0 top-3 z-20 flex justify-center px-3 lg:justify-start lg:px-4">
              <div className="pointer-events-auto w-full max-w-xl animate-slide-up rounded-card bg-white/95 p-3 shadow-soft-xl backdrop-blur-xl">
                <SearchBar
                  searchText={searchText}
                  onSearchTextChange={setSearchText}
                  onSubmit={handleSearchSubmit}
                />
                <button
                  type="button"
                  className="mt-3 flex w-full items-center justify-between rounded-button border-2 border-border bg-white px-4 py-2.5 text-sm font-semibold text-text transition-all duration-200 hover:border-secondary"
                  onClick={() => setIsFilterOpen((v) => !v)}
                >
                  <span className="flex items-center gap-2 font-body">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    Filters
                  </span>
                  <span className="font-body text-xs font-bold uppercase tracking-wider text-primary">
                    {isFilterOpen ? "Hide" : "Show"}
                  </span>
                </button>
                <div className="mt-3 hidden lg:block">
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
            <div className="pointer-events-none fixed bottom-20 left-0 right-0 z-30 flex justify-center lg:hidden">
              <div className="pointer-events-auto inline-flex gap-1 rounded-pill bg-dark/95 p-1.5 shadow-soft-xl backdrop-blur-xl">
                <button
                  className={`flex items-center gap-2 rounded-pill px-4 py-2 text-sm font-semibold font-body transition-all duration-200 ${
                    viewMode === "map"
                      ? "bg-white text-text shadow-soft"
                      : "text-white hover:bg-white/10"
                  }`}
                  onClick={() => setViewMode("map")}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Map
                </button>
                <button
                  className={`flex items-center gap-2 rounded-pill px-4 py-2 text-sm font-semibold font-body transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-white text-text shadow-soft"
                      : "text-white hover:bg-white/10"
                  }`}
                  onClick={() => setViewMode("list")}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Right column (list on desktop) / collapsible on mobile */}
          <aside
            className={`
              w-full border-t border-border bg-white/90 backdrop-blur-xl lg:h-auto lg:w-[400px] lg:border-l lg:border-t-0
              ${viewMode === "list" ? "block" : "hidden lg:block"}
            `}
          >
            <div className="h-full max-h-[45vh] overflow-y-auto px-4 py-4 lg:max-h-none">
              {/* Filters on mobile */}
              <div className="mb-3 lg:hidden">
                {isFilterOpen && (
                  <div className="mb-3 animate-slide-up">
                    <FilterPanel
                      category={category}
                      onCategoryChange={setCategory}
                      distanceKm={distanceKm}
                      onDistanceKmChange={setDistanceKm}
                    />
                  </div>
                )}
              </div>

              {/* Event count header */}
              {!loading && !error && (
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-body text-sm font-semibold text-text">
                    {sortedForList.length > 0
                      ? `${sortedForList.length} event${sortedForList.length !== 1 ? "s" : ""} found`
                      : "No events found"}
                  </p>
                  {sortedForList.length > 0 && (
                    <span className="font-body text-xs text-text-muted">Sorted by date</span>
                  )}
                </div>
              )}

              {loading && (
                <div className="flex items-center gap-2 py-4 font-body text-sm text-text-muted">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  Loading events…
                </div>
              )}
              {error && (
                <div className="animate-slide-up rounded-card border-2 border-red-300 bg-red-50 px-4 py-3 shadow-soft">
                  <div className="flex items-center gap-2 font-sans text-sm font-semibold text-red-700">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Failed to load events
                  </div>
                  <p className="mt-1 font-body text-xs text-red-600">Please try again later.</p>
                </div>
              )}
              {!loading && !error && sortedForList.length === 0 && (
                <div className="animate-slide-up rounded-card border-2 border-dashed border-border bg-surface px-4 py-8 text-center shadow-soft">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/20">
                    <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <p className="font-sans text-sm font-semibold text-text">No events found</p>
                  <p className="mt-1 font-body text-xs text-text-muted">Try adjusting your filters or search area</p>
                </div>
              )}

              <div className="space-y-3">
                {sortedForList.map((event, index) => (
                  <div
                    key={event.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <EventCard
                      event={event}
                      userLocation={userLocation}
                      onClick={() => setSelectedEvent(event)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
