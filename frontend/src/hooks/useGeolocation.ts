import { useCallback, useEffect, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Geolocation, Position } from '@capacitor/geolocation';

export type LatLng = { lat: number; lon: number };

export type UseGeolocationOptions = {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
};

export type UseGeolocation = {
  position: LatLng | null;
  error: string | null;
  loading: boolean;
  getCurrentPosition: () => Promise<LatLng | null>;
  watchPosition: (onChange: (pos: LatLng) => void) => Promise<string | null>;
  clearWatch: (id?: string | null) => Promise<void>;
};

const isNative = () => Capacitor.isNativePlatform();

export default function useGeolocation(options: UseGeolocationOptions = {}): UseGeolocation {
  const [position, setPosition] = useState<LatLng | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const watchIdRef = useRef<string | null>(null);

  const toLatLng = (pos: Position): LatLng => ({
    lat: pos.coords.latitude,
    lon: pos.coords.longitude,
  });

  const getCurrentPosition = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (typeof window === 'undefined') {
        return null; // SSR: nichts tun
      }
      if (isNative()) {
        const pos = await Geolocation.getCurrentPosition({
          enableHighAccuracy: options.enableHighAccuracy ?? true,
          timeout: options.timeout ?? 10000,
          maximumAge: options.maximumAge ?? 0,
        });
        const ll = toLatLng(pos);
        setPosition(ll);
        return ll;
      }
      // Browser Fallback
      const ll = await new Promise<LatLng>((resolve, reject) => {
        if (!('geolocation' in navigator)) {
          reject(new Error('Geolocation nicht verfügbar'));
          return;
        }
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
          (err) => reject(new Error(err.message || 'Geolocation Fehler')),
          {
            enableHighAccuracy: options.enableHighAccuracy ?? true,
            timeout: options.timeout ?? 10000,
            maximumAge: options.maximumAge ?? 0,
          }
        );
      });
      setPosition(ll);
      return ll;
    } catch (e: any) {
      const msg = e?.message ?? 'Fehler beim Bestimmen der Position';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [options.enableHighAccuracy, options.maximumAge, options.timeout]);

  const watchPosition = useCallback(async (onChange: (pos: LatLng) => void) => {
    try {
      if (typeof window === 'undefined') return null;
      if (isNative()) {
        const id = await Geolocation.watchPosition({
          enableHighAccuracy: options.enableHighAccuracy ?? true,
        }, (pos) => {
          if (pos) {
            const ll = toLatLng(pos);
            setPosition(ll);
            onChange(ll);
          }
        });
        watchIdRef.current = id as string | null;
        return watchIdRef.current;
      }
      // Browser Fallback
      const id = navigator.geolocation.watchPosition(
        (pos) => {
          const ll = { lat: pos.coords.latitude, lon: pos.coords.longitude };
          setPosition(ll);
          onChange(ll);
        },
        (err) => setError(err.message || 'Geolocation Fehler'),
        { enableHighAccuracy: options.enableHighAccuracy ?? true }
      );
      watchIdRef.current = String(id);
      return watchIdRef.current;
    } catch (e: any) {
      setError(e?.message ?? 'Fehler beim Überwachen der Position');
      return null;
    }
  }, [options.enableHighAccuracy]);

  const clearWatch = useCallback(async (id?: string | null) => {
    const toClear = id ?? watchIdRef.current;
    if (!toClear) return;
    try {
      if (isNative()) {
        await Geolocation.clearWatch({ id: toClear });
      } else if (typeof window !== 'undefined') {
        navigator.geolocation.clearWatch(Number(toClear));
      }
      watchIdRef.current = null;
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    return () => {
      void clearWatch();
    };
  }, [clearWatch]);

  return { position, error, loading, getCurrentPosition, watchPosition, clearWatch };
}

