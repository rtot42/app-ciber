import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lightbulb,
  Dices,
  Check,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Share2,
} from 'lucide-react';
import { CYBER_TIPS_DATA, CyberTip } from '../data/cyberTipsData';
import { useLanguage } from '../i18n/LanguageContext';
import { CiberMascot } from './CiberMascot';

interface CyberTipOfTheDayProps {
  onLearnTip?: (tipId: string) => void;
  className?: string;
}

export const CyberTipOfTheDay: React.FC<CyberTipOfTheDayProps> = ({
  onLearnTip,
  className = '',
}) => {
  const { language } = useLanguage();

  // Deterministic daily tip index based on calendar day
  const dailyIndex = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return dayOfYear % CYBER_TIPS_DATA.length;
  }, []);

  const [currentIndex, setCurrentIndex] = useState<number>(dailyIndex);
  const [hasAcknowledged, setHasAcknowledged] = useState<boolean>(false);
  const [isRotating, setIsRotating] = useState<boolean>(false);

  const currentTip: CyberTip = CYBER_TIPS_DATA[currentIndex] || CYBER_TIPS_DATA[0];
  const isDailyDefault = currentIndex === dailyIndex;

  // Formatted short date for header
  const formattedToday = useMemo(() => {
    const now = new Date();
    const locale = language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : 'es-ES';
    return now.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
  }, [language]);

  const handleNextTip = () => {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 450);
    setHasAcknowledged(false);
    setCurrentIndex((prev) => (prev + 1) % CYBER_TIPS_DATA.length);
  };

  const handleAcknowledge = () => {
    setHasAcknowledged(true);
    if (onLearnTip) {
      onLearnTip(currentTip.id);
    }
  };

  const langKey = (language === 'fr' ? 'fr' : language === 'en' ? 'en' : 'es') as
    | 'es'
    | 'en'
    | 'fr';

  return (
    <div
      id="cyber-tip-of-the-day"
      className={`shrink-0 w-full rounded-3xl bg-white border border-slate-100 shadow-sm p-4 sm:p-5 relative overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* Decorative top accent line with category color */}
      <div
        className="absolute top-0 left-0 right-0 h-1 transition-colors duration-300"
        style={{ backgroundColor: currentTip.badgeColor }}
      />

      {/* Card Header: Badge, Mascot & Daily Indicator */}
      <div className="flex items-center justify-between gap-2 mb-3.5">
        <div className="flex items-center gap-2 flex-wrap">
          <motion.div
            whileHover={{ scale: 1.04 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-2xs"
            style={{ backgroundColor: currentTip.badgeColor }}
          >
            <span>{currentTip.categoryIcon}</span>
            <span>{currentTip.categoryLabel[langKey]}</span>
          </motion.div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100/90 text-slate-600 text-[10px] font-bold">
            <Calendar className="w-3 h-3 text-slate-500" />
            <span>
              {isDailyDefault
                ? language === 'fr'
                  ? `Conseil du ${formattedToday}`
                  : language === 'en'
                  ? `Today's Tip • ${formattedToday}`
                  : `Consejo de Hoy • ${formattedToday}`
                : language === 'fr'
                ? `Astuce ${currentIndex + 1}/${CYBER_TIPS_DATA.length}`
                : language === 'en'
                ? `Tip ${currentIndex + 1}/${CYBER_TIPS_DATA.length}`
                : `Tip ${currentIndex + 1} de ${CYBER_TIPS_DATA.length}`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          >
            <CiberMascot
              size="sm"
              expression={hasAcknowledged ? 'excited' : 'happy'}
              className="shrink-0"
            />
          </motion.div>
        </div>
      </div>

      {/* Animated Tip Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTip.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="space-y-3"
        >
          {/* Tip Title with Generous Mobile Spacing */}
          <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
            {currentTip.title[langKey]}
          </h3>

          {/* Tip Advice Text */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {currentTip.advice[langKey]}
          </p>

          {/* Golden Rule Callout Box with Clean Breathing Room */}
          <motion.div
            initial={{ scale: 0.98, opacity: 0.9 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-3 sm:p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 flex items-start gap-2.5 shadow-2xs"
          >
            <span className="text-base shrink-0 select-none">⭐</span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block mb-0.5">
                {language === 'fr' ? 'Règle d’Or' : language === 'en' ? 'Golden Rule' : 'Regla de Oro'}
              </span>
              <p className="text-xs font-bold text-amber-950 leading-relaxed">
                {currentTip.goldenRule[langKey]}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Bottom Interactive Controls with Mobile Tap Feedback */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2.5">
        {/* Shuffle / Next Tip Button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.94 }}
          onClick={handleNextTip}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
          title="Ver otro consejo"
        >
          <motion.div
            animate={isRotating ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
          >
            <Dices className="w-4 h-4 text-slate-500" />
          </motion.div>
          <span>
            {language === 'fr'
              ? 'Autre conseil'
              : language === 'en'
              ? 'Next tip'
              : 'Ver otro tip'}
          </span>
        </motion.button>

        {/* Acknowledge / Got it Button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.94 }}
          onClick={handleAcknowledge}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer shadow-xs ${
            hasAcknowledged
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'bg-cyan-500 hover:bg-cyan-600 text-white'
          }`}
        >
          {hasAcknowledged ? (
            <>
              <Check className="w-4 h-4 text-emerald-700 stroke-[3]" />
              <span>
                {language === 'fr'
                  ? 'Bien compris !'
                  : language === 'en'
                  ? 'Got it!'
                  : '¡Entendido! 👍'}
              </span>
            </>
          ) : (
            <>
              <Lightbulb className="w-4 h-4" />
              <span>
                {language === 'fr'
                  ? 'J’applique'
                  : language === 'en'
                  ? 'I will apply this'
                  : '¡Lo aplicaré! 💡'}
              </span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};
