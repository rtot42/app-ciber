import React from 'react';
import { motion } from 'motion/react';
import {
  Star,
  Flame,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  Target,
  Clock,
  Award,
} from 'lucide-react';
import { ChildAgeGroup, GameResultStats } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { getAgeTierMeta } from '../../utils/ageDifficulty';
import { CiberMascot } from '../CiberMascot';

interface GameHudProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  accentColor?: 'cyan' | 'purple' | 'amber' | 'emerald' | 'rose' | 'indigo' | 'blue';
  ageGroup: ChildAgeGroup;
  currentStep: number;
  totalSteps: number;
  score: number;
  streak?: number;
  accuracy?: number;
  timeLeftSeconds?: number | null;
}

const ACCENT_STYLES: Record<
  NonNullable<GameHudProps['accentColor']>,
  { iconBg: string; bar: string; text: string }
> = {
  cyan: {
    iconBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    bar: 'from-cyan-500 to-sky-600',
    text: 'text-cyan-700',
  },
  purple: {
    iconBg: 'bg-purple-50 text-purple-700 border-purple-200',
    bar: 'from-purple-500 to-indigo-600',
    text: 'text-purple-700',
  },
  amber: {
    iconBg: 'bg-amber-50 text-amber-700 border-amber-200',
    bar: 'from-amber-500 to-orange-500',
    text: 'text-amber-700',
  },
  emerald: {
    iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    bar: 'from-emerald-500 to-teal-600',
    text: 'text-emerald-700',
  },
  rose: {
    iconBg: 'bg-rose-50 text-rose-700 border-rose-200',
    bar: 'from-rose-500 to-red-600',
    text: 'text-rose-700',
  },
  indigo: {
    iconBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    bar: 'from-indigo-500 to-blue-600',
    text: 'text-indigo-700',
  },
  blue: {
    iconBg: 'bg-blue-50 text-blue-700 border-blue-200',
    bar: 'from-blue-500 to-cyan-600',
    text: 'text-blue-700',
  },
};

export const GameHud: React.FC<GameHudProps> = ({
  title,
  subtitle,
  icon,
  accentColor = 'cyan',
  ageGroup,
  currentStep,
  totalSteps,
  score,
  streak = 0,
  accuracy,
  timeLeftSeconds = null,
}) => {
  const { language } = useLanguage();
  const tier = getAgeTierMeta(ageGroup, language);
  const styles = ACCENT_STYLES[accentColor];
  const progressPct = totalSteps > 0 ? Math.min(100, Math.round((currentStep / totalSteps) * 100)) : 0;

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 shadow-xs space-y-3 shrink-0">
      {/* Top Row: Icon + Title + Age Difficulty Descriptor */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${styles.iconBg}`}
          >
            {icon}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
              <span className={styles.text}>{tier.name}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{tier.shortLabel}</span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 truncate leading-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-slate-500 truncate mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Right Telemetry Metrics (Tabular Numerals, Unboxed) */}
        <div className="flex items-center gap-3 shrink-0 text-right">
          {timeLeftSeconds !== null && (
            <div
              className={`flex items-center gap-1 text-xs sm:text-sm font-black tabular-nums ${
                timeLeftSeconds <= 15 ? 'text-rose-600' : 'text-slate-700'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeLeftSeconds)}</span>
            </div>
          )}
          {streak > 1 && (
            <div className="flex items-center gap-1 text-xs sm:text-sm font-black text-orange-600 tabular-nums">
              <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
              <span>x{streak}</span>
            </div>
          )}
          <div className="text-xs sm:text-sm font-black text-slate-900 tabular-nums">
            {score} <span className="text-slate-400 font-bold text-[11px]">PTS</span>
          </div>
        </div>
      </div>

      {/* Progress & Precision Strip */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 tabular-nums">
          <span>
            {language === 'fr'
              ? `Étape ${Math.min(currentStep, totalSteps)} sur ${totalSteps}`
              : language === 'en'
              ? `Step ${Math.min(currentStep, totalSteps)} of ${totalSteps}`
              : `Paso ${Math.min(currentStep, totalSteps)} de ${totalSteps}`}
          </span>
          <div className="flex items-center gap-2.5">
            {accuracy !== undefined && (
              <span className="flex items-center gap-1 text-slate-600">
                <Target className="w-3.5 h-3.5 text-emerald-600" />
                <span>{accuracy}%</span>
              </span>
            )}
            <span className="text-slate-700 font-extrabold">{progressPct}%</span>
          </div>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${styles.bar} transition-all duration-300`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>
    </div>
  );
};

interface GameVictorySummaryProps {
  title: string;
  takeaway: string;
  stats: GameResultStats;
  ageGroup: ChildAgeGroup;
  onReplay: () => void;
  onContinue: (stats: GameResultStats) => void;
}

export const GameVictorySummary: React.FC<GameVictorySummaryProps> = ({
  title,
  takeaway,
  stats,
  ageGroup,
  onReplay,
  onContinue,
}) => {
  const { language } = useLanguage();
  const tier = getAgeTierMeta(ageGroup, language);

  const labels = {
    es: {
      done: 'Desafío Superado',
      accuracy: 'Precisión',
      score: 'Puntos',
      streak: 'Mejor Racha',
      takeawayTitle: 'Lo que dominaste hoy',
      replay: 'Repetir',
      continue: 'Continuar y Reclamar Premio',
    },
    fr: {
      done: 'Défi Réussi',
      accuracy: 'Précision',
      score: 'Score',
      streak: 'Meilleure Série',
      takeawayTitle: 'Ce que tu as maîtrisé',
      replay: 'Rejouer',
      continue: 'Continuer & Réclamer',
    },
    en: {
      done: 'Challenge Cleared',
      accuracy: 'Accuracy',
      score: 'Score',
      streak: 'Best Streak',
      takeawayTitle: 'Key Takeaway',
      replay: 'Play Again',
      continue: 'Continue & Claim Reward',
    },
  }[language];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-md space-y-5 my-auto"
    >
      {/* Header + Mascot */}
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-700">
          <Award className="w-4 h-4 text-emerald-600" />
          <span>{labels.done}</span>
          <span aria-hidden="true">·</span>
          <span>{tier.name}</span>
        </div>

        <CiberMascot size="md" expression="celebrating" />

        <h3 className="text-xl sm:text-2xl font-black text-slate-900 text-balance leading-snug">
          {title}
        </h3>

        {/* Stars Row */}
        <div className="flex items-center justify-center gap-2 pt-1">
          {[1, 2, 3].map((idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Star
                className={`w-9 h-9 ${
                  idx <= stats.stars
                    ? 'fill-amber-400 text-amber-500 drop-shadow-xs'
                    : 'fill-slate-100 text-slate-300'
                }`}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Clean 3-column metrics strip */}
      <div className="grid grid-cols-3 divide-x divide-slate-100 border border-slate-100 rounded-2xl bg-slate-50/70 py-3 text-center">
        <div>
          <div className="text-lg sm:text-xl font-black text-emerald-600 tabular-nums">
            {stats.accuracy}%
          </div>
          <div className="text-[11px] font-bold text-slate-500">{labels.accuracy}</div>
        </div>
        <div>
          <div className="text-lg sm:text-xl font-black text-cyan-600 tabular-nums">
            {stats.score}
          </div>
          <div className="text-[11px] font-bold text-slate-500">{labels.score}</div>
        </div>
        <div>
          <div className="text-lg sm:text-xl font-black text-orange-600 tabular-nums">
            x{stats.streakMax || 1}
          </div>
          <div className="text-[11px] font-bold text-slate-500">{labels.streak}</div>
        </div>
      </div>

      {/* Takeaway callout */}
      <div className="p-4 rounded-2xl bg-cyan-50/80 border border-cyan-100 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-cyan-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <div className="text-xs font-black uppercase tracking-wider text-cyan-800">
            {labels.takeawayTitle}
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            {takeaway}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
        <button
          type="button"
          onClick={onReplay}
          className="sm:w-1/3 py-3.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-sm flex items-center justify-center gap-2 transition cursor-pointer active:scale-[0.98] whitespace-nowrap"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{labels.replay}</span>
        </button>

        <button
          type="button"
          onClick={() => onContinue(stats)}
          className="sm:w-2/3 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white font-black text-sm sm:text-base shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition cursor-pointer active:scale-[0.98] whitespace-nowrap"
        >
          <span>{labels.continue}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};
