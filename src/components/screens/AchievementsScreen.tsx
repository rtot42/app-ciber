import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  Lock,
  CheckCircle2,
  Footprints,
  Search,
  ShieldCheck,
  Key,
  ZapOff,
  Eye,
  X,
  Star,
} from 'lucide-react';
import { AchievementBadge } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

interface AchievementsScreenProps {
  unlockedBadgeIds: string[];
}

export const AchievementsScreen: React.FC<AchievementsScreenProps> = ({
  unlockedBadgeIds,
}) => {
  const { badges: rawBadges, t } = useLanguage();
  const [selectedBadge, setSelectedBadge] = useState<AchievementBadge | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Footprints':
        return Footprints;
      case 'Search':
        return Search;
      case 'ShieldCheck':
        return ShieldCheck;
      case 'Key':
        return Key;
      case 'ZapOff':
        return ZapOff;
      case 'Eye':
        return Eye;
      default:
        return Award;
    }
  };

  const categories = [
    { id: 'all', label: t('achievements.allCategory') },
    { id: 'privacy', label: t('achievements.privacyCategory') },
    { id: 'security', label: t('achievements.securityCategory') },
    { id: 'starter', label: t('achievements.starterCategory') },
  ];

  const badges = rawBadges.map((b) => ({
    ...b,
    unlocked: unlockedBadgeIds.includes(b.id) || b.unlocked,
  }));

  const getBadgeCategoryId = (badge: AchievementBadge): string => {
    const cat = badge.category.toLowerCase();
    if (cat.includes('priva')) return 'privacy';
    if (cat.includes('sec') || cat.includes('segur') || cat.includes('séc') || cat.includes('phish')) return 'security';
    if (cat.includes('inic') || cat.includes('init') || cat.includes('start')) return 'starter';
    return 'security';
  };

  const filteredBadges =
    activeCategoryId === 'all'
      ? badges
      : badges.filter((b) => getBadgeCategoryId(b) === activeCategoryId);

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  const getRarityLabel = (rarity: string) => {
    const r = rarity.toLowerCase();
    if (r.includes('épi') || r.includes('epi')) return t('achievements.epicRarity');
    if (r.includes('rar')) return t('achievements.rareRarity');
    return t('achievements.commonRarity');
  };

  return (
    <div className="flex-1 min-h-0 w-full max-w-full flex flex-col px-4 sm:px-5 pt-3.5 pb-6 bg-slate-50 text-slate-800 select-none overflow-y-auto overflow-x-hidden scrollbar-none space-y-4">
      {/* Top Header Card */}
      <section className="shrink-0 w-full flex flex-wrap items-center justify-between gap-2.5 bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm">
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-600">
            <Award className="w-4 h-4 shrink-0" />
            <span>{t('achievements.gallery')}</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            {t('achievements.title')}
          </h1>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-2xs tabular-nums shrink-0">
          <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
          <span>{t('achievements.unlockedOf', { unlocked: unlockedCount, total: badges.length })}</span>
        </div>
      </section>

      {/* Category Tabs */}
      <div className="shrink-0 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategoryId(cat.id)}
            className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition cursor-pointer border ${
              activeCategoryId === cat.id
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Badges Collectible Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-3.5 w-full">
        {filteredBadges.map((badge) => {
          const Icon = getIcon(badge.icon);
          const isUnlocked = badge.unlocked;

          return (
            <motion.div
              key={badge.id}
              whileHover={{ scale: isUnlocked ? 1.015 : 1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedBadge(badge)}
              className={`p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border transition-all cursor-pointer flex flex-col items-center text-center relative space-y-2.5 overflow-hidden ${
                isUnlocked
                  ? 'bg-white border-slate-100 hover:border-cyan-200 shadow-sm'
                  : 'bg-slate-100/80 border-slate-200/60 opacity-65'
              }`}
            >
              {/* Rarity & Category Metadata */}
              <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {getRarityLabel(badge.rarity)}
              </div>

              {/* Badge Emblem */}
              <div
                className={`w-15 h-15 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center relative shadow-xs transition-colors ${
                  isUnlocked
                    ? 'bg-cyan-50 border border-cyan-200 text-cyan-600'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                {isUnlocked ? (
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
                ) : (
                  <Lock className="w-6 h-6 text-slate-400" />
                )}

                {isUnlocked && (
                  <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-2 ring-white">
                    <CheckCircle2 className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight leading-snug">
                  {badge.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">
                  {badge.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Badge Detail Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/45 backdrop-blur-xs flex items-center justify-center px-4"
            style={{
              paddingTop: 'max(1rem, env(safe-area-inset-top, 0px))',
              paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 0px))',
            }}
            onClick={() => setSelectedBadge(null)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 text-center relative shadow-xl space-y-3.5"
            >
              <button
                onClick={() => setSelectedBadge(null)}
                aria-label="Cerrar"
                className="absolute top-3.5 right-3.5 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer transition"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-18 h-18 mx-auto rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 text-2xl shadow-sm">
                {React.createElement(getIcon(selectedBadge.icon), { className: 'w-9 h-9' })}
              </div>

              <div className="space-y-1">
                <div className="text-[11px] font-bold uppercase text-cyan-700 tracking-wider">
                  {selectedBadge.category} • {getRarityLabel(selectedBadge.rarity)}
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedBadge.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xs mx-auto font-medium">
                  {selectedBadge.description}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs sm:text-sm">
                {selectedBadge.unlocked ? (
                  <div className="text-emerald-700 font-bold flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{t('achievements.unlockedStatus')}</span>
                  </div>
                ) : (
                  <div className="text-slate-500 font-semibold flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4 text-slate-400" />
                    <span>{t('achievements.lockedStatus')}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
