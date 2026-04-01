import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import fi from './fi.json';
import en from './en.json';

const deviceLang = Localization.getLocales()?.[0]?.languageCode ?? 'fi';

i18n.use(initReactI18next).init({
  resources: {
    fi: { translation: fi },
    en: { translation: en },
  },
  lng: deviceLang === 'fi' ? 'fi' : 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
