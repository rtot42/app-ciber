import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Coins,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import { CiberMascot } from '../CiberMascot';
import { useLanguage } from '../../i18n/LanguageContext';

interface MissionResultScreenProps {
  onContinue: () => void;
}

export const MissionResultScreen: React.FC<MissionResultScreenProps> = ({
  onContinue,
}) => {
  const { t, language } = useLanguage();

  useEffect(() => {
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0ea5e9', '#38bdf8', '#a855f7', '#f59e0b', '#10b981'],
      });
    } catch {
      // safe fallback
    }
  }, []);

  const getExpGainedText = () => {
    if (language === 'fr') return 'Expérience Gagnée';
    if (language === 'es') return 'Experiencia Ganada';
    return 'Experience Gained';
  };

  const getCoinsDesc = () => {
    if (language === 'fr') return 'Pour ton inventaire';
    if (language === 'es') return 'Para tu inventario';
    return 'For your inventory';
  };

  const getCoinsLabel = () => {
    if (language === 'fr') return '+25 Pièces';
    if (language === 'es') return '+25 Monedas';
    return '+25 Coins';
  };

  const getPointsLabel = () => {
    if (language === 'fr') return '+8 Points';
    if (language === 'es') return '+8 Puntos';
    return '+8 Points';
  };

  const getBadgeName = () => {
    if (language === 'fr') return 'Cyber Détective';
    if (language === 'es') return 'Detective Digital';
    return 'Digital Detective';
  };

  const getBadgeDesc = () => {
    if (language === 'fr') return 'A résolu avec succès sa mission de sécurité.';
    if (language === 'es') return 'Resolviste con éxito tu misión de seguridad.';
    return 'Successfully solved your security mission.';
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col justify-between p-5 sm:p-6 bg-slate-50 text-slate-800 select-none overflow-y-auto scrollbar-none space-y-6 sm:space-y-7 pb-8">
      {/* Top Victory Banner */}
      <section className="text-center pt-2 space-y-2 shrink-0">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black uppercase tracking-wider">
          <CheckCircle2 className="w-4 h-4" />
          {t('missionResult.successBadge')}
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {t('missionResult.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
          {t('missionResult.subtitle')}
        </p>
      </section>

      {/* Center Mascot & Badges */}
      <div className="py-2 flex flex-col items-center space-y-5 my-auto">
        {/* Celebrating Mascot */}
        <div className="relative">
          <div className="w-40 h-40 rounded-3xl border border-amber-200 bg-gradient-to-b from-amber-50 to-white flex items-center justify-center shadow-md relative">
            <CiberMascot size="xl" expression="celebrating" />
          </div>
        </div>

        {/* Rewards Earned Grid */}
        <div className="w-full grid grid-cols-2 gap-4 max-w-[340px]">
          {/* XP Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-3xl bg-white border border-slate-100 flex flex-col items-center text-center shadow-xs space-y-1"
          >
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600 mb-1">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-lg font-black text-cyan-600">+120 XP</span>
            <span className="text-xs text-slate-500 font-bold">{getExpGainedText()}</span>
          </motion.div>

          {/* Coins Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="p-4 rounded-3xl bg-white border border-slate-100 flex flex-col items-center text-center shadow-xs space-y-1"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 mb-1">
              <Coins className="w-5 h-5 fill-amber-400 text-amber-500" />
            </div>
            <span className="text-lg font-black text-amber-600">{getCoinsLabel()}</span>
            <span className="text-xs text-slate-500 font-bold">{getCoinsDesc()}</span>
          </motion.div>
        </div>

        {/* Skill Improved Bar */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-[340px] p-4 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-2"
        >
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-2 text-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>{t('profile.skills.privacidad')}</span>
            </span>
            <span className="text-emerald-600 font-extrabold flex items-center gap-1 text-xs">
              <TrendingUp className="w-3.5 h-3.5" />
              {getPointsLabel()}
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full w-[86%]" />
          </div>
        </motion.div>

        {/* New Badge Unlocked Card */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-[340px] p-4 rounded-3xl bg-purple-50/80 border border-purple-100 flex items-center gap-3.5 shadow-xs"
        >
          <div className="w-12 h-12 rounded-2xl bg-white border border-purple-200 flex items-center justify-center text-2xl shrink-0 shadow-xs">
            🔍
          </div>
          <div className="flex-1 min-w-0 space-y-0.5">
            <span className="text-[10px] uppercase font-black tracking-wider text-purple-700">
              {t('missionResult.badgeUnlocked')}
            </span>
            <div className="text-xs sm:text-sm font-black text-slate-900 truncate">
              {getBadgeName()}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {getBadgeDesc()}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Continue CTA */}
      <div className="pt-2 shrink-0">
        <button
          onClick={onContinue}
          className="w-full py-4 rounded-2xl font-black text-sm tracking-wide bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
        >
          <span>{t('missionResult.continueBtn')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
