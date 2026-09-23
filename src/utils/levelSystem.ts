import { Language } from '../types';

/**
 * Level calculation curve for CiberKids:
 * Level 1: 0 - 250 XP
 * Level 2: 250 - 550 XP (+300)
 * Level 3: 550 - 1000 XP (+450)
 * Level 4: 1000 - 1600 XP (+600)
 * Level 5: 1600 - 2350 XP (+750)
 * Level 6: 2350 - 3250 XP (+900)
 * Level 7: 3250 - 4300 XP (+1050)
 * Level 8: 4300 - 5500 XP (+1200)
 * Level 9: 5500 - 6850 XP (+1350)
 * Level 10: 6850 - 8400 XP (+1550)
 */

export function getLevelThreshold(level: number): number {
  if (level <= 1) return 250;
  if (level === 2) return 550;
  if (level === 3) return 1000;
  if (level === 4) return 1600;
  if (level === 5) return 2350;
  if (level === 6) return 3250;
  if (level === 7) return 4300;
  if (level === 8) return 5500;
  if (level === 9) return 6850;
  return 8400 + (level - 10) * 1800;
}

export interface LevelProgressionResult {
  leveledUp: boolean;
  oldLevel: number;
  newLevel: number;
  newXp: number;
  newXpToNextLevel: number;
  bonusCoins: number;
  levelsGained: number;
}

export function checkLevelUp(
  currentXp: number,
  currentLevel: number,
  currentXpToNextLevel: number,
  addedXp: number
): LevelProgressionResult {
  const newXp = currentXp + addedXp;
  let level = currentLevel;
  let threshold = currentXpToNextLevel > 0 ? currentXpToNextLevel : getLevelThreshold(level);
  let levelsGained = 0;

  // Check if new XP crosses the next level threshold
  while (newXp >= threshold) {
    level += 1;
    levelsGained += 1;
    threshold = getLevelThreshold(level);
  }

  const bonusCoins = levelsGained * 50;

  return {
    leveledUp: levelsGained > 0,
    oldLevel: currentLevel,
    newLevel: level,
    newXp,
    newXpToNextLevel: threshold,
    bonusCoins,
    levelsGained,
  };
}

export function getLevelTitle(level: number, language: Language = 'es'): string {
  const titles: Record<number, { es: string; en: string; fr: string }> = {
    1: {
      es: 'Novato del Ciberespacio',
      en: 'Cyber Novice',
      fr: 'Novice du Cyberespace',
    },
    2: {
      es: 'Explorador Digital',
      en: 'Digital Explorer',
      fr: 'Explorateur Numérique',
    },
    3: {
      es: 'Guardián de Datos',
      en: 'Data Guardian',
      fr: 'Gardien des Données',
    },
    4: {
      es: 'Defensor del Escudo',
      en: 'Shield Defender',
      fr: 'Défenseur du Bouclier',
    },
    5: {
      es: 'Centinela Cibernético',
      en: 'Cyber Sentinel',
      fr: 'Sentinelle Cyber',
    },
    6: {
      es: 'Maestro de la Privacidad',
      en: 'Privacy Master',
      fr: 'Maître de la Vie Privée',
    },
    7: {
      es: 'Héroe del Firewall',
      en: 'Firewall Hero',
      fr: 'Héros du Pare-feu',
    },
    8: {
      es: 'Comandante de Redes',
      en: 'Network Commander',
      fr: 'Commandant du Réseau',
    },
    9: {
      es: 'Vanguardia Cuántica',
      en: 'Quantum Vanguard',
      fr: 'Avant-Garde Quantique',
    },
    10: {
      es: 'Guardián Supremo Legendario',
      en: 'Legendary Supreme Guardian',
      fr: 'Gardien Suprême Légendaire',
    },
  };

  const entry = titles[Math.min(level, 10)] || titles[10];
  return entry[language] || entry.es;
}

export interface LevelRewardItem {
  id: string;
  icon: 'coins' | 'title' | 'shield' | 'star';
  title: string;
  desc: string;
}

export function getRewardsForLevel(
  level: number,
  bonusCoins: number,
  language: Language = 'es'
): LevelRewardItem[] {
  const titleName = getLevelTitle(level, language);

  if (language === 'en') {
    return [
      {
        id: 'coins',
        icon: 'coins',
        title: `+${bonusCoins} Gold Coins`,
        desc: 'Added to your vault inventory',
      },
      {
        id: 'title',
        icon: 'title',
        title: titleName,
        desc: 'New rank badge in your profile',
      },
      {
        id: 'shield',
        icon: 'shield',
        title: '+15 Cyber Defense',
        desc: 'Enhanced protection across all worlds',
      },
    ];
  }

  if (language === 'fr') {
    return [
      {
        id: 'coins',
        icon: 'coins',
        title: `+${bonusCoins} Pièces d'Or`,
        desc: 'Ajoutées à ton coffre-fort',
      },
      {
        id: 'title',
        icon: 'title',
        title: titleName,
        desc: 'Nouveau rang dans ton profil',
      },
      {
        id: 'shield',
        icon: 'shield',
        title: '+15 Défense Cyber',
        desc: 'Protection accrue dans tous les mondes',
      },
    ];
  }

  return [
    {
      id: 'coins',
      icon: 'coins',
      title: `+${bonusCoins} Monedas de Oro`,
      desc: 'Agregadas a tu inventario acorazado',
    },
    {
      id: 'title',
      icon: 'title',
      title: titleName,
      desc: 'Nuevo rango visible en tu perfil',
    },
    {
      id: 'shield',
      icon: 'shield',
      title: '+15 Defensa Cibernética',
      desc: 'Mayor blindaje en todos los mundos',
    },
  ];
}

/**
 * Synthesizes a celebratory 4-note ascending fanfare via Web Audio API.
 * Safe fallback if audio is not supported or context is suspended.
 */
export function playCelebratoryFanfare(): void {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const notes = [
      { freq: 523.25, time: 0.0, duration: 0.12 }, // C5
      { freq: 659.25, time: 0.13, duration: 0.12 }, // E5
      { freq: 783.99, time: 0.26, duration: 0.14 }, // G5
      { freq: 1046.50, time: 0.41, duration: 0.38 }, // C6
    ];

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.25, ctx.currentTime);
    masterGain.connect(ctx.destination);

    notes.forEach(({ freq, time, duration }) => {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + time);

      noteGain.gain.setValueAtTime(0.001, ctx.currentTime + time);
      noteGain.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + time + 0.02);
      noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + duration);

      osc.connect(noteGain);
      noteGain.connect(masterGain);

      osc.start(ctx.currentTime + time);
      osc.stop(ctx.currentTime + time + duration + 0.05);
    });

    // Close audio context after finish to free resources
    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 1500);
  } catch {
    // Graceful fallback for environments with audio restrictions
  }
}
