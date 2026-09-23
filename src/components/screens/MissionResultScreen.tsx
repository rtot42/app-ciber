import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Coins,
  ShieldCheck,
  Award,
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
    if (language === 'en') return 'Experience Gained';
    if (language === 'fr') return 'Expérience Gagnée';
    return 'Experiencia Ganada';
  };

  const getCoinsDesc = () => {
    if (language === 'en') return 'For your inventory';
    if (language === 'fr') return 'Pour ton inventaire';
    return 'Para tu inventario';
  };

  const getCoinsLabel = () => {
    if (language === 'en') return '+25 Coins';
    if (language === 'fr') return '+25 Pièces';
    return '+25 Monedas';
  };

  const getPointsLabel = () => {
    if (language === 'en') return '+8 Points';
    if (language === 'fr') return '+8 Points';
    return '+8 Puntos';
  };

  const getBadgeName = () => {
    if (language === 'en') return 'Digital Detective';
    if (language === 'fr') return 'Cyber Détective';
    return 'Detective Digital';
  };

  const getBadgeDesc = () => {
    if (language === 'en') return 'Successfully solved your security mission.';
    if (language === 'fr') return 'A résolu avec succès sa mission de sécurité.';
    return 'Resolviste con éxito tu misión de seguridad.';
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-5 bg-slate-50 text-slate-800 select-none overflow-y-auto scrollbar-none">
      {/* Top Victory Banner */}
      <div className="text-center pt-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-black uppercase tracking-wider mb-2">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {t('missionResult.successBadge')}
        </span>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          {t('missionResult.title')}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {t('missionResult.subtitle')}
        </p>
      </div>

      {/* Center Mascot & Badges */}
      <div className="py-3 flex flex-col items-center space-y-3.5">
        {/* Celebrating Mascot */}
        <div className="relative">
          <div className="w-36 h-36 rounded-3xl border border-amber-200 bg-gradient-to-b from-amber-50 to-white flex items-center justify-center shadow-md relative">
            <CiberMascot size="xl" expression="celebrating" />
          </div>
        </div>

        {/* Rewards Earned Grid */}
        <div className="w-full grid grid-cols-2 gap-3 max-w-[320px]">
          {/* XP Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="p-3.5 rounded-3xl bg-white border border-slate-100 flex flex-col items-center text-center shadow-xs"
          >
            <div className="w-9 h-9 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600 mb-1">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-base font-black text-cyan-600">+120 XP</span>
            <span className="text-[10px] text-slate-500 font-bold">{getExpGainedText()}</span>
          </motion.div>

          {/* Coins Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="p-3.5 rounded-3xl bg-white border border-slate-100 flex flex-col items-center text-center shadow-xs"
          >
            <div className="w-9 h-9 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 mb-1">
              <Coins className="w-4 h-4 fill-amber-400 text-amber-500" />
            </div>
            <span className="text-base font-black text-amber-600">{getCoinsLabel()}</span>
            <span className="text-[10px] text-slate-500 font-bold">{getCoinsDesc()}</span>
          </motion.div>
        </div>

        {/* Skill Improved Bar */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-[320px] p-3.5 rounded-3xl bg-white border border-slate-100 shadow-xs"
        >
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="flex items-center gap-1.5 text-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>{t('profile.skills.privacidad')}</span>
            </span>
            <span className="text-emerald-600 font-extrabold flex items-center gap-1 text-[11px]">
              <TrendingUp className="w-3.5 h-3.5" />
              {getPointsLabel()}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full w-[86%]" />
          </div>
        </motion.div>

        {/* New Badge Unlocked Card */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-[320px] p-3.5 rounded-3xl bg-purple-50/70 border border-purple-100 flex items-center gap-3 shadow-xs"
        >
          <div className="w-11 h-11 rounded-2xl bg-white border border-purple-200 flex items-center justify-center text-2xl shrink-0 shadow-xs">
            🔍
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[9px] uppercase font-black tracking-wider text-purple-700">
              {t('missionResult.badgeUnlocked')}
            </span>
            <div className="text-xs font-black text-slate-900 truncate">
              {getBadgeName()}
            </div>
            <p className="text-[10px] text-slate-600">
              {getBadgeDesc()}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Continue CTA */}
      <div className="pt-2">
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
