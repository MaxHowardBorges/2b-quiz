import { createI18n } from 'vue-i18n';
export const i18n = createI18n({
  locale: import.meta.env.VITE_DEFAULT_LOCALE,
  fallbackLocale: import.meta.env.VITE_FALLBACK_LOCALE,
  legacy: false,
  globalInjection: true,
  messages: await loadAllLocalMessages(),
});

export async function loadAllLocalMessages() {
  const locales = await getAllLocalListFromFiles();
  const messages = {};
  for (const locale of locales) {
    messages[locale] = await import(`@/locales/${locale}.json`);
  }
  return messages;
}

export async function getAllLocalListFromFiles() {
  const locales = [];
  const files = await import.meta.globEager('@/locales/*.json');
  for (const path in files) {
    const locale = path.match(/([a-z]{2}-[A-Z]{2})\.json$/)?.[1];
    if (locale) {
      locales.push(locale);
    }
  }
  return locales;
}
