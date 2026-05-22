import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import EventCard from "../components/EventCard";
import { useEvents } from "../hooks/useEvents";
import { Event } from "../types/event";
import { haversineDistanceKm } from "../utils/distance";

const MapView = dynamic(() => import("../components/MapView"), { ssr: false });

type ViewMode = "map" | "list";

export default function HomePage() {
  const [viewMode, setViewMode]         = useState<ViewMode>("map");
  const [searchText, setSearchText]     = useState("");
  const [category, setCategory]         = useState<string | undefined>(undefined);
  const [distanceKm, setDistanceKm]     = useState<number>(10);
  const [mapCenter, setMapCenter]       = useState<{ lat: number; lon: number } | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const { events, loading, error } = useEvents({
    category,
    text: searchText,
    distanceKm,
    lat: mapCenter?.lat ?? userLocation?.lat,
    lon: mapCenter?.lon ?? userLocation?.lon,
  });

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => {},
    );
  }, []);

  const eventsWithDistance = useMemo(() => {
    if (!userLocation) return events;
    return events.map((e) => ({
      ...e,
      distanceKm:
        e.latitude && e.longitude
          ? haversineDistanceKm(userLocation.lat, userLocation.lon, e.latitude, e.longitude)
          : undefined,
    }));
  }, [events, userLocation]);

  const sortedForList = useMemo(
    () => [...eventsWithDistance].sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    ),
    [eventsWithDistance],
  );

  return (
    <>
      <Head>
        <title>Veranstaltungen in deiner Nähe · Regivo</title>
      </Head>

      <div className="flex min-h-[calc(100vh-65px)] flex-col bg-bg">
        {/* Stage header */}
        <header className="border-b border-border bg-paper/80 px-4 py-4 backdrop-blur-md lg:px-8">
          <div className="mx-auto flex max-w-7xl items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">
                Was läuft hier?
              </p>
              <h1 className="mt-1 font-display text-3xl font-bold leading-none tracking-tight text-text lg:text-4xl">
                Events in deiner <span className="text-primary-700">Nähe</span>.
              </h1>
            </div>
            <div className="hidden items-center gap-3 lg:flex">
              <span className="sticker">Live</span>
              <span className="nums text-sm text-text-muted">
                {loading ? "lädt…" : `${sortedForList.length} Events`}
              </span>
            </div>
          </div>
        </header>

        {/* Stage: Map links, List rechts */}
        <div className="flex flex-1 flex-col lg:flex-row">
          {/* Map column */}
          <div className="relative h-[55vh] w-full lg:h-auto lg:flex-1">

            {/* Floating Search + Filter card */}
            <div className="pointer-events-none absolute inset-x-0 top-3 z-20 flex justify-center px-3 lg:justify-start lg:px-6 lg:pt-3">
              <div className="pointer-events-auto w-full max-w-xl animate-slide-up rounded-card border border-border bg-paper/95 p-3 shadow-soft-xl backdrop-blur-xl">
                <SearchBar
                  searchText={searchText}
                  onSearchTextChange={setSearchText}
                  onSubmit={() => {}}
                />
                <button
                  type="button"
                  onClick={() => setIsFilterOpen((v) => !v)}
                  className="mt-2 flex w-full items-center justify-between rounded-button border border-border-strong bg-surface px-4 py-2.5 text-sm font-semibold text-text transition-all duration-150 hover:bg-bg lg:hidden"
                >
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M6 12h12M10 18h4" />
                    </svg>
                    Filter
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-primary-700">
                    {isFilterOpen ? "Ausblenden" : "Anzeigen"}
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

            {/* Mobile Map/List toggle */}
            <div className="pointer-events-none fixed bottom-6 left-0 right-0 z-30 flex justify-center lg:hidden">
              <div className="pointer-events-auto inline-flex gap-1 rounded-pill bg-text p-1.5 shadow-soft-xl">
                {(["map", "list"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`flex items-center gap-2 rounded-pill px-4 py-2 text-sm font-semibold transition-all duration-150 ${
                      viewMode === mode
                        ? "bg-paper text-text shadow-soft"
                        : "text-paper hover:bg-paper/10"
                    }`}
                  >
                    {mode === "map" ? "Karte" : "Liste"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* List column */}
          <aside
            className={`w-full border-t border-border bg-bg lg:h-auto lg:w-[420px] lg:border-l lg:border-t-0 ${
              viewMode === "list" ? "block" : "hidden lg:block"
            }`}
          >
            <div className="h-full max-h-[45vh] overflow-y-auto px-4 py-4 lg:max-h-none lg:px-5 lg:py-5">

              {/* Mobile filter (collapsible) */}
              {isFilterOpen && (
                <div className="mb-3 animate-slide-up lg:hidden">
                  <FilterPanel
                    category={category}
                    onCategoryChange={setCategory}
                    distanceKm={distanceKm}
                    onDistanceKmChange={setDistanceKm}
                  />
                </div>
              )}

              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-mono text-[11px] uppercase tracking-[0.15em] text-text-muted">
                  Was kommt
                </h2>
                <span className="nums text-xs text-text-muted">
                  {sortedForList.length}
                </span>
              </div>

              {loading && (
                <div className="flex items-center gap-2 py-4 text-sm text-text-muted">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  Lade Veranstaltungen…
                </div>
              )}
              {error && (
                <div className="rounded-card border border-danger-500/30 bg-danger-50 px-4 py-3 text-sm text-danger-700">
                  <strong>Fehler beim Laden.</strong> Bitte später erneut versuchen.
                </div>
              )}
              {!loading && !error && sortedForList.length === 0 && (
                <div className="rounded-card border border-dashed border-border-strong bg-surface px-4 py-8 text-center">
                  <p className="font-display text-base font-bold text-text">Nichts gefunden.</p>
                  <p className="mt-1 text-xs text-text-muted">Pass den Umkreis oder die Kategorie an.</p>
                </div>
              )}

              <div className="space-y-3">
                {sortedForList.map((event, i) => (
                  <div key={event.id} className="animate-slide-up" style={{ animationDelay: `${i * 40}ms` }}>
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
