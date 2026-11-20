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
  Star,
  Home,
} from 'lucide-react';
import { CiberMascot } from '../CiberMascot';
import { useLanguage } from '../../i18n/LanguageContext';
import { GameResultStats, Mission } from '../../types';

interface MissionResultScreenProps {
  mission?: Mission;
  nextMission?: Mission;
  stats?: GameResultStats;
  xpGained?: number;
  coinsGained?: number;
  skillLabel?: string;
  skillPoints?: number;
  onNextMission?: (mission: Mission) => void;
  onContinue: () => void;
}

export const MissionResultScreen: React.FC<MissionResultScreenProps> = ({
  mission,
  nextMission,
  stats,
  xpGained = 120,
  coinsGained = 25,
  skillLabel,
  skillPoints = 8,
  onNextMission,
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

  const starsEarned = stats?.stars || 3;
  const accuracyEarned = stats?.accuracy ?? 100;

  const expText =
    language === 'fr'
      ? 'Expérience Gagnée'
      : language === 'es'
      ? 'Experiencia Ganada'
      : 'Experience Gained';

  const coinsDesc =
    language === 'fr'
      ? 'Pour ton inventaire'
      : language === 'es'
      ? 'Para tu inventario'
      : 'For your inventory';

  const coinsLabel =
    language === 'fr'
      ? `+${coinsGained} Pièces`
      : language === 'es'
      ? `+${coinsGained} Monedas`
      : `+${coinsGained} Coins`;

  const pointsLabel =
    language === 'fr'
      ? `+${skillPoints} Points`
      : language === 'es'
      ? `+${skillPoints} Puntos`
      : `+${skillPoints} Points`;

  const badgeName =
    language === 'fr'
      ? 'Cyber Détective'
      : language === 'es'
      ? 'Detective Digital'
      : 'Digital Detective';

  const badgeDesc =
    language === 'fr'
      ? 'A résolu avec succès sa mission de sécurité.'
      : language === 'es'
      ? 'Resolviste con éxito tu misión de seguridad.'
      : 'Successfully solved your security mission.';

  const nextMissionBtnText =
    language === 'fr'
      ? 'Mission Suivante'
      : language === 'es'
      ? 'Siguiente Misión'
      : 'Next Mission';

  const homeBtnText =
    language === 'fr'
      ? 'Continuer vers l’accueil'
      : language === 'es'
      ? 'Continuar al Inicio'
      : 'Continue to Home';

  return (
    <div className="flex-1 min-h-0 w-full max-w-full flex flex-col bg-slate-50 text-slate-800 select-none overflow-hidden">
      {/* Scrollable Celebration Content */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-none px-4 sm:px-5 pt-4 pb-6 space-y-4">
        <section className="text-center pt-0.5 space-y-1.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            {t('missionResult.successBadge')}
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {t('missionResult.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed font-medium">
            {mission ? `${mission.title} · ${accuracyEarned}%` : t('missionResult.subtitle')}
          </p>
        </section>

        {/* Stars + Mascot */}
        <div className="flex flex-col items-center space-y-3.5 w-full max-w-md mx-auto">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Star
                  className={`w-8 h-8 ${
                    idx <= starsEarned
                      ? 'fill-amber-400 text-amber-500 drop-shadow-xs'
                      : 'fill-slate-100 text-slate-300'
                  }`}
                />
              </motion.div>
            ))}
          </div>

          <div className="w-34 h-34 sm:w-38 sm:h-38 rounded-3xl border border-amber-200 bg-gradient-to-b from-amber-50 to-white flex items-center justify-center shadow-sm">
            <CiberMascot size="lg" expression="celebrating" />
          </div>

          {/* Rewards Earned Grid */}
          <div className="w-full grid grid-cols-2 gap-3">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="p-3.5 rounded-2xl sm:rounded-3xl bg-white border border-slate-100 flex flex-col items-center text-center shadow-xs space-y-1 tabular-nums"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-cyan-600">+{xpGained} XP</span>
              <span className="text-xs text-slate-500 font-semibold">{expText}</span>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="p-3.5 rounded-2xl sm:rounded-3xl bg-white border border-slate-100 flex flex-col items-center text-center shadow-xs space-y-1 tabular-nums"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Coins className="w-5 h-5 fill-amber-400 text-amber-500" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-amber-600">{coinsLabel}</span>
              <span className="text-xs text-slate-500 font-semibold">{coinsDesc}</span>
            </motion.div>
          </div>

          {/* Skill Improved Bar */}
          <div className="w-full p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-white border border-slate-100 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
              <span className="flex items-center gap-1.5 text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>{skillLabel || t('profile.skills.privacidad')}</span>
              </span>
              <span className="text-emerald-600 font-bold flex items-center gap-1 tabular-nums">
                <TrendingUp className="w-4 h-4" />
                {pointsLabel}
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full w-[88%]" />
            </div>
          </div>

          {/* Badge Unlocked Card */}
          <div className="w-full p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-purple-50/80 border border-purple-100 flex items-center gap-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-white border border-purple-200 flex items-center justify-center text-2xl shrink-0 shadow-xs">
              🔍
            </div>
            <div className="flex-1 min-w-0 space-y-0.5">
              <span className="text-[11px] uppercase font-bold tracking-wider text-purple-700">
                {t('missionResult.badgeUnlocked')}
              </span>
              <div className="text-sm font-bold text-slate-900 leading-snug">
                {badgeName}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">{badgeDesc}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pinned Always-Visible Action Footer */}
      <div
        className="shrink-0 border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 pt-3 z-20"
        style={{ paddingBottom: 'max(0.875rem, env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-2.5">
          {nextMission && onNextMission ? (
            <>
              <button
                type="button"
                onClick={onContinue}
                className="sm:w-1/3 min-h-[46px] py-3 px-4 rounded-2xl font-bold text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] transition"
              >
                <Home className="w-4 h-4" />
                <span>{t('missionResult.continueBtn')}</span>
              </button>
              <button
                type="button"
                onClick={() => onNextMission(nextMission)}
                className="sm:w-2/3 min-h-[46px] py-3 px-4 rounded-2xl font-bold text-sm sm:text-base bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition"
              >
                <span className="truncate">
                  {nextMissionBtnText}: {nextMission.title}
                </span>
                <ArrowRight className="w-4.5 h-4.5 shrink-0" />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onContinue}
              className="w-full min-h-[48px] py-3.5 px-5 rounded-2xl font-bold text-base tracking-wide bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <span>{homeBtnText}</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
