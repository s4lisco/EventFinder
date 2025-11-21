"use client";

import { ArrowRight, Calendar, Tag, MapPin as LocationIcon } from 'lucide-react';

const EventCard = ({ event }) => {
  return (
    <div 
      className="bg-zinc-800/60 backdrop-blur-md border border-zinc-700 
                 rounded-xl p-5 transition-all duration-300 
                 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-900/20"
    >
      <div className="flex flex-col h-full">
        {/* Category */}
        <span className="text-cyan-400 font-semibold text-sm tracking-wide">{event.category}</span>
        
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-100 mt-2 truncate">{event.title}</h3>
        
        {/* Date */}
        <div className="flex items-center text-sm text-gray-400 mt-1">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{new Date(event.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-300 mt-3 line-clamp-3 flex-grow">
          {event.description}
        </p>
        
        {/* Footer / Location */}
        <div className="mt-4 pt-4 border-t border-zinc-700 flex justify-between items-center">
          <div className="flex items-center text-xs text-gray-400">
             <LocationIcon className="h-4 w-4 mr-1.5" />
             <span>Lat: {event.lat.toFixed(2)}, Lon: {event.lon.toFixed(2)}</span>
          </div>
          <a 
            href="#" 
            onClick={(e) => e.preventDefault()} // TODO: Implement click (e.g., pan on map)
            className="text-cyan-400 text-sm font-medium flex items-center group"
          >
            Details
            <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default function OverviewComponent({ events, isLoading, error }) {
  
  if (isLoading) {
    return null; // Loading state wird in page.jsx gehandhabt
  }

  if (error) {
    return null; // Error state wird in page.jsx gehandhabt
  }

  return (
    <div className="p-8">
      <h2 className="text-3xl font-light text-gray-100 mb-8">Alle Events</h2>

      {events.length === 0 && !isLoading && (
         <div className="text-center text-gray-500 mt-20">
           <p>Keine Events gefunden.</p>
           <p className="text-sm">Klicke auf "Neues Event", um das erste Event zu erstellen.</p>
         </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}