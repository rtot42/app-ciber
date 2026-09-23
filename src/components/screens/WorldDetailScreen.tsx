import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Shield,
  Clock,
  Sparkles,
  Coins,
  Play,
  Lock,
  CheckCircle2,
  KeyRound,
  FishSymbol,
  Share2,
  Gamepad2,
  HeartHandshake,
  Smartphone,
  Compass,
  Star,
  Zap,
} from 'lucide-react';
import { World, Mission } from '../../types';
import { CiberMascot } from '../CiberMascot';
import { useLanguage } from '../../i18n/LanguageContext';

interface WorldDetailScreenProps {
  world: World;
  onBackToMap: () => void;
  onSelectMission: (mission: Mission) => void;
}

export const WorldDetailScreen: React.FC<WorldDetailScreenProps> = ({
  world,
  onBackToMap,
  onSelectMission,
}) => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [world.id]);

  const completedCount = world.completedMissions;
  const totalCount = world.totalMissions;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const getWorldIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shield':
        return Shield;
      case 'KeyRound':
        return KeyRound;
      case 'FishSymbol':
        return FishSymbol;
      case 'Share2':
        return Share2;
      case 'Gamepad2':
        return Gamepad2;
      case 'HeartHandshake':
        return HeartHandshake;
      case 'Smartphone':
        return Smartphone;
      default:
        return Compass;
    }
  };

  const WorldIcon = getWorldIcon(world.icon);

  return (
    <div
      ref={containerRef}
      className="flex-1 min-h-0 flex flex-col p-5 sm:p-6 bg-slate-50 text-slate-800 select-none overflow-y-auto scrollbar-none pb-28 space-y-6 sm:space-y-7"
    >
      {/* Unified World Hero Header Card */}
      <motion.section
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="shrink-0 rounded-3xl p-5 sm:p-6 bg-white border border-slate-100 shadow-sm relative overflow-hidden space-y-4"
      >
        {/* Accent top gradient stripe */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{
            background: `linear-gradient(90deg, ${world.color}, #06b6d4)`,
          }}
        />

        {/* Top Action Row: Back Button & World Meta */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            onClick={onBackToMap}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-xs font-bold text-slate-700 transition cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
            <span>{t('worldDetail.backToMap')}</span>
          </button>

          <div className="flex items-center gap-2">
            <span
              className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-2xl"
              style={{
                backgroundColor: `${world.color}18`,
                color: world.color,
                border: `1px solid ${world.color}40`,
              }}
            >
              {t('common.world')} {world.number + 1}
            </span>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>
                {completedCount}/{totalCount}
              </span>
            </div>
          </div>
        </div>

        {/* Title Header with Icon & Generous Space */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs"
              style={{
                backgroundColor: `${world.color}20`,
                border: `1.5px solid ${world.color}`,
              }}
            >
              <WorldIcon className="w-4.5 h-4.5" style={{ color: world.color }} />
            </div>
            <span className="text-xs font-black tracking-wider uppercase" style={{ color: world.color }}>
              {world.name}
            </span>
          </div>

          <div className="flex items-start justify-between gap-3">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug break-words flex-1">
              {world.title}
            </h1>
            <div className="shrink-0 -mt-1">
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
              >
                <CiberMascot size="sm" expression="happy" />
              </motion.div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {world.subtitle}
          </p>
        </div>

        {/* Motto banner if available */}
        {world.motto && (
          <div className="p-3.5 sm:p-4 rounded-2xl bg-cyan-50/80 border border-cyan-100 flex items-center gap-3">
            <span className="text-base shrink-0">🧭</span>
            <p className="text-xs sm:text-sm font-bold text-cyan-900 leading-snug">
              &quot;{world.motto}&quot;
            </p>
          </div>
        )}

        {/* Progress Bar */}
        <div className="pt-3 border-t border-slate-100 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span className="text-cyan-700 font-extrabold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-500" />
              {t('worldDetail.worldProgress')}
            </span>
            <span className="font-mono text-slate-700">
              {t('worldDetail.missionsCount', { completed: completedCount, total: totalCount })} ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, #06b6d4, ${world.color})`,
              }}
            />
          </div>
        </div>
      </motion.section>

      {/* Missions List */}
      <section className="space-y-4 shrink-0">
        <div className="shrink-0 flex items-center justify-between px-1">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <span>{t('worldDetail.missionsTitle')}</span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-200/80 text-slate-700 text-[10px] font-extrabold">
              {world.missions.length}
            </span>
          </h2>
          <span className="text-xs text-cyan-600 font-extrabold tracking-wide">
            {t('worldDetail.tapToPlay')}
          </span>
        </div>

        <div className="space-y-3.5">
          {world.missions.map((mission, idx) => {
            const isFeatured = idx === 0;
            const isLocked = mission.status === 'locked';
            const isCompleted = mission.status === 'completed';

            return (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.05 }}
                whileHover={{ scale: isLocked ? 1 : 1.015 }}
                whileTap={{ scale: isLocked ? 1 : 0.97 }}
                onClick={() => {
                  if (!isLocked) {
                    onSelectMission(mission);
                  }
                }}
                className={`shrink-0 rounded-3xl p-5 sm:p-6 border transition-all cursor-pointer ${
                  isFeatured
                    ? 'bg-white border-cyan-400 shadow-sm ring-2 ring-cyan-100'
                    : isLocked
                    ? 'bg-slate-100/70 border-slate-200/60 opacity-60 cursor-not-allowed'
                    : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Number / Status Icon */}
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 shadow-xs ${
                      isCompleted
                        ? 'bg-emerald-500 text-white'
                        : isFeatured
                        ? 'bg-cyan-500 text-white'
                        : isLocked
                        ? 'bg-slate-200 text-slate-400'
                        : 'bg-cyan-50 text-cyan-700'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    ) : isLocked ? (
                      <Lock className="w-4 h-4" />
                    ) : (
                      idx + 1
                    )}
                  </div>

                  {/* Mission Details */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[11px] font-bold text-slate-600">
                        {mission.difficulty === 'Fácil'
                          ? t('common.easy')
                          : mission.difficulty === 'Media' || mission.difficulty === 'Medio'
                          ? t('common.medium')
                          : t('common.hard')}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {mission.timeEstimate}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                      {mission.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                      {mission.subtitle}
                    </p>

                    {/* Rewards Row */}
                    <div className="flex items-center gap-4 pt-1.5 text-xs font-bold">
                      <span className="flex items-center gap-1.5 text-cyan-600 font-extrabold">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                        +{mission.xpReward} XP
                      </span>
                      <span className="flex items-center gap-1.5 text-amber-700 font-extrabold">
                        <Coins className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                        +{mission.coinReward} {t('common.coins')}
                      </span>
                    </div>
                  </div>

                  {/* Action CTA button */}
                  <div className="shrink-0 self-center">
                    {!isLocked ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectMission(mission);
                        }}
                        className={`px-3.5 py-2 rounded-2xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition active:scale-95 ${
                          isFeatured
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-sm'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{isFeatured ? t('worldDetail.play') : t('worldDetail.open')}</span>
                      </button>
                    ) : (
                      <div className="w-9 h-9 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
