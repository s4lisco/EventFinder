interface FilterPanelProps {
  category?: string;
  onCategoryChange: (value?: string) => void;
  distanceKm: number;
  onDistanceKmChange: (value: number) => void;
}

const CATEGORY_OPTIONS = [
  { value: "",       label: "Alle" },
  { value: "music",  label: "Musik" },
  { value: "sports", label: "Sport" },
  { value: "family", label: "Familie" },
  { value: "arts",   label: "Kultur" },
  { value: "food",   label: "Essen" },
];

export default function FilterPanel({
  category,
  onCategoryChange,
  distanceKm,
  onDistanceKmChange,
}: FilterPanelProps) {
  return (
    <div className="space-y-5 rounded-card border border-border bg-surface p-4 shadow-soft">
      {/* Categories als Chips */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-muted">
            Kategorie
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORY_OPTIONS.map((opt) => {
            const active = (category ?? "") === opt.value;
            return (
              <button
                key={opt.value || "all"}
                type="button"
                onClick={() => onCategoryChange(opt.value || undefined)}
                className={`chip ${active ? "chip-active" : ""}`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Distance Slider */}
      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-muted">
            Umkreis
          </span>
          <span className="nums text-sm font-bold text-primary-700">
            {distanceKm}<span className="ml-0.5 text-text-muted">km</span>
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={40}
          step={1}
          value={distanceKm}
          onChange={(e) => onDistanceKmChange(Number(e.target.value))}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border outline-none
                     [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:appearance-none
                     [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2
                     [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-primary
                     [&::-moz-range-thumb]:shadow-soft
                     [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5
                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
                     [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-soft"
        />
        <div className="mt-1 flex justify-between font-mono text-[10px] text-text-muted">
          <span>1 km</span>
          <span>40 km</span>
        </div>
      </div>
    </div>
  );
}
