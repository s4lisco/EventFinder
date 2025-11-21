"use client";

import { useState, useEffect } from 'react';
import { Loader2, Check, X, UserCheck } from 'lucide-react';

// Diese Komponente wird von app/page.jsx gerendert, wenn view === 'admin'

// Mock-API-Funktionen (simulieren Backend-Aufrufe)
const fetchPendingEvents = async () => {
  // await fetch('/api/admin/events/pending')
  return [
    { id: 101, title: "Weihnachtsmarkt Zürich", status: 'PENDING', creator_id: 'user-abc' },
    { id: 102, title: "Konzert im Hallenstadion", status: 'PENDING', creator_id: 'user-xyz' },
  ];
};

const fetchPendingUsers = async () => {
  // await fetch('/api/admin/users/pending')
  return [
    { id: 'user-abc', email: 'peter@example.com', role: 'USER' },
    { id: 'user-xyz', email: 'maria@example.com', role: 'USER' },
  ];
};

const approveEvent = async (id) => {
  // await fetch(`/api/admin/events/${id}/approve`, { method: 'PATCH' })
  console.log(`Event ${id} genehmigt`);
  return true;
};

const promoteUser = async (id) => {
  // await fetch(`/api/admin/users/${id}/promote`, { method: 'PATCH' })
  console.log(`User ${id} befördert`);
  return true;
};


export default function AdminPage() {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState('events'); // 'events', 'users', 'none'

  useEffect(() => {
    const loadData = async () => {
      setLoading('events');
      setPendingEvents(await fetchPendingEvents());
      setLoading('users');
      setPendingUsers(await fetchPendingUsers());
      setLoading('none');
    };
    loadData();
  }, []);

  const handleApproveEvent = async (id) => {
    await approveEvent(id);
    setPendingEvents(prev => prev.filter(e => e.id !== id));
  };
  
  const handlePromoteUser = async (id) => {
    await promoteUser(id);
    setPendingUsers(prev => prev.filter(u => u.id !== id));
  };

  if (loading === 'events' || loading === 'users') {
    return (
      <div className="p-8 flex justify-center items-center h-full">
        <Loader2 className="h-10 w-10 text-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-12">
      <h2 className="text-3xl font-light text-gray-100 mb-8">Admin Dashboard</h2>

      {/* Abschnitt: Events genehmigen */}
      <div>
        <h3 className="text-xl font-semibold text-cyan-400 mb-4">Ausstehende Events</h3>
        <div className="bg-zinc-800/60 backdrop-blur-md border border-zinc-700 rounded-xl">
          <ul className="divide-y divide-zinc-700">
            {pendingEvents.length === 0 && <li className="p-4 text-zinc-500">Keine Events zur Genehmigung.</li>}
            {pendingEvents.map(event => (
              <li key={event.id} className="p-4 flex justify-between items-center">
                <div>
                  <span className="text-white font-medium">{event.title}</span>
                  <span className="text-zinc-400 text-sm ml-2">(ID: {event.id})</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => alert('Abgelehnt')} className="p-2 rounded-full bg-red-800 hover:bg-red-700 text-white transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleApproveEvent(event.id)} className="p-2 rounded-full bg-green-800 hover:bg-green-700 text-white transition-colors">
                    <Check className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Abschnitt: Benutzer freischalten */}
      <div>
        <h3 className="text-xl font-semibold text-cyan-400 mb-4">Ausstehende "Creator"-Anträge</h3>
        <div className="bg-zinc-800/60 backdrop-blur-md border border-zinc-700 rounded-xl">
          <ul className="divide-y divide-zinc-700">
            {pendingUsers.length === 0 && <li className="p-4 text-zinc-500">Keine Anträge offen.</li>}
            {pendingUsers.map(user => (
              <li key={user.id} className="p-4 flex justify-between items-center">
                <div>
                  <span className="text-white font-medium">{user.email}</span>
                  <span className="text-zinc-400 text-sm ml-2">(Rolle: {user.role})</span>
                </div>
                <button onClick={() => handlePromoteUser(user.id)} className="flex items-center gap-2 py-1 px-3 rounded-full bg-cyan-600 hover:bg-cyan-500 text-black text-sm font-medium transition-colors">
                  <UserCheck className="h-4 w-4" />
                  Zu "Creator" befördern
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
}