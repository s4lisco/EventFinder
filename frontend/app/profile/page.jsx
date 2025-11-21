"use client";

import { useState, useEffect } from 'react';
import { Loader2, ShieldCheck, Edit3 } from 'lucide-react';

// Diese Komponente wird von app/page.jsx gerendert, wenn view === 'profile'

// Mock-API-Funktion
const fetchMyEvents = async (userId) => {
  // await fetch('/api/events/my-events')
  return [
    { id: 1, title: "Mein erstes Event", status: 'PENDING', date: '2025-10-10' },
    { id: 2, title: "Mein zweites Event", status: 'APPROVED', date: '2025-11-12' },
  ];
};

const requestCreatorRole = async (userId) => {
  // Hier würde eine API-Anfrage gesendet, die den Admin benachrichtigt
  // oder automatisch die Rolle ändert, wenn der Admin 'USER' -> 'CREATOR' macht
  console.log(`User ${userId} beantragt Creator-Rolle`);
  alert("Antrag gesendet. Ein Admin wird Ihr Konto prüfen.");
  return true;
};

const StatusBadge = ({ status }) => {
  const styles = {
    PENDING: 'bg-yellow-800 text-yellow-200 border-yellow-700',
    APPROVED: 'bg-green-800 text-green-200 border-green-700',
    REJECTED: 'bg-red-800 text-red-200 border-red-700',
  };
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${styles[status] || ''}`}>
      {status}
    </span>
  );
};

export default function ProfilePage({ user }) {
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const loadData = async () => {
        setLoading(true);
        setMyEvents(await fetchMyEvents(user.userId)); // userId käme vom user-Objekt
        setLoading(false);
      };
      loadData();
    }
  }, [user]);

  if (!user) {
    return <p className="p-8 text-red-500">Nicht angemeldet.</p>;
  }

  return (
    <div className="p-8 space-y-12">
      <h2 className="text-3xl font-light text-gray-100 mb-8">Mein Profil</h2>

      {/* Profil-Informationen */}
      <div className="bg-zinc-800/60 backdrop-blur-md border border-zinc-700 rounded-xl p-6 flex justify-between items-center">
        <div>
          <span className="text-zinc-400 text-sm">Angemeldete E-Mail</span>
          <p className="text-white text-xl font-medium">{user.email}</p>
        </div>
        <div>
          <span className="text-zinc-400 text-sm">Aktuelle Rolle</span>
          <p className="text-cyan-400 text-xl font-bold tracking-wide">{user.role}</p>
        </div>
        
        {/* Aktion für Rolle 'USER' */}
        {user.role === 'USER' && (
           <button 
             onClick={() => requestCreatorRole(user.userId)}
             className="flex items-center gap-2 py-2 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black font-medium transition-colors"
           >
              <ShieldCheck className="h-5 w-5" />
              "Creator"-Status beantragen
           </button>
        )}
      </div>

      {/* Abschnitt: Meine erstellten Events */}
      <div>
        <h3 className="text-xl font-semibold text-cyan-400 mb-4">Meine erstellten Events</h3>
        <div className="bg-zinc-800/60 backdrop-blur-md border border-zinc-700 rounded-xl">
          {loading ? (
             <div className="p-8 flex justify-center items-center">
               <Loader2 className="h-6 w-6 text-cyan-400 animate-spin" />
             </div>
          ) : (
             <ul className="divide-y divide-zinc-700">
              {myEvents.length === 0 && <li className="p-4 text-zinc-500">Sie haben noch keine Events erstellt.</li>}
              {myEvents.map(event => (
                <li key={event.id} className="p-4 flex justify-between items-center">
                  <div>
                    <span className="text-white font-medium">{event.title}</span>
                    <span className="text-zinc-400 text-sm ml-3">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusBadge status={event.status} />
                    <button className="text-zinc-500 hover:text-cyan-400">
                      <Edit3 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}