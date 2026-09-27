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
    <div className="flex-1 min-h-0 flex flex-col p-5 sm:p-6 bg-slate-50 text-slate-800 select-none overflow-y-auto scrollbar-none pb-28 space-y-6 sm:space-y-7">
      {/* Top Header Card */}
      <section className="shrink-0 flex items-center justify-between bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-cyan-600">
            <Award className="w-4 h-4" />
            <span>{t('achievements.gallery')}</span>
          </div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            {t('achievements.title')}
          </h1>
        </div>

        <div className="px-3.5 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
          <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
          <span>{t('achievements.unlockedOf', { unlocked: unlockedCount, total: badges.length })}</span>
        </div>
      </section>

      {/* Category Tabs */}
      <div className="shrink-0 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategoryId(cat.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
              activeCategoryId === cat.id
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Badges Collectible Grid with Ample Spacing */}
      <div className="grid grid-cols-2 gap-4">
        {filteredBadges.map((badge) => {
          const Icon = getIcon(badge.icon);
          const isUnlocked = badge.unlocked;

          return (
            <motion.div
              key={badge.id}
              whileHover={{ scale: isUnlocked ? 1.02 : 1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedBadge(badge)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col items-center text-center relative space-y-3 ${
                isUnlocked
                  ? 'bg-white border-slate-100 hover:border-cyan-200 shadow-sm'
                  : 'bg-slate-100/80 border-slate-200/60 opacity-60'
              }`}
            >
              {/* Rarity & Category Metadata */}
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                {getRarityLabel(badge.rarity)}
              </div>

              {/* Badge Emblem */}
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center relative shadow-xs transition-colors ${
                  isUnlocked
                    ? 'bg-cyan-50 border border-cyan-200 text-cyan-600'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                {isUnlocked ? (
                  <Icon className="w-8 h-8" />
                ) : (
                  <Lock className="w-6 h-6 text-slate-400" />
                )}

                {isUnlocked && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-2 ring-white">
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight leading-snug">
                  {badge.title}
                </h3>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
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
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setSelectedBadge(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white border border-slate-100 rounded-3xl p-6 text-center relative shadow-xl space-y-4"
            >
              <button
                onClick={() => setSelectedBadge(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-20 h-20 mx-auto rounded-3xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 text-3xl shadow-sm">
                {React.createElement(getIcon(selectedBadge.icon), { className: 'w-10 h-10' })}
              </div>

              <div className="space-y-1.5">
                <div className="text-[11px] font-black uppercase text-cyan-700 tracking-wider">
                  {selectedBadge.category} • {getRarityLabel(selectedBadge.rarity)}
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  {selectedBadge.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
                  {selectedBadge.description}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs sm:text-sm">
                {selectedBadge.unlocked ? (
                  <div className="text-emerald-700 font-bold flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{t('achievements.unlockedStatus')}</span>
                  </div>
                ) : (
                  <div className="text-slate-500 flex items-center justify-center gap-2">
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
