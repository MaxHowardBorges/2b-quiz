import { createI18n } from 'vue-i18n';
import en_GB from '@/locales/en-GB.json';
import fr_FR from '@/locales/fr-FR.json';
import hu_HU from '@/locales/hu-HU.json';

export const i18n = createI18n({
  locale: import.meta.env.VITE_DEFAULT_LOCALE,
  fallbackLocale: import.meta.env.VITE_FALLBACK_LOCALE,
  legacy: false,
  globalInjection: true,
  messages: {
    en_GB,
    fr_FR,
    hu_HU,
  },
});
