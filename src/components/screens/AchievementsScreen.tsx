import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  Lock,
  CheckCircle2,
  Sparkles,
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
  const { badges: rawBadges, t, language } = useLanguage();
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
    if (cat.includes('priva') || cat.includes('priva')) return 'privacy';
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
    <div className="flex-1 min-h-0 flex flex-col p-4 sm:p-5 bg-slate-50 text-slate-800 select-none overflow-y-auto scrollbar-none pb-24 space-y-4">
      {/* Top Header */}
      <div className="shrink-0 flex items-center justify-between bg-white p-4 rounded-3xl border border-slate-100 shadow-xs">
        <div>
          <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-cyan-600">
            <Award className="w-3.5 h-3.5" />
            <span>{t('achievements.gallery')}</span>
          </div>
          <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            {t('achievements.title')}
          </h1>
        </div>

        <div className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
          <span>{t('achievements.unlockedOf', { unlocked: unlockedCount, total: badges.length })}</span>
        </div>
      </div>

      {/* Category Pills */}
      <div className="shrink-0 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategoryId(cat.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
              activeCategoryId === cat.id
                ? 'bg-cyan-500 text-white border-cyan-500 shadow-xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Badges Collectible Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filteredBadges.map((badge) => {
          const Icon = getIcon(badge.icon);
          const isUnlocked = badge.unlocked;

          return (
            <motion.div
              key={badge.id}
              whileHover={{ scale: isUnlocked ? 1.02 : 1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedBadge(badge)}
              className={`p-4 rounded-3xl border transition-all cursor-pointer flex flex-col items-center text-center relative ${
                isUnlocked
                  ? 'bg-white border-slate-100 hover:border-cyan-200 shadow-sm'
                  : 'bg-slate-100/70 border-slate-200/50 opacity-60'
              }`}
            >
              {/* Rarity Tag */}
              <div
                className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.2 rounded-full mb-2 ${
                  badge.rarity.toLowerCase().includes('épi') || badge.rarity.toLowerCase().includes('epi')
                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                    : badge.rarity.toLowerCase().includes('rar')
                    ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {getRarityLabel(badge.rarity)}
              </div>

              {/* Badge Emblem */}
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center relative mb-2 shadow-xs ${
                  isUnlocked
                    ? 'bg-cyan-50 border border-cyan-200 text-cyan-600'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                {isUnlocked ? (
                  <Icon className="w-7 h-7" />
                ) : (
                  <Lock className="w-5 h-5 text-slate-400" />
                )}

                {isUnlocked && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-2 ring-white">
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Title & Category */}
              <h3 className="text-xs font-black text-slate-900 tracking-tight">
                {badge.title}
              </h3>
              <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                {badge.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Badge Detail Modal / Drawer */}
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
              className="w-full max-w-xs bg-white border border-slate-100 rounded-3xl p-5 text-center relative shadow-xl space-y-3"
            >
              <button
                onClick={() => setSelectedBadge(null)}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-18 h-18 mx-auto rounded-3xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 text-3xl shadow-sm">
                {React.createElement(getIcon(selectedBadge.icon), { className: 'w-9 h-9' })}
              </div>

              <div>
                <span className="text-[10px] font-black uppercase text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full">
                  {selectedBadge.category} • {getRarityLabel(selectedBadge.rarity)}
                </span>
                <h3 className="text-base font-black text-slate-900 mt-2">
                  {selectedBadge.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {selectedBadge.description}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                {selectedBadge.unlocked ? (
                  <div className="text-emerald-700 font-bold flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{t('achievements.unlockedStatus')}</span>
                  </div>
                ) : (
                  <div className="text-slate-500 flex items-center justify-center gap-1.5">
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
