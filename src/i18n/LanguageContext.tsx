import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, World, AchievementBadge, GameHotspot } from '../types';
import { TRANSLATIONS, Translations } from './translations';
import { getLocalizedWorlds, getLocalizedBadges, getLocalizedHotspots } from './localizedData';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string, params?: Record<string, string | number>) => string;
  translations: Translations;
  worlds: World[];
  badges: AchievementBadge[];
  hotspots: GameHotspot[];
  languages: Array<{ id: Language; label: string; flag: string; short: string }>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGES_META: Array<{ id: Language; label: string; flag: string; short: string }> = [
  { id: 'es', label: 'Español', flag: '🇪🇸', short: 'ES' },
  { id: 'fr', label: 'Français', flag: '🇫🇷', short: 'FR' },
  { id: 'en', label: 'English', flag: '🇬🇧', short: 'EN' },
];

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('ciberkids_language') as Language;
      if (saved && ['es', 'fr', 'en'].includes(saved)) {
        return saved;
      }
    } catch {
      // safe fallback
    }
    return 'es';
  });

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem('ciberkids_language', newLang);
    } catch {
      // safe fallback
    }
  };

  const currentTranslations = TRANSLATIONS[language] || TRANSLATIONS.es;

  // Helper function to get nested translation strings, e.g. t('home.greeting', { name: 'Lucas' })
  const t = (path: string, params?: Record<string, string | number>): string => {
    const keys = path.split('.');
    let current: any = currentTranslations;

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        // Fallback to Spanish if missing
        let fallback: any = TRANSLATIONS.es;
        for (const fbKey of keys) {
          if (fallback && typeof fallback === 'object' && fbKey in fallback) {
            fallback = fallback[fbKey];
          } else {
            fallback = path;
            break;
          }
        }
        current = fallback;
        break;
      }
    }

    if (typeof current !== 'string') {
      return path;
    }

    if (params) {
      let result = current;
      for (const [pKey, pVal] of Object.entries(params)) {
        result = result.replaceAll(`{${pKey}}`, String(pVal));
      }
      return result;
    }

    return current;
  };

  const worlds = getLocalizedWorlds(language);
  const badges = getLocalizedBadges(language);
  const hotspots = getLocalizedHotspots(language);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        translations: currentTranslations,
        worlds,
        badges,
        hotspots,
        languages: LANGUAGES_META,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
