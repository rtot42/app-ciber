import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Shield,
  KeyRound,
  FishSymbol,
  Share2,
  Gamepad2,
  HeartHandshake,
  Smartphone,
  Sparkles,
  LifeBuoy,
  Lock,
  ChevronRight,
  Star,
  Compass,
} from 'lucide-react';
import { World } from '../../types';
import { CiberMascot } from '../CiberMascot';
import { useLanguage } from '../../i18n/LanguageContext';

interface WorldMapScreenProps {
  worlds?: World[];
  onSelectWorld: (world: World) => void;
  selectedWorldId: string;
}

export const WorldMapScreen: React.FC<WorldMapScreenProps> = ({
  worlds: propWorlds,
  onSelectWorld,
  selectedWorldId,
}) => {
  const { worlds: contextWorlds, t } = useLanguage();
  const worlds = propWorlds || contextWorlds;
  const [activePreviewWorldId, setActivePreviewWorldId] = useState<string>(selectedWorldId);
  const activePreviewWorld = worlds.find((w) => w.id === activePreviewWorldId) || worlds[0];

  const getIcon = (iconName: string) => {
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
      case 'Sparkles':
        return Sparkles;
      case 'LifeBuoy':
        return LifeBuoy;
      default:
        return Compass;
    }
  };

  const totalMissions = worlds.reduce((acc, w) => acc + w.totalMissions, 0);
  const totalCompleted = worlds.reduce((acc, w) => acc + w.completedMissions, 0);

  return (
    <div className="flex-1 min-h-0 w-full max-w-full flex flex-col px-4 sm:px-5 pt-3.5 pb-6 bg-slate-50 text-slate-800 select-none overflow-y-auto overflow-x-hidden scrollbar-none space-y-4">
      {/* Top Header Card */}
      <section className="shrink-0 w-full flex flex-wrap items-center justify-between gap-2.5 bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm">
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-600">
            <Compass className="w-4 h-4 shrink-0" />
            <span>{t('nav.worlds')}</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            {t('worlds.mapTitle')}
          </h1>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm font-bold shadow-2xs tabular-nums shrink-0">
          <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
          <span>{totalCompleted} / {totalMissions} ⭐</span>
        </div>
      </section>

      {/* Interactive Adventure Map Nodes with winding trail */}
      <div className="relative py-2 px-0.5 w-full max-w-md mx-auto flex flex-col items-center space-y-3.5 overflow-hidden">
        {/* Curving trail background line */}
        <div className="absolute top-8 bottom-8 left-1/2 -translate-x-1/2 w-16 pointer-events-none -z-0 opacity-25">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 800">
            <path
              d="M 50 20 Q 80 100 50 180 T 50 340 T 50 500 T 50 660 T 50 780"
              stroke="#0ea5e9"
              strokeWidth="4"
              strokeDasharray="6,6"
              fill="none"
            />
          </svg>
        </div>

        {/* Render Each World Node on the Map */}
        {worlds.map((world, idx) => {
          const Icon = getIcon(world.icon);
          const isSelected = activePreviewWorld.id === world.id;
          const isAvailable = world.status === 'active' || world.status === 'unlocked';

          const offsetClass = idx % 2 === 0 ? 'sm:-translate-x-2' : 'sm:translate-x-2';

          return (
            <motion.div
              key={world.id}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => {
                setActivePreviewWorldId(world.id);
                if (isAvailable) {
                  onSelectWorld(world);
                }
              }}
              className={`relative z-10 w-full transition-all cursor-pointer ${offsetClass}`}
            >
              <div
                className={`p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border transition-all ${
                  isSelected
                    ? 'bg-white border-cyan-400 shadow-md ring-2 ring-cyan-200'
                    : isAvailable
                    ? 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'
                    : 'bg-slate-100/75 border-slate-200/60 opacity-65'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  {/* World Badge Icon */}
                  <div
                    className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl flex items-center justify-center relative shrink-0 shadow-sm"
                    style={{
                      backgroundColor: `${world.color}18`,
                      border: `2.5px solid ${world.color}`,
                    }}
                  >
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: world.color }} />
                    {world.status === 'active' && (
                      <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-500 ring-2 ring-white" />
                    )}
                    {world.status === 'locked' && (
                      <div className="absolute inset-0 bg-slate-200/80 rounded-2xl flex items-center justify-center">
                        <Lock className="w-5 h-5 text-slate-500" />
                      </div>
                    )}
                  </div>

                  {/* World Info */}
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex flex-wrap items-center gap-x-1.5 text-[11px] sm:text-xs">
                      <span className="font-bold uppercase tracking-wider text-cyan-700">
                        {world.name}
                      </span>
                      {world.status === 'active' && (
                        <span className="font-bold text-cyan-700 uppercase">
                          • {t('worlds.status.active')}
                        </span>
                      )}
                      {world.status === 'locked' && (
                        <span className="font-semibold text-slate-400 uppercase">
                          • {t('worlds.status.locked')}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug break-words">
                      {world.title}
                    </h3>

                    {/* Progress */}
                    {isAvailable ? (
                      <div className="flex items-center gap-2 pt-1">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-cyan-500"
                            style={{
                              width: `${(world.completedMissions / world.totalMissions) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-slate-700 font-bold tabular-nums">
                          {world.completedMissions}/{world.totalMissions}
                        </span>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 pt-0.5 font-semibold leading-snug">
                        {t('common.requiresLevel')} {world.number + 1}
                      </p>
                    )}
                  </div>

                  {/* Arrow if open */}
                  {isAvailable && (
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                      <ChevronRight className="w-4.5 h-4.5" />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Floating Bottom Card: Quick Action on active selection */}
      <div className="sticky bottom-1 z-20 mt-2 p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg flex items-center justify-between gap-2.5 w-full">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <CiberMascot
            size="sm"
            expression={activePreviewWorld.status === 'locked' ? 'concerned' : 'excited'}
          />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-slate-900 leading-snug">
              {activePreviewWorld.title}
            </div>
            <div className="text-xs text-slate-500 font-medium leading-snug">
              {activePreviewWorld.status === 'locked'
                ? t('worlds.lockedDesc')
                : t('worldDetail.missionsCount', { completed: activePreviewWorld.completedMissions, total: activePreviewWorld.totalMissions })}
            </div>
          </div>
        </div>

        {activePreviewWorld.status !== 'locked' ? (
          <button
            onClick={() => onSelectWorld(activePreviewWorld)}
            className="min-h-[44px] px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-cyan-500/20 cursor-pointer hover:from-cyan-400 hover:to-blue-500 active:scale-95 transition shrink-0"
          >
            {t('worlds.enterWorld')}
          </button>
        ) : (
          <span className="min-h-[40px] px-3 py-2 rounded-xl bg-slate-100 text-slate-500 text-xs font-bold flex items-center gap-1.5 shrink-0">
            <Lock className="w-3.5 h-3.5" />
            {t('worlds.status.locked')}
          </span>
        )}
      </div>
    </div>
  );
};
