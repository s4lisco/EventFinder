// frontend/src/components/FilterPanel.tsx
interface FilterPanelProps {
  category?: string;
  onCategoryChange: (value?: string) => void;
  distanceKm: number;
  onDistanceKmChange: (value: number) => void;
}

const CATEGORY_OPTIONS = [
  { value: "", label: "Alle Kategorien", icon: "🎯" },
  { value: "music", label: "Musik", icon: "🎵" },
  { value: "sports", label: "Sport", icon: "⚽" },
  { value: "family", label: "Familie", icon: "👨‍👩‍👧" },
  { value: "arts", label: "Kunst & Kultur", icon: "🎨" },
  { value: "food", label: "Essen & Trinken", icon: "🍴" },
];

export default function FilterPanel({
  category,
  onCategoryChange,
  distanceKm,
  onDistanceKmChange,
}: FilterPanelProps) {
  return (
    <div className="space-y-4 rounded-card bg-surface p-4 shadow-soft">
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-xs font-semibold text-text">
          <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Category
        </label>
        <select
          className="input cursor-pointer text-sm font-medium"
          value={category ?? ""}
          onChange={(e) =>
            onCategoryChange(e.target.value || undefined)
          }
        >
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value || "all"} value={opt.value}>
              {opt.icon} {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2 text-xs font-semibold text-text">
          <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Umkreis
        </label>
        <div className="relative">
          <input
            type="range"
            min={1}
            max={40}
            step={1}
            value={distanceKm}
            onChange={(e) => onDistanceKmChange(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-border outline-none transition-all duration-150 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-gradient-primary [&::-moz-range-thumb]:shadow-soft [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:duration-150 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-primary [&::-webkit-slider-thumb]:shadow-soft [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-150"
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted">1 km</span>
          <div className="rounded-full bg-gradient-primary px-3 py-1 text-xs font-bold text-white shadow-soft">
            {distanceKm} km
          </div>
          <span className="text-xs text-text-muted">40 km</span>
        </div>
      </div>
    </div>
  );
}
