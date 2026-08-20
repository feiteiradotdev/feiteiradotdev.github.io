export const locales = ['en', 'pt'] as const;
export const defaultLocale = 'en' as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  pt: 'Português',
};

export const localeFlags: Record<Locale, string> = {
  en: 'US',
  pt: 'PT',
};
