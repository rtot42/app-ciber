import React from 'react';
import { motion } from 'motion/react';
import {
  Coins,
  Sparkles,
  Play,
  Compass,
  Award,
  ShieldCheck,
  ChevronRight,
  Flame,
  Lock,
  GraduationCap,
  Zap,
  Gamepad2,
} from 'lucide-react';
import { GameType, UserProfile, World } from '../../types';
import { AVATAR_OPTIONS } from '../../data';
import { useLanguage } from '../../i18n/LanguageContext';
import { LanguageSelector } from '../LanguageSelector';
import { CyberTipOfTheDay } from '../CyberTipOfTheDay';

const GAME_ICON_MAP: Record<GameType, string> = {
  'image-detection': '📸',
  'password-forge': '🔐',
  'phishing-inbox': '🎣',
  'chat-sim': '💬',
  'privacy-dial': '🎛️',
  'safe-risky-sort': '⚖️',
  'drag-drop': '🧱',
  'memory-match': '🃏',
  'puzzle-vault': '🗝️',
  'ai-detector': '✨',
  'incident-response': '🛟',
  quiz: '❓',
  'app-permissions': '📱',
  'url-inspector': '🔗',
  'wifi-shield': '📡',
  'cyber-bully-shield': '🛡️',
  'digital-footprint': '👣',
  'cyber-runner': '🕹️',
  'cyber-snake': '🐍',
  'cyber-pacman': '👻',
  'cyber-invaders': '🚀',
  'cyber-flappy': '🐦',
  'cyber-tetris': '🧱',
  'cyber-pvz': '🌻',
  'cyber-dino': '🦖',
};

interface HomeScreenProps {
  profile: UserProfile;
  currentWorld: World;
  onStartMission: (missionId: string) => void;
  onNavigateToWorlds: () => void;
  onNavigateToEducation?: () => void;
  onNavigateToAchievements: () => void;
  onOpenParentGate: () => void;
  onOpenArcade?: () => void;
  onAwardXp?: (amount: number) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  currentWorld,
  onStartMission,
  onNavigateToWorlds,
  onNavigateToEducation,
  onNavigateToAchievements,
  onOpenParentGate,
  onOpenArcade,
  onAwardXp,
}) => {
  const { t, language, badges } = useLanguage();
  const avatarData = AVATAR_OPTIONS.find((a) => a.id === profile.avatarId) || AVATAR_OPTIONS[0];
  const xpPercent = Math.min(100, Math.round((profile.xp / profile.xpToNextLevel) * 100));

  const recommendedMission =
    currentWorld.missions.find((m) => m.status === 'available') || currentWorld.missions[0];

  // Resolve recent badge if available
  const recentBadgeId = profile.unlockedBadges[profile.unlockedBadges.length - 1];
  const recentBadge = badges.find((b) => b.id === recentBadgeId) || badges[0];

  return (
    <div className="flex-1 min-h-0 w-full max-w-full flex flex-col p-4 sm:p-6 bg-slate-50 text-slate-800 select-none space-y-5 sm:space-y-6 overflow-y-auto overflow-x-hidden scrollbar-none pb-28">
      {/* Top Game Hub Header: Player Status & Coins */}
      <section className="shrink-0 w-full bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4 overflow-hidden">
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3.5">
          {/* Avatar & Player Info */}
          <div className="flex items-center gap-4 min-w-0">
            <div
              className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center text-4xl sm:text-5xl relative shadow-md shrink-0 transition-transform"
              style={{
                backgroundColor: `${profile.avatarColor}18`,
                border: `3px solid ${profile.avatarColor}`,
              }}
            >
              <span>{avatarData.icon}</span>
              <div className="absolute -bottom-1.5 -right-1.5 bg-cyan-600 text-white text-xs font-black px-2.5 py-0.5 rounded-full ring-2 ring-white shadow-xs">
                {t('common.level')} {profile.level}
              </div>
            </div>

            <div className="space-y-0.5 min-w-0">
              <div className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2 truncate">
                <span className="truncate">{t('home.greeting', { name: profile.nickname })}</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              </div>
              <div className="text-sm sm:text-base font-extrabold text-cyan-600 truncate">
                {t('home.guardianRank')}
              </div>
            </div>
          </div>

          {/* Right: Language selector, Coins Balance & Parent Mode button */}
          <div className="flex items-center gap-2.5 shrink-0 ml-auto sm:ml-0">
            <LanguageSelector variant="dropdown" />

            {/* Coins Balance */}
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm sm:text-base font-black shadow-2xs">
              <Coins className="w-5 h-5 text-amber-500 fill-amber-400" />
              <span>{profile.coins}</span>
            </div>

            {/* Parent Gate Trigger */}
            <button
              onClick={onOpenParentGate}
              title={t('nav.parentPortal')}
              className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition cursor-pointer active:scale-95 shadow-2xs"
            >
              <Lock className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* XP Progress Section */}
        <div className="pt-2.5 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-sm font-bold text-slate-500">
            <span className="flex items-center gap-1.5 text-cyan-600 font-black">
              <Sparkles className="w-4.5 h-4.5 text-cyan-500" />
              {t('home.xpLabel')}
            </span>
            <span className="font-mono text-slate-800 font-extrabold">
              {profile.xp} / {profile.xpToNextLevel} XP ({xpPercent}%)
            </span>
          </div>

          <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 shadow-2xs"
            />
          </div>

          {/* XP triggers for testing */}
          {onAwardXp && (
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs sm:text-sm">
              <span className="text-xs text-slate-400 font-semibold truncate">
                {language === 'fr'
                  ? `Reste ${Math.max(0, profile.xpToNextLevel - profile.xp)} XP pour Niv. ${profile.level + 1}`
                  : language === 'es'
                  ? `Faltan ${Math.max(0, profile.xpToNextLevel - profile.xp)} XP para Nivel ${profile.level + 1}`
                  : `${Math.max(0, profile.xpToNextLevel - profile.xp)} XP until Level ${profile.level + 1}`}
              </span>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onAwardXp(60)}
                  title={language === 'fr' ? 'Entraînement rapide +60 XP' : language === 'es' ? 'Práctica rápida +60 XP' : 'Quick practice +60 XP'}
                  className="px-3.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 active:scale-95 text-sky-700 font-extrabold border border-sky-200 transition cursor-pointer text-xs flex items-center gap-1"
                >
                  <Zap className="w-4 h-4 text-sky-500" />
                  <span>+60 XP</span>
                </button>
                <button
                  type="button"
                  onClick={() => onAwardXp(Math.max(50, profile.xpToNextLevel - profile.xp + 10))}
                  title={language === 'fr' ? 'Passer au niveau supérieur' : language === 'es' ? 'Subir de Nivel ahora' : 'Trigger Level Up Celebration'}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-100 hover:from-amber-100 hover:to-yellow-200 active:scale-95 text-amber-800 font-black border border-amber-300 transition cursor-pointer text-xs flex items-center gap-1 shadow-2xs"
                >
                  <Sparkles className="w-4 h-4 text-amber-600 animate-twinkle" />
                  <span>
                    {language === 'fr' ? 'Niveau +' : language === 'es' ? 'Subir Nivel' : 'Level Up'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Quick Access to 17-Game Cyber Arcade */}
      {onOpenArcade && (
        <button
          onClick={onOpenArcade}
          className="shrink-0 w-full rounded-3xl p-5 bg-gradient-to-r from-indigo-600 via-sky-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/20 hover:brightness-105 transition flex items-center justify-between cursor-pointer group text-left overflow-hidden"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center shrink-0">
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-cyan-100">
                <span>
                  {language === 'fr'
                    ? 'ARCADE • 25 JEUX PRO'
                    : language === 'es'
                    ? 'ARCADE • 25 JUEGOS PRO'
                    : 'ARCADE • 25 PRO GAMES'}
                </span>
                <span>•</span>
                <span>{profile.ageGroup}</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white truncate">
                {language === 'fr'
                  ? 'Entraînement Libre (3 Niveaux d’Âge)'
                  : language === 'es'
                  ? 'Práctica Libre (3 Niveles de Edad)'
                  : 'Free Play Arcade (3 Age Levels)'}
              </h3>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-white/80 group-hover:translate-x-0.5 transition shrink-0 ml-2" />
        </button>
      )}

      {/* Quick Access to Cyber Academy */}
      {onNavigateToEducation && (
        <button
          onClick={onNavigateToEducation}
          className="shrink-0 w-full rounded-3xl p-5 bg-gradient-to-r from-amber-50/90 via-cyan-50/90 to-blue-50/90 border border-amber-200/80 hover:border-cyan-300 transition flex items-center justify-between shadow-xs cursor-pointer group text-left overflow-hidden"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-14 h-14 rounded-2xl bg-amber-100/90 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-800">
                  {language === 'fr' ? 'NOUVEAU' : language === 'es' ? 'NUEVO' : 'NEW'}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs sm:text-sm font-bold text-slate-500">
                  {language === 'fr'
                    ? 'Conseils & Notions'
                    : language === 'es'
                    ? 'Consejos & Conceptos'
                    : 'Tips & Concepts'}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-cyan-700 transition truncate">
                {language === 'fr'
                  ? 'Académie Cyber & Conseils du Jour'
                  : language === 'es'
                  ? 'Academia Ciber & Consejos del Día'
                  : 'Cyber Academy & Daily Tips'}
              </h3>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-cyan-600 transition group-hover:translate-x-0.5 shrink-0 ml-2" />
        </button>
      )}

      {/* Cyber Tip of the Day */}
      <CyberTipOfTheDay onLearnTip={() => onAwardXp?.(35)} />

      {/* MAIN RECOMMENDED MISSION CARD */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="shrink-0 w-full relative rounded-3xl overflow-hidden border border-slate-100 shadow-md bg-white group space-y-4"
      >
        {/* Top Header of Mission */}
        <div className="p-5 pb-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-600" />
            <span className="text-sm font-black uppercase tracking-wider text-cyan-700">
              {t('home.recommendedMission')}
            </span>
          </div>

          <div className="text-sm font-black text-amber-800">
            +{recommendedMission?.xpReward || 100} XP • +{recommendedMission?.coinReward || 25} 🪙
          </div>
        </div>

        {/* Mission Illustration Backdrop */}
        <div className="h-50 sm:h-56 w-full bg-gradient-to-b from-sky-50 via-cyan-50/50 to-white relative flex items-center justify-center overflow-hidden border-y border-slate-100">
          <div className="w-52 h-36 sm:w-60 sm:h-40 rounded-3xl border-2 border-slate-200 bg-white p-3.5 relative shadow-lg transform -rotate-1 group-hover:rotate-0 transition-transform duration-300">
            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 flex flex-col items-center justify-center text-center p-2">
              <span className="text-5xl sm:text-6xl mb-1.5">
                {GAME_ICON_MAP[recommendedMission.gameType] || '🛡️'}
              </span>
              <span className="text-sm sm:text-base font-black text-slate-900 line-clamp-1">
                {recommendedMission.title}
              </span>
            </div>
          </div>
        </div>

        {/* Card Content & Action */}
        <div className="p-5 pt-0 space-y-4">
          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
              {recommendedMission.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
              {recommendedMission.description || recommendedMission.subtitle}
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-sm text-slate-600 font-bold">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>{t('common.easy')} • 3 {t('home.minutes')}</span>
            </div>

            <button
              onClick={() => onStartMission(recommendedMission.id)}
              className="px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm sm:text-base font-black tracking-wide shadow-lg shadow-cyan-500/25 flex items-center gap-2.5 cursor-pointer active:scale-95 transition-all"
            >
              <Play className="w-5 h-5 fill-white stroke-[2.5]" />
              <span>{t('home.continueMission')}</span>
            </button>
          </div>
        </div>
      </motion.section>

      {/* CURRENT WORLD OVERVIEW CARD */}
      <motion.section
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={onNavigateToWorlds}
        className="shrink-0 w-full p-5 sm:p-6 rounded-3xl bg-white border border-slate-100 hover:border-cyan-200 shadow-sm transition cursor-pointer flex items-center justify-between gap-3 overflow-hidden"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-16 h-16 rounded-3xl bg-cyan-50 border-2 border-cyan-200 flex items-center justify-center text-cyan-600 shrink-0 shadow-xs">
            <Compass className="w-8 h-8" />
          </div>
          <div className="space-y-0.5 min-w-0">
            <div className="text-xs sm:text-sm uppercase tracking-wider text-cyan-600 font-black truncate">
              {currentWorld.name}
            </div>
            <div className="text-base sm:text-lg font-black text-slate-900 truncate">
              {currentWorld.title}
            </div>
            <div className="text-xs sm:text-sm text-slate-500 font-semibold truncate">
              {t('worldDetail.missionsCount', { completed: currentWorld.completedMissions, total: currentWorld.totalMissions })}
            </div>
          </div>
        </div>

        <ChevronRight className="w-6 h-6 text-slate-400 shrink-0 ml-1" />
      </motion.section>

      {/* TWO COLUMNS: Daily Challenge & Recent Achievement */}
      <div className="shrink-0 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Daily Challenge */}
        <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col justify-between space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-orange-600 uppercase">
              <Flame className="w-4.5 h-4.5 fill-orange-500 text-orange-500" />
              <span>{language === 'fr' ? 'Défi du Jour' : language === 'es' ? 'Reto del Día' : 'Daily Challenge'}</span>
            </div>
            <div className="text-sm sm:text-base font-black text-slate-900">
              {recommendedMission.title}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              {recommendedMission.subtitle}
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 text-xs font-black text-amber-700">
            {language === 'fr' ? '+50 XP bonus' : language === 'es' ? '+50 XP extra' : '+50 bonus XP'}
          </div>
        </div>

        {/* Recent Achievement */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNavigateToAchievements}
          className="p-5 rounded-3xl bg-white border border-slate-100 hover:border-purple-200 shadow-sm transition cursor-pointer flex flex-col justify-between space-y-3"
        >
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-purple-600 uppercase">
              <Award className="w-4.5 h-4.5 text-purple-500" />
              <span>{language === 'fr' ? 'Médaille Récente' : language === 'es' ? 'Medalla Reciente' : 'Recent Badge'}</span>
            </div>
            <div className="text-sm sm:text-base font-black text-slate-900">
              {recentBadge.title}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              {recentBadge.description}
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 text-xs font-extrabold text-cyan-600 flex items-center justify-between">
            <span>
              {language === 'fr' ? 'Voir toutes' : language === 'es' ? 'Ver todas' : 'View all'} ({profile.unlockedBadges.length})
            </span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </motion.div>
      </div>

      {/* SKILL PROGRESS PREVIEW */}
      <section className="shrink-0 w-full p-5 sm:p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider">
            {t('profile.skillsTitle')}
          </h3>
          <span className="text-xs sm:text-sm text-cyan-600 font-extrabold">
            {t('common.level')} {profile.level}
          </span>
        </div>

        <div className="space-y-3 pt-1">
          {/* Skill 1: Privacidad */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs sm:text-sm font-bold text-slate-700">
              <span>{t('profile.skills.privacidad')}</span>
              <span className="text-cyan-600 font-extrabold">{profile.skills.privacidad}%</span>
            </div>
            <div className="h-2.5 sm:h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                style={{ width: `${profile.skills.privacidad}%` }}
              />
            </div>
          </div>

          {/* Skill 2: Contraseñas */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs sm:text-sm font-bold text-slate-700">
              <span>{t('profile.skills.contrasenas')}</span>
              <span className="text-purple-600 font-extrabold">{profile.skills.contrasenas}%</span>
            </div>
            <div className="h-2.5 sm:h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${profile.skills.contrasenas}%` }}
              />
            </div>
          </div>

          {/* Skill 3: Phishing */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs sm:text-sm font-bold text-slate-700">
              <span>{t('profile.skills.phishing')}</span>
              <span className="text-amber-600 font-extrabold">{profile.skills.phishing}%</span>
            </div>
            <div className="h-2.5 sm:h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${profile.skills.phishing}%` }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
