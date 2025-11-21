"use client";

import { 
  LayoutDashboard, // Overview
  Map,             // Map View
  PlusCircle,      // Add Event
  UserCircle,      // Profile
  Shield,          // Admin
  LogIn,           // Login
  LogOut           // Logout
} from 'lucide-react';

const Logo = () => (
  <div className="flex items-center gap-2 px-4 pt-6 pb-8">
    <svg className="h-8 w-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path></svg>
    <span className="text-xl font-bold text-white tracking-tight">EventFinder</span>
  </div>
);

const NavButton = ({ icon: Icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left
        transition-colors duration-200
        ${isActive
          ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-900/50'
          : 'text-gray-300 hover:bg-zinc-800 hover:text-white'
        }
      `}
    >
      <Icon className="h-5 w-5" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

export default function SidebarComponent({ view, setView, user, onLogout, onAddEventClick }) {
  
  return (
    <aside className="flex h-screen w-64 flex-col overflow-y-auto bg-zinc-950/80 backdrop-blur-sm border-r border-zinc-800 p-4">
      <Logo />
      
      <nav className="flex-1 space-y-2">
        {/* Hauptnavigation */}
        <NavButton icon={LayoutDashboard} label="Overview" isActive={view === 'overview'} onClick={() => setView('overview')} />
        <NavButton icon={Map} label="Map View" isActive={view === 'map'} onClick={() => setView('map')} />
        
        {/* Event erstellen (nur für CREATOR/ADMIN) */}
        {user && (user.role === 'CREATOR' || user.role === 'ADMIN') && (
          <NavButton icon={PlusCircle} label="Neues Event" isActive={false} onClick={onAddEventClick} />
        )}
      </nav>

      {/* Benutzer-Navigation (unten) */}
      <div className="space-y-2 pt-4 border-t border-zinc-800">
        {user ? (
          <>
            {/* Admin-Link (nur für ADMIN) */}
            {user.role === 'ADMIN' && (
              <NavButton icon={Shield} label="Admin Dashboard" isActive={view === 'admin'} onClick={() => setView('admin')} />
            )}
            
            {/* Profil-Link (für alle Angemeldeten) */}
            <NavButton icon={UserCircle} label="Mein Profil" isActive={view === 'profile'} onClick={() => setView('profile')} />
            
            {/* Logout-Button */}
            <NavButton icon={LogOut} label="Logout" isActive={false} onClick={onLogout} />
            <span className="px-4 py-2 text-xs text-zinc-500 truncate block">Angemeldet als: {user.email}</span>
          </>
        ) : (
          <>
            {/* Login-Button */}
            <NavButton icon={LogIn} label="Login / Register" isActive={view === 'login'} onClick={() => setView('login')} />
          </>
        )}
      </div>
    </aside>
  );
}