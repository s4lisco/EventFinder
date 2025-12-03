import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';

export type Position = {
  coords: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
};

export async function getCurrentPosition(options?: { enableHighAccuracy?: boolean; timeout?: number; maximumAge?: number }): Promise<Position> {
  // SSR guard
  if (typeof window === 'undefined') {
    throw new Error('Geolocation not available during SSR');
  }

  if (Capacitor.isNativePlatform()) {
    const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: options?.enableHighAccuracy });
    return { coords: { latitude: pos.coords.latitude, longitude: pos.coords.longitude, accuracy: pos.coords.accuracy } };
  }

  return new Promise<Position>((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({ coords: { latitude: pos.coords.latitude, longitude: pos.coords.longitude, accuracy: pos.coords.accuracy } });
      },
      (err) => reject(err),
      {
        enableHighAccuracy: options?.enableHighAccuracy ?? true,
        timeout: options?.timeout ?? 10000,
        maximumAge: options?.maximumAge ?? 0,
      },
    );
  });
}
