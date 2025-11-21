"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// --- Context für Authentifizierung ---
// In einer echten App würden Sie React Context (oder Zustand/Redux) verwenden,
// um den Benutzerstatus global zu verwalten.
// Hier simulieren wir es mit 'user' State, der herumgereicht wird.
// const AuthContext = React.createContext(null);

// --- Component Imports ---
import SidebarComponent from './SidebarComponent';
import OverviewComponent from './OverviewComponent';
// NEUE Seiten-Komponenten
import AdminPage from './admin/page'; // Admin-Dashboard
import ProfilePage from './profile/page'; // Benutzerprofilseite
import LoginPage from './login/page'; // Login-Formular

// Dynamisches Importieren der MapComponent (unverändert)
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full z-0 flex items-center justify-center bg-zinc-800">
      <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
    </div>
  )
});

// A simple modal component for the form (jetzt im "Future Trendy" Design)
const EventFormModal = ({ isOpen, onClose, onSubmit, setFormData, formData }) => {
  if (!isOpen) return null;

  // Safely format lat/lon for display
  const latDisplay = formData.lat != null && !Number.isNaN(Number(formData.lat))
    ? Number(formData.lat).toFixed(4)
    : '...';
  const lonDisplay = formData.lon != null && !Number.isNaN(Number(formData.lon))
    ? Number(formData.lon).toFixed(4)
    : '...';

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-light text-cyan-400 mb-6">Neues Event erstellen</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Form fields */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300">Titel</label>
            <input 
              type="text" id="title" value={formData.title} onChange={handleChange} required 
              className="mt-1 block w-full rounded-lg border-zinc-700 bg-zinc-800 p-3 text-gray-100 shadow-sm focus:border-cyan-500 focus:ring-cyan-500" 
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">Beschreibung</label>
            <textarea 
              id="description" value={formData.description} onChange={handleChange} required rows="3" 
              className="mt-1 block w-full rounded-lg border-zinc-700 bg-zinc-800 p-3 text-gray-100 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
            ></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-300">Datum</label>
              <input 
                type="date" id="date" value={formData.date} onChange={handleChange} required 
                className="mt-1 block w-full rounded-lg border-zinc-700 bg-zinc-800 p-3 text-gray-100 shadow-sm focus:border-cyan-500 focus:ring-cyan-500" 
                style={{ colorScheme: 'dark' }} // Sorgt für dunkles Datums-Widget
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-300">Kategorie</label>
              <select 
                id="category" value={formData.category} onChange={handleChange} required 
                className="mt-1 block w-full rounded-lg border-zinc-700 bg-zinc-800 p-3 text-gray-100 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
              >
                <option value="Kultur">Kultur</option>
                <option value="Sport">Sport</option>
                <option value="Musik">Musik</option>
                <option value="Märkte">Märkte</option>
                <option value="Sonstiges">Sonstiges</option>
              </select>
            </div>
          </div>
          {/* Location info (read-only, set by map click) */}
          <div className="bg-zinc-800 p-3 rounded-lg border border-zinc-700">
            <p className="text-sm text-gray-400">
              Lat: {latDisplay} | Lon: {lonDisplay}
            </p>
            {formData.lat == null && <p className="text-xs text-red-500 mt-1">Bitte auf die Karte klicken, um Ort zu wählen.</p>}
          </div>
          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button" onClick={onClose} 
              className="py-2 px-4 rounded-lg text-sm font-medium text-gray-300 bg-zinc-800 hover:bg-zinc-700 transition-colors"
            >
              Abbrechen
            </button>
            <button 
              type="submit" disabled={!formData.lat} 
              className="py-2 px-4 rounded-lg shadow-sm text-sm font-medium text-black bg-cyan-400 hover:bg-cyan-300 disabled:bg-zinc-700 disabled:text-gray-400 transition-colors"
            >
              Event speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// --- Main Page Component (Jetzt der Haupt-Router) ---
export default function Home() {
  // 'view' steuert jetzt alle Seiten
  const [view, setView] = useState('overview'); // 'overview', 'map', 'admin', 'profile', 'login'
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    category: "Kultur",
    lat: null,
    lon: null,
  });

  // NEU: Benutzerstatus-Management
  const [user, setUser] = useState(null); // null = ausgeloggt, sonst { email: '...', role: '...' }

  // --- Mock-Login-Funktion (wird an die LoginPage übergeben) ---
  const handleLogin = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      
      // Store the token and user data
      localStorage.setItem('token', data.access_token);
      setUser({
        email: data.user.email,
        role: data.user.role,
        token: data.access_token
      });

      // Update auth header for subsequent requests
      const newEvents = await fetchEventsWithAuth(data.access_token);
      setEvents(newEvents);
      
      setView('overview');
    } catch (err) {
      console.error('Login failed:', err);
      // You might want to show this error in the UI
      alert('Login failed. Please check your credentials.');
    }
  };

  // Helper function to fetch events with auth
  const fetchEventsWithAuth = async (token) => {
    const response = await fetch('http://localhost:3001/api/events', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }
    
    return response.json();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setEvents([]);
    setView('overview');
  };
  
  // --- Datenabruf ---
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('token');
        const events = await fetchEventsWithAuth(token);
        setEvents(events);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load events. Please try again later.');
        if (err.message.includes('401')) {
          // Token expired or invalid
          localStorage.removeItem('token');
          setUser(null);
          setView('login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/events', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newEvent = await response.json();
      setEvents(prevEvents => [...prevEvents, newEvent]);
      alert("Event created successfully!");
      handleCloseModal();
    } catch (err) {
      console.error("Submit Error:", err);
      alert(`Failed to create event: ${err.message}`);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Reset form
    setFormData({
      title: "",
      description: "",
      date: "",
      category: "Kultur",
      lat: null,
      lon: null,
    });
  };

  // ADD THESE MISSING HANDLERS
  const handleOpenModal = (initial = {}) => {
    // optional: prefill form with provided initial values (e.g. lat/lon from map)
    setFormData(prev => ({ ...prev, ...initial }));
    setIsModalOpen(true);
  };

  const handleMapClick = (lat, lon) => {
    console.log('map clicked raw:', { lat, lon });

    // Normalisiere verschiedene Signaturen:
    // - handleMapClick(lat:number, lon:number)
    // - handleMapClick({ lat, lng })  (Leaflet)
    // - handleMapClick({ lat: { lat, lng } }) (falls verschachtelt)
    let nLat = null;
    let nLon = null;

    if (lat && typeof lat === 'object') {
      // Leaflet event or latlng-like
      if ('lat' in lat && 'lng' in lat) {
        nLat = Number(lat.lat);
        nLon = Number(lat.lng);
      } else if ('lat' in lat && 'lon' in lat) {
        nLat = Number(lat.lat);
        nLon = Number(lat.lon);
      } else if (lat.lat && typeof lat.lat === 'object' && 'lat' in lat.lat && 'lng' in lat.lat) {
        nLat = Number(lat.lat.lat);
        nLon = Number(lat.lat.lng);
      }
    } else {
      nLat = Number(lat);
      nLon = Number(lon);
    }

    const latVal = Number.isFinite(nLat) ? nLat : null;
    const lonVal = Number.isFinite(nLon) ? nLon : null;

    console.log('map clicked normalized:', { lat: latVal, lon: lonVal });

    // Prefill form and open modal
    handleOpenModal({ lat: latVal, lon: lonVal });
  };

  // --- Render Logic (stark geändert) ---
  
  // Wenn Benutzer ausgeloggt ist und versucht, eine geschützte Seite zu sehen
  // (Admin/Profile), leiten wir zum Login weiter.
  useEffect(() => {
    if (!user && (view === 'admin' || view === 'profile')) {
      setView('login');
    }
  }, [view, user]);

  return (
    <main className="flex h-screen w-screen bg-zinc-900 text-gray-200 overflow-hidden">
      
      {/* Sidebar Navigation (jetzt mit 'user' und 'logout') */}
      <SidebarComponent 
        view={view} 
        setView={setView} 
        user={user} // Übergibt den Benutzerstatus
        onLogout={handleLogout} // Übergibt Logout-Funktion
        onAddEventClick={handleOpenModal} 
      />

      {/* Main Content Area */}
      <div className="flex-1 h-full relative">
        {/* Lade- und Fehlerzustände (unverändert) */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex justify-center items-center bg-zinc-900/50 backdrop-blur-sm">
            <Loader2 className="h-10 w-10 text-cyan-400 animate-spin" />
          </div>
        )}
        {error && (
          <div className="absolute inset-0 z-20 flex justify-center items-center bg-red-900/50 p-8">
            <p className="text-red-300 text-center">{error}</p>
          </div>
        )}

        {/* === Conditional View Rendering (NEU) === */}

        {/* Ansicht: Overview */}
        <div className={`h-full w-full ${view === 'overview' ? 'block' : 'hidden'} overflow-y-auto`}>
           <OverviewComponent 
            events={events} 
            isLoading={isLoading}
            error={error}
          />
        </div>

        {/* Ansicht: Map */}
        <div className={`h-full w-full ${view === 'map' ? 'block' : 'hidden'}`}>
          <MapComponent
            events={events}
            onMapClick={handleMapClick}
            center={[47.3769, 8.5417]}
            zoom={10}
            isVisible={view === 'map'}
          />
        </div>

        {/* Ansicht: Admin Dashboard */}
        <div className={`h-full w-full ${view === 'admin' ? 'block' : 'hidden'} overflow-y-auto`}>
          {user?.role === 'ADMIN' ? (
            <AdminPage />
          ) : (
            <p className="p-8 text-red-500">Zugriff verweigert.</p> // Fällt zurück, falls User kein Admin ist
          )}
        </div>

        {/* Ansicht: Profile */}
        <div className={`h-full w-full ${view === 'profile' ? 'block' : 'hidden'} overflow-y-auto`}>
          <ProfilePage user={user} />
        </div>
        
        {/* Ansicht: Login */}
        <div className={`h-full w-full ${view === 'login' ? 'block' : 'hidden'} overflow-y-auto`}>
          <LoginPage onLogin={handleLogin} />
        </div>
      </div>

      {/* Event Form Modal (unverändert) */}
      <EventFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        formData={formData}
        setFormData={setFormData}
      />
    </main>
  );
}