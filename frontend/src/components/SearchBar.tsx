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
      <div className="group flex items-center gap-3 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 shadow-soft transition-all duration-200 focus-within:border-primary-400 focus-within:shadow-glow">
        <svg 
          className="h-5 w-5 flex-shrink-0 text-slate-400 transition-colors duration-200 group-focus-within:text-primary-500" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={searchText}
          onChange={(e) => onSearchTextChange(e.target.value)}
          placeholder="Search events by title, description..."
          className="w-full border-none bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />
        {searchText && (
          <button
            type="button"
            onClick={() => onSearchTextChange("")}
            className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 transition-all duration-200 hover:bg-slate-200 active:scale-90"
          >
            <svg className="h-3.5 w-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
}
