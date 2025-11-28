// frontend/src/components/SearchBar.tsx
import { FormEvent } from "react";

interface SearchBarProps {
  searchText: string;
  onSearchTextChange: (value: string) => void;
  onSubmit: () => void;
}

export default function SearchBar({
  searchText,
  onSearchTextChange,
  onSubmit,
}: SearchBarProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2">
        <span className="mr-2 text-slate-400">🔍</span>
        <input
          type="text"
          value={searchText}
          onChange={(e) => onSearchTextChange(e.target.value)}
          placeholder="Search events (title, description)…"
          className="w-full border-none bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />
      </div>
    </form>
  );
}
