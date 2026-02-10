// frontend/src/components/LanguageSwitcher.tsx
import { useLocale, useTranslations, locales } from '@/utils/i18n';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const t = useTranslations();

  return (
    <div className="relative inline-block">
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as any)}
        className="appearance-none rounded-button border-2 border-border bg-white px-3 py-2 pr-8 text-xs font-semibold text-text transition-all duration-150 hover:bg-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {t(`language.${loc}`)}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
        <svg className="h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      </div>
    </div>
  );
}
