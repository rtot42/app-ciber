import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Sparkles, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';
import { CiberMascot } from '../CiberMascot';
import { useLanguage } from '../../i18n/LanguageContext';
import { ChildAgeGroup } from '../../types';

interface MemoryCard {
  id: number;
  pairId: string;
  icon: string;
}

interface MemoryMatchGameProps {
  onComplete: () => void;
  ageGroup?: ChildAgeGroup;
}

export const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({ onComplete, ageGroup = '8–10' }) => {
  const { language } = useLanguage();

  const locData = {
    es: {
      tag: 'Mecánica 9 / Memoria',
      title: 'Parejas de Ciberseguridad',
      pairsBadge: (curr: number, total: number) => `${curr} / ${total} parejas`,
      mascot: 'Ciber dice: "Encuentra las 4 parejas de herramientas de seguridad digital para reforzar tu memoria defensiva."',
      completeBtn: '¡Completar Desafío de Memoria!',
      findMoreBtn: 'Encuentra las 4 parejas de cartas',
      labels: {
        shield: 'Antivirus',
        key: '2FA Clave',
        fish: 'Anti-Phishing',
        backup: 'Copia Nube',
      } as Record<string, string>,
    },
    fr: {
      tag: 'Mécanique 9 / Mémoire',
      title: 'Paires de Cybersécurité',
      pairsBadge: (curr: number, total: number) => `${curr} / ${total} paires`,
      mascot: 'Ciber dit : "Trouve les 4 paires d’outils de sécurité numérique pour muscler ta mémoire défensive."',
      completeBtn: 'Terminer le Défi de Mémoire !',
      findMoreBtn: 'Trouve les 4 paires de cartes',
      labels: {
        shield: 'Antivirus',
        key: 'Clé 2FA',
        fish: 'Anti-Phishing',
        backup: 'Sauvegarde Cloud',
      } as Record<string, string>,
    },
    en: {
      tag: 'Mechanic 9 / Memory',
      title: 'Cybersecurity Match Pairs',
      pairsBadge: (curr: number, total: number) => `${curr} / ${total} pairs`,
      mascot: 'Ciber says: "Find all 4 pairs of digital security tools to strengthen your cyber defense memory."',
      completeBtn: 'Complete Memory Challenge!',
      findMoreBtn: 'Find all 4 card pairs',
      labels: {
        shield: 'Antivirus',
        key: '2FA Key',
        fish: 'Anti-Phishing',
        backup: 'Cloud Backup',
      } as Record<string, string>,
    },
  };

  const loc = locData[language] || locData.en || locData.es;

  const PAIRS_CONFIG = [
    { pairId: 'shield', icon: '🛡️' },
    { pairId: 'key', icon: '🔑' },
    { pairId: 'fish', icon: '🎣' },
    { pairId: 'backup', icon: '💾' },
  ];

  const deck = useMemo<MemoryCard[]>(() => {
    return [
      ...PAIRS_CONFIG.map((p, idx) => ({ id: idx, pairId: p.pairId, icon: p.icon })),
      ...PAIRS_CONFIG.map((p, idx) => ({ id: idx + 4, pairId: p.pairId, icon: p.icon })),
    ].sort(() => Math.random() - 0.5);
  }, []);

  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);

  const handleCardClick = (card: MemoryCard) => {
    if (flipped.length === 2 || flipped.includes(card.id) || matched.includes(card.pairId)) {
      return;
    }

    const nextFlipped = [...flipped, card.id];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      const firstCard = deck.find((c) => c.id === nextFlipped[0])!;
      const secondCard = deck.find((c) => c.id === nextFlipped[1])!;

      if (firstCard.pairId === secondCard.pairId) {
        setMatched((prev) => [...prev, firstCard.pairId]);
        setFlipped([]);
      } else {
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
    }
  };

  const isAllMatched = matched.length === PAIRS_CONFIG.length;

  return (
    <div className="flex-1 min-h-0 flex flex-col p-5 sm:p-6 bg-slate-50 text-slate-800 select-none overflow-y-auto scrollbar-none space-y-6 sm:space-y-7 pb-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-xl">
            🃏
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold text-pink-600 tracking-wider">
              {loc.tag}
            </div>
            <h2 className="text-base font-black text-slate-900">{loc.title}</h2>
          </div>
        </div>
        <span className="text-xs font-bold text-slate-600">
          {loc.pairsBadge(matched.length, PAIRS_CONFIG.length)}
        </span>
      </div>

      {/* Mascot advice */}
      <div className="flex items-center gap-3.5 p-4 bg-pink-50/80 rounded-3xl border border-pink-100">
        <CiberMascot size="sm" expression={isAllMatched ? 'celebrating' : 'thinking'} />
        <div className="text-xs sm:text-sm text-pink-950 leading-relaxed">
          {loc.mascot}
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-4 gap-2.5 py-2">
        {deck.map((card) => {
          const isCardFlipped = flipped.includes(card.id) || matched.includes(card.pairId);

          return (
            <motion.button
              key={card.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCardClick(card)}
              className={`h-24 rounded-2xl border-2 transition-all flex flex-col items-center justify-center p-2 cursor-pointer shadow-sm ${
                isCardFlipped
                  ? 'bg-white border-pink-400'
                  : 'bg-gradient-to-br from-pink-500 to-rose-600 border-pink-600 text-white'
              }`}
            >
              {isCardFlipped ? (
                <div className="flex flex-col items-center">
                  <span className="text-2xl">{card.icon}</span>
                  <span className="text-[9px] font-bold text-slate-700 mt-1 truncate max-w-full">
                    {loc.labels[card.pairId] || card.pairId}
                  </span>
                </div>
              ) : (
                <span className="text-lg font-black opacity-60">CK</span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Action CTA */}
      <button
        onClick={onComplete}
        disabled={!isAllMatched}
        className={`w-full py-3.5 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
          isAllMatched
            ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/20 active:scale-95'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
        }`}
      >
        <ShieldCheck className="w-4 h-4" />
        <span>{isAllMatched ? loc.completeBtn : loc.findMoreBtn}</span>
      </button>
    </div>
  );
};
