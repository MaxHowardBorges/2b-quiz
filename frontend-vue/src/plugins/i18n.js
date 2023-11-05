import { createI18n } from 'vue-i18n';
import en_GB from '@/locales/en-GB.json';
import fr_FR from '@/locales/fr-FR.json';

export const i18n = createI18n({
  locale: import.meta.env.VITE_DEFAULT_LOCALE,
  fallbackLocale: import.meta.env.VITE_FALLBACK_LOCALE,
  legacy: false,
  messages: {
    en_GB,
    fr_FR,
  },
});
