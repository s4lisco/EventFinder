// frontend/src/components/I18nProvider.tsx
import { ReactNode, useEffect, useState } from 'react';
import { I18nContext, Locale, defaultLocale, locales, getNestedValue } from '@/utils/i18n';
import deMessages from '../../messages/de.json';
import gswMessages from '../../messages/gsw-CH.json';

interface I18nProviderProps {
  children: ReactNode;
}

const LOCALE_COOKIE = 'NEXT_LOCALE';

const messagesByLocale = {
  'de': deMessages,
  'gsw-CH': gswMessages,
};

export function I18nProvider({ children }: I18nProviderProps) {
  // Initialize with saved locale if available
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      const savedLocale = getCookie(LOCALE_COOKIE) || localStorage.getItem(LOCALE_COOKIE);
      if (savedLocale && locales.includes(savedLocale as Locale)) {
        return savedLocale as Locale;
      }
    }
    return defaultLocale;
  });

  const [messages, setMessages] = useState<Record<string, any>>(messagesByLocale[locale]);

  // Load messages when locale changes
  useEffect(() => {
    setMessages(messagesByLocale[locale]);
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    // Save to both cookie and localStorage
    setCookie(LOCALE_COOKIE, newLocale, 365);
    localStorage.setItem(LOCALE_COOKIE, newLocale);
  };

  const t = (key: string): string => {
    return getNestedValue(messages, key);
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

// Cookie helpers
function setCookie(name: string, value: string, days: number) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name: string): string | null {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
