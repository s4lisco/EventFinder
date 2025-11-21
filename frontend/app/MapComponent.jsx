"use client";

import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix for default Leaflet icon not showing
// Manuelles Importieren der Bilder ist in Next.js oft schwierig,
// daher verwenden wir die CDN-Links als Workaround.

let DefaultIcon;

if (typeof window !== 'undefined') {
    // This code runs only in the browser
    DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = DefaultIcon;
}


// A component to handle map click events
const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
};

// NEU: Helfer-Komponente, um die Kartengrösse zu aktualisieren
const ResizeHandler = ({ isVisible }) => {
  const map = useMap();
  useEffect(() => {
    if (isVisible) {
      // Verzögert den Aufruf leicht, um sicherzustellen, dass der Container
      // seine endgültige Grösse hat, bevor die Karte neu berechnet wird.
      const timer = setTimeout(() => {
        map.invalidateSize();
      }, 100); // 100ms Verzögerung
      
      return () => clearTimeout(timer); // Aufräumen
    }
  }, [isVisible, map]); // Führt dies aus, wenn isVisible sich ändert

  return null;
};


// The main Map component
const MapComponent = ({ events, onMapClick, center, zoom, isVisible }) => {
  
  // Workaround, um das Icon-Problem zu beheben, wenn L.Marker... nicht funktioniert
  const icon = DefaultIcon || L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
  });

  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%', zIndex: 10 }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      
      {/* Add event markers */}
      {events.map(event => (
        <Marker key={event.id} position={[event.lat, event.lon]} icon={icon}>
          <Popup>
            <div className="font-bold text-indigo-700 mb-1">{event.title}</div>
            <div className="text-xs text-gray-500 mb-2">{event.category} | {event.date}</div>
            <p className="text-sm">{event.description}</p>
          </Popup>
        </Marker>
      ))}

      {/* Component to capture map clicks */}
      <MapClickHandler onMapClick={onMapClick} />
      
      {/* NEU: Fügt den Resize-Handler hinzu */}
      <ResizeHandler isVisible={isVisible} />
    </MapContainer>
  );
};

export default MapComponent;