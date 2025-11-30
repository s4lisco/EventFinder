// frontend/src/components/FilterPanel.tsx
interface FilterPanelProps {
  category?: string;
  onCategoryChange: (value?: string) => void;
  distanceKm: number;
  onDistanceKmChange: (value: number) => void;
}

const CATEGORY_OPTIONS = [
  { value: "", label: "All categories" },
  { value: "music", label: "Music" },
  { value: "sports", label: "Sports" },
  { value: "family", label: "Family" },
  { value: "arts", label: "Arts & Culture" },
  { value: "food", label: "Food & Drinks" },
];

export default function FilterPanel({
  category,
  onCategoryChange,
  distanceKm,
  onDistanceKmChange,
}: FilterPanelProps) {
  return (
    <div className="space-y-3 rounded-2xl bg-slate-50 px-3 py-3 text-xs text-slate-700">
      <div className="flex flex-col gap-1">
        <label className="font-medium text-slate-600">Category</label>
        <select
          className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs"
          value={category ?? ""}
          onChange={(e) =>
            onCategoryChange(e.target.value || undefined)
          }
        >
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value || "all"} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium text-slate-600">
          Distance radius (km)
        </label>
        <input
          type="range"
          min={1}
          max={40}
          step={1}
          value={distanceKm}
          onChange={(e) => onDistanceKmChange(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-[11px] text-slate-500">
          <span>1 km</span>
          <span className="font-semibold text-slate-700">
            {distanceKm} km
          </span>
          <span>100 km</span>
        </div>
      </div>
    </div>
  );
}
