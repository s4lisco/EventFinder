// frontend/src/components/BuyMeCoffeeButton.tsx
import { useState } from 'react';

export default function BuyMeCoffeeButton() {
  const [isHovered, setIsHovered] = useState(false);
  
  // Sample link - user will replace this
  const buyMeCoffeeUrl = 'https://www.buymeacoffee.com/yourusername';

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
      {/* Tooltip - appears on hover */}
      <div
        className={`transform transition-all duration-300 ease-out ${
          isHovered
            ? 'translate-x-0 opacity-100'
            : 'translate-x-4 opacity-0 pointer-events-none'
        }`}
      >
        <div className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 shadow-soft-lg">
          <p className="whitespace-nowrap text-sm font-semibold text-white">
            Buy Me a Coffee ☕
          </p>
        </div>
      </div>

      {/* Floating Button */}
      <a
        href={buyMeCoffeeUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-soft-xl transition-all duration-300 hover:scale-110 hover:shadow-glow active:scale-95"
        aria-label="Buy me a coffee"
      >
        {/* Coffee Cup Icon */}
        <svg
          className="h-7 w-7 text-white transition-transform duration-300 group-hover:rotate-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 8.5l.01-.01M12.5 6l.01-.01M15 8.5l.01-.01"
          />
        </svg>

        {/* Pulse animation ring */}
        <div className="absolute inset-0 -z-10 animate-ping rounded-full bg-amber-400 opacity-20"></div>
      </a>
    </div>
  );
}
