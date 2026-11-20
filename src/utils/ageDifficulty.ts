import { ChildAgeGroup, Language } from '../types';

export interface AgeTierMeta {
  id: ChildAgeGroup;
  tierNumber: 1 | 2 | 3;
  name: string;
  shortLabel: string;
  difficultyLabel: string;
  badgeColor: string;
  accentHex: string;
  timeLimitSeconds: number | null; // null = untimed/relaxed
  hintLevel: 'guided' | 'tactical' | 'minimal';
  minAccuracyForThreeStars: number;
}

export function getAgeTierMeta(ageGroup: ChildAgeGroup, language: Language): AgeTierMeta {
  if (ageGroup === '13–14') {
    return {
      id: '13–14',
      tierNumber: 3,
      name:
        language === 'fr'
          ? 'Stratège Pro'
          : language === 'en'
          ? 'Pro Strategist'
          : 'Estratega Pro',
      shortLabel: '13–14',
      difficultyLabel:
        language === 'fr'
          ? 'Avancé · 13–14 ans'
          : language === 'en'
          ? 'Advanced · 13–14 yrs'
          : 'Avanzado · 13–14 años',
      badgeColor: 'text-purple-700 bg-purple-50 border-purple-200',
      accentHex: '#7C3AED',
      timeLimitSeconds: 90,
      hintLevel: 'minimal',
      minAccuracyForThreeStars: 90,
    };
  }

  if (ageGroup === '11–12') {
    return {
      id: '11–12',
      tierNumber: 2,
      name:
        language === 'fr'
          ? 'Gardien Tactique'
          : language === 'en'
          ? 'Tactical Guardian'
          : 'Guardián Táctico',
      shortLabel: '11–12',
      difficultyLabel:
        language === 'fr'
          ? 'Intermédiaire · 11–12 ans'
          : language === 'en'
          ? 'Intermediate · 11–12 yrs'
          : 'Intermedio · 11–12 años',
      badgeColor: 'text-cyan-700 bg-cyan-50 border-cyan-200',
      accentHex: '#0284C7',
      timeLimitSeconds: 120,
      hintLevel: 'tactical',
      minAccuracyForThreeStars: 85,
    };
  }

  return {
    id: '8–10',
    tierNumber: 1,
    name:
      language === 'fr'
        ? 'Cadet Explorateur'
        : language === 'en'
        ? 'Explorer Cadet'
        : 'Cadete Explorador',
    shortLabel: '8–10',
    difficultyLabel:
      language === 'fr'
        ? 'Guidé · 8–10 ans'
        : language === 'en'
        ? 'Guided · 8–10 yrs'
        : 'Guiado · 8–10 años',
    badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    accentHex: '#059669',
    timeLimitSeconds: null,
    hintLevel: 'guided',
    minAccuracyForThreeStars: 80,
  };
}

export function computeStars(accuracy: number, ageGroup: ChildAgeGroup): 1 | 2 | 3 {
  const threeStarMin = ageGroup === '13–14' ? 90 : ageGroup === '11–12' ? 85 : 80;
  if (accuracy >= threeStarMin) return 3;
  if (accuracy >= 60) return 2;
  return 1;
}
