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
  CheckCircle2,
  ChevronRight,
  Star,
  Compass,
} from 'lucide-react';
import { World } from '../../types';
import { CiberMascot } from '../CiberMascot';
import { useLanguage } from '../../i18n/LanguageContext';

interface WorldMapScreenProps {
  onSelectWorld: (world: World) => void;
  selectedWorldId: string;
}

export const WorldMapScreen: React.FC<WorldMapScreenProps> = ({
  onSelectWorld,
  selectedWorldId,
}) => {
  const { worlds, t } = useLanguage();
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

  return (
    <div className="flex-1 min-h-0 flex flex-col p-4 sm:p-5 bg-slate-50 text-slate-800 select-none overflow-y-auto scrollbar-none pb-24 space-y-4">
      {/* Top Header */}
      <div className="shrink-0 flex items-center justify-between bg-white p-4 rounded-3xl border border-slate-100 shadow-xs">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-cyan-600">
            <Compass className="w-3.5 h-3.5" />
            {t('nav.worlds')}
          </div>
          <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            {t('worlds.mapTitle')}
          </h1>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
          <span>4 / 45 ⭐</span>
        </div>
      </div>

      {/* Interactive Adventure Map Nodes with winding trail */}
      <div className="relative py-2 px-1 flex flex-col items-center space-y-4">
        {/* Curving trail background line */}
        <div className="absolute top-8 bottom-8 left-1/2 -translate-x-1/2 w-16 pointer-events-none -z-0 opacity-30">
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

          // Gentle zigzag offset
          const offsetClass = idx % 2 === 0 ? '-translate-x-2 sm:-translate-x-4' : 'translate-x-2 sm:translate-x-4';

          return (
            <motion.div
              key={world.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setActivePreviewWorldId(world.id);
                if (isAvailable) {
                  onSelectWorld(world);
                }
              }}
              className={`relative z-10 w-full max-w-[340px] transition-all cursor-pointer ${offsetClass}`}
            >
              <div
                className={`p-4 rounded-3xl border transition-all ${
                  isSelected
                    ? 'bg-white border-cyan-400 shadow-md ring-2 ring-cyan-200'
                    : isAvailable
                    ? 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'
                    : 'bg-slate-100/70 border-slate-200/50 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  {/* World Badge Icon */}
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center relative shrink-0 shadow-xs"
                    style={{
                      backgroundColor: `${world.color}15`,
                      border: `2px solid ${world.color}`,
                    }}
                  >
                    <Icon className="w-6 h-6" style={{ color: world.color }} />
                    {world.status === 'active' && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-500 ring-2 ring-white animate-pulse" />
                    )}
                    {world.status === 'locked' && (
                      <div className="absolute inset-0 bg-slate-200/80 rounded-2xl flex items-center justify-center">
                        <Lock className="w-4 h-4 text-slate-500" />
                      </div>
                    )}
                  </div>

                  {/* World Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wide text-cyan-600">
                        {world.name}
                      </span>
                      {world.status === 'active' && (
                        <span className="text-[9px] font-black px-2 py-0.2 rounded-full bg-cyan-100 text-cyan-700 uppercase">
                          {t('worlds.status.active')}
                        </span>
                      )}
                      {world.status === 'locked' && (
                        <span className="text-[9px] font-semibold text-slate-400">
                          {t('worlds.status.locked')}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-snug break-words mt-0.5">
                      {world.title}
                    </h3>

                    {/* Progress */}
                    {isAvailable ? (
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-cyan-500"
                            style={{
                              width: `${(world.completedMissions / world.totalMissions) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono font-bold">
                          {world.completedMissions}/{world.totalMissions}
                        </span>
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate font-medium">
                        {t('common.requiresLevel')} {world.number + 1}
                      </p>
                    )}
                  </div>

                  {/* Arrow if open */}
                  {isAvailable && (
                    <div className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Floating Bottom Card: Quick Action on active selection */}
      <div className="sticky bottom-0 z-20 mt-3 p-3.5 rounded-3xl bg-white border border-slate-200/80 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <CiberMascot
            size="sm"
            expression={activePreviewWorld.status === 'locked' ? 'concerned' : 'excited'}
          />
          <div>
            <div className="text-xs font-black text-slate-900">
              {activePreviewWorld.title}
            </div>
            <div className="text-[10px] text-slate-500">
              {activePreviewWorld.status === 'locked'
                ? t('worlds.lockedDesc')
                : t('worldDetail.missionsCount', { completed: activePreviewWorld.completedMissions, total: activePreviewWorld.totalMissions })}
            </div>
          </div>
        </div>

        {activePreviewWorld.status !== 'locked' ? (
          <button
            onClick={() => onSelectWorld(activePreviewWorld)}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xs shadow-md shadow-cyan-500/20 cursor-pointer hover:from-cyan-400 hover:to-blue-500 active:scale-95 transition"
          >
            {t('worlds.enterWorld')}
          </button>
        ) : (
          <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-400 text-xs font-semibold flex items-center gap-1">
            <Lock className="w-3.5 h-3.5" />
            {t('worlds.status.locked')}
          </span>
        )}
      </div>
    </div>
  );
};
