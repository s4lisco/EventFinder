// frontend/src/utils/i18n.ts
import { createContext, useContext } from 'react';

export type Locale = 'de' | 'gsw-CH';

export const defaultLocale: Locale = 'de';
export const locales: Locale[] = ['de', 'gsw-CH'];

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

export const I18nContext = createContext<I18nContextType>({
  locale: defaultLocale,
  setLocale: () => {},
  t: (key: string) => key,
});

export const useTranslations = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslations must be used within I18nProvider');
  }
  return context.t;
};

export const useLocale = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useLocale must be used within I18nProvider');
  }
  return { locale: context.locale, setLocale: context.setLocale };
};

// Helper to get nested value from object using dot notation
export function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((current, key) => current?.[key], obj) || path;
}
