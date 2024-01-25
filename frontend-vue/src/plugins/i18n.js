import { createI18n } from 'vue-i18n';
import english from '@/locales/en-GB.json';
import français from '@/locales/fr-FR.json';
import magyar from '@/locales/hu-HU.json';

export const i18n = createI18n({
  locale: import.meta.env.VITE_DEFAULT_LOCALE,
  fallbackLocale: import.meta.env.VITE_FALLBACK_LOCALE,
  legacy: false,
  globalInjection: true,
  messages: {
    english,
    français,
    magyar,
  },
});
