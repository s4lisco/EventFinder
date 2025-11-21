"use client";

import { useState } from 'react';

// Diese Komponente wird von app/page.jsx gerendert, wenn view === 'login'

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');  // Add username state
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }

        const registerData = { email, password, username };
        console.log('Sending registration data:', registerData);

        const registerResponse = await fetch('http://localhost:3001/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(registerData),
        });

        // Add better error handling
        const errorData = await registerResponse.json();
        console.error('Full server response:', errorData); // Debug log

        if (!registerResponse.ok) {
          throw new Error(errorData.message || 'Registration failed');
        }

        // Nach erfolgreicher Registrierung, fahre mit dem Login fort
        await onLogin(email, password);
      } else {
        await onLogin(email, password);
      }
    } catch (err) {
      setError(err.message);
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full flex justify-center items-center p-8">
      <div className="bg-zinc-800/60 backdrop-blur-md border border-zinc-700 rounded-xl shadow-lg w-full max-w-md p-8">
        
        <h2 className="text-3xl font-light text-cyan-400 mb-6 text-center">
          {isRegister ? "Konto erstellen" : "Willkommen zurück"}
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* E-Mail */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">E-Mail</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              disabled={loading}
              className="mt-1 block w-full rounded-lg border-zinc-700 bg-zinc-800 p-3 text-gray-100 shadow-sm focus:border-cyan-500 focus:ring-cyan-500" 
            />
          </div>
          
          {isRegister && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">Username</label>
              <input 
                type="text" 
                id="username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                disabled={loading}
                className="mt-1 block w-full rounded-lg border-zinc-700 bg-zinc-800 p-3 text-gray-100 shadow-sm focus:border-cyan-500 focus:ring-cyan-500" 
              />
            </div>
          )}
          
          {/* Passwort */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Passwort</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              disabled={loading}
              className="mt-1 block w-full rounded-lg border-zinc-700 bg-zinc-800 p-3 text-gray-100 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
            />
          </div>
          
          {isRegister && (
            <div>
              <label htmlFor="password-confirm" className="block text-sm font-medium text-gray-300">
                Passwort bestätigen
              </label>
              <input 
                type="password" 
                id="password-confirm" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
                disabled={loading}
                className="mt-1 block w-full rounded-lg border-zinc-700 bg-zinc-800 p-3 text-gray-100 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg shadow-sm text-sm font-medium text-black bg-cyan-400 hover:bg-cyan-300 disabled:bg-gray-600 disabled:text-gray-400 transition-colors"
            >
              {loading ? "Bitte warten..." : (isRegister ? "Registrieren" : "Login")}
            </button>
          </div>
          
          {/* Umschalter */}
          <div className="text-center pt-4">
            <button 
              type="button" 
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              disabled={loading}
              className="text-sm text-cyan-400 hover:text-cyan-300 disabled:text-gray-500"
            >
              {isRegister ? "Bereits ein Konto? Zum Login" : "Noch kein Konto? Jetzt registrieren"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}