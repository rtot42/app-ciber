import React from 'react';
import { motion } from 'motion/react';
import {
  Coins,
  Sparkles,
  Play,
  Compass,
  CheckCircle2,
  Award,
  ShieldCheck,
  ChevronRight,
  Flame,
  Lock,
  GraduationCap,
  Zap,
} from 'lucide-react';
import { UserProfile, World } from '../../types';
import { CiberMascot } from '../CiberMascot';
import { AVATAR_OPTIONS } from '../../data';
import { useLanguage } from '../../i18n/LanguageContext';
import { LanguageSelector } from '../LanguageSelector';
import { CyberTipOfTheDay } from '../CyberTipOfTheDay';

interface HomeScreenProps {
  profile: UserProfile;
  currentWorld: World;
  onStartMission: (missionId: string) => void;
  onNavigateToWorlds: () => void;
  onNavigateToEducation?: () => void;
  onNavigateToAchievements: () => void;
  onOpenParentGate: () => void;
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
  onAwardXp,
}) => {
  const { t, language } = useLanguage();
  const avatarData = AVATAR_OPTIONS.find((a) => a.id === profile.avatarId) || AVATAR_OPTIONS[0];
  const xpPercent = Math.min(100, Math.round((profile.xp / profile.xpToNextLevel) * 100));

  const recommendedMission = currentWorld.missions[0];

  return (
    <div className="flex-1 min-h-0 flex flex-col p-4 sm:p-5 bg-slate-50 text-slate-800 select-none space-y-4 sm:space-y-5 overflow-y-auto scrollbar-none pb-24">
      {/* Top Game Hub Header: Player Status & Coins */}
      <div className="shrink-0 bg-white border border-slate-100 rounded-3xl p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between">
          {/* Avatar & Player Info */}
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl relative shadow-xs"
              style={{
                backgroundColor: `${profile.avatarColor}15`,
                border: `2px solid ${profile.avatarColor}`,
              }}
            >
              <span>{avatarData.icon}</span>
              <div className="absolute -bottom-1 -right-1 bg-cyan-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full ring-2 ring-white">
                {t('common.level')} {profile.level}
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>{t('home.greeting', { name: profile.nickname })}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="text-[11px] font-extrabold text-cyan-600">
                {t('home.guardianRank')}
              </div>
            </div>
          </div>

          {/* Right: Language switch, Coins Balance & Parent Mode trigger */}
          <div className="flex items-center gap-2">
            {/* Quick in-app language picker */}
            <LanguageSelector variant="dropdown" />

            {/* Coins */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800">
              <Coins className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-xs font-black tracking-tight">{profile.coins}</span>
            </div>

            {/* Parent Gate icon */}
            <button
              onClick={onOpenParentGate}
              title={t('nav.parentPortal')}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mt-3 pt-2.5 border-t border-slate-100">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1">
            <span className="flex items-center gap-1 text-cyan-600">
              <Sparkles className="w-3 h-3 text-cyan-500" />
              {t('home.xpLabel')}
            </span>
            <span>
              {profile.xp} / {profile.xpToNextLevel} XP ({xpPercent}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 shadow-2xs"
            />
          </div>

          {/* Quick XP Gain & Level-Up Test Triggers */}
          {onAwardXp && (
            <div className="mt-2 flex items-center justify-between gap-1.5 pt-1 text-[11px]">
              <span className="text-[10px] text-slate-400 font-semibold truncate">
                {language === 'fr'
                  ? `Reste ${Math.max(0, profile.xpToNextLevel - profile.xp)} XP pour Niv. ${profile.level + 1}`
                  : language === 'en'
                  ? `${Math.max(0, profile.xpToNextLevel - profile.xp)} XP until Level ${profile.level + 1}`
                  : `Faltan ${Math.max(0, profile.xpToNextLevel - profile.xp)} XP para Nivel ${profile.level + 1}`}
              </span>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => onAwardXp(60)}
                  title={language === 'en' ? 'Quick practice +60 XP' : 'Práctica rápida +60 XP'}
                  className="px-2 py-0.5 rounded-lg bg-sky-50 hover:bg-sky-100 active:scale-95 text-sky-700 font-bold border border-sky-200 transition cursor-pointer text-[10px] flex items-center gap-0.5"
                >
                  <Zap className="w-2.5 h-2.5 text-sky-500" />
                  <span>+60 XP</span>
                </button>
                <button
                  type="button"
                  onClick={() => onAwardXp(Math.max(50, profile.xpToNextLevel - profile.xp + 10))}
                  title={language === 'en' ? 'Trigger Level Up Celebration' : 'Subir de Nivel ahora'}
                  className="px-2 py-0.5 rounded-lg bg-gradient-to-r from-amber-50 to-yellow-100 hover:from-amber-100 hover:to-yellow-200 active:scale-95 text-amber-800 font-extrabold border border-amber-300 transition cursor-pointer text-[10px] flex items-center gap-0.5 shadow-2xs"
                >
                  <Sparkles className="w-2.5 h-2.5 text-amber-600 animate-twinkle" />
                  <span>
                    {language === 'fr' ? 'Niveau +' : language === 'en' ? 'Level Up' : 'Subir Nivel'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Access to Education & Cyber Tips Hub */}
      {onNavigateToEducation && (
        <button
          onClick={onNavigateToEducation}
          className="shrink-0 rounded-2xl p-3.5 bg-gradient-to-r from-amber-50 via-cyan-50 to-blue-50 border border-amber-200/80 hover:border-cyan-300 transition flex items-center justify-between shadow-xs cursor-pointer group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100/90 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100/60 px-1.5 py-0.2 rounded-md">
                  {language === 'fr'
                    ? 'Nouveau'
                    : language === 'en'
                    ? 'New'
                    : 'Nuevo'}
                </span>
                <span className="text-[10px] font-bold text-slate-500">
                  {language === 'fr'
                    ? 'Conseils & Notions'
                    : language === 'en'
                    ? 'Tips & Concepts'
                    : 'Consejos & Conceptos'}
                </span>
              </div>
              <h3 className="text-xs font-black text-slate-900 leading-tight mt-0.5 group-hover:text-cyan-700 transition">
                {language === 'fr'
                  ? 'Académie Cyber & Conseils du Jour'
                  : language === 'en'
                  ? 'Cyber Academy & Daily Tips'
                  : 'Academia Ciber & Consejos del Día'}
              </h3>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 transition group-hover:translate-x-0.5 shrink-0" />
        </button>
      )}

      {/* Cyber Tip of the Day */}
      <CyberTipOfTheDay onLearnTip={() => onAwardXp?.(35)} />

      {/* MAIN FEATURED MISSION CARD */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="shrink-0 relative rounded-3xl overflow-hidden border border-slate-100 shadow-md bg-white group"
      >
        {/* Top Badges */}
        <div className="p-4 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 text-[10px] font-black uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            {t('home.recommendedMission')}
          </div>

          <div className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold">
            +{recommendedMission?.xpReward || 100} XP • +{recommendedMission?.coinReward || 25} 🪙
          </div>
        </div>

        {/* Mission Illustration Backdrop */}
        <div className="h-36 w-full bg-gradient-to-b from-sky-50 via-cyan-50/60 to-white relative flex items-center justify-center overflow-hidden border-y border-slate-100">
          <div className="w-36 h-26 rounded-2xl border border-slate-200 bg-white p-2 relative shadow-md transform -rotate-1 group-hover:rotate-0 transition-transform duration-300">
            <div className="w-full h-full rounded-xl bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 flex flex-col items-center justify-center text-center p-2">
              <span className="text-3xl">📸</span>
              <span className="text-[10px] font-bold text-slate-800 mt-1">{recommendedMission.title}</span>
            </div>
            <div className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 text-[8px] font-black px-2 py-0.5 rounded-full shadow-xs">
              {t('missionIntro.interactiveChallenge')}
            </div>
          </div>
        </div>

        {/* Card Content & Action */}
        <div className="p-4 pt-3">
          <h2 className="text-base font-black text-slate-900 tracking-tight">
            {recommendedMission.title}
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            {recommendedMission.description}
          </p>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>{t('common.easy')} • 3 {t('home.minutes')}</span>
            </div>

            <button
              onClick={() => onStartMission(recommendedMission.id)}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-black tracking-wide shadow-md shadow-cyan-500/25 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{t('home.continueMission')}</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* CURRENT WORLD SUMMARY CARD */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={onNavigateToWorlds}
        className="shrink-0 p-4 rounded-3xl bg-white border border-slate-100 hover:border-cyan-200 shadow-sm transition cursor-pointer flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-cyan-600 font-extrabold">
              {currentWorld.name}
            </div>
            <div className="text-xs font-bold text-slate-900">
              {currentWorld.title}
            </div>
            <div className="text-[10px] text-slate-500">
              {t('worldDetail.missionsCount', { completed: currentWorld.completedMissions, total: currentWorld.totalMissions })}
            </div>
          </div>
        </div>

        <ChevronRight className="w-4 h-4 text-slate-400" />
      </motion.div>

      {/* TWO COLUMNS: Daily Challenge & Recent Achievement */}
      <div className="shrink-0 grid grid-cols-2 gap-3">
        {/* Daily Challenge */}
        <div className="p-3.5 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-orange-600 uppercase">
              <Flame className="w-3 h-3 fill-orange-500 text-orange-500" />
              {language === 'fr' ? 'Défi du Jour' : language === 'en' ? 'Daily Challenge' : 'Reto del Día'}
            </div>
            <div className="text-xs font-bold text-slate-900 mt-1">
              {recommendedMission.title}
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {recommendedMission.subtitle}
            </p>
          </div>
          <div className="mt-3 text-[10px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full inline-block w-fit">
            +50 XP extra
          </div>
        </div>

        {/* Recent Achievement */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onNavigateToAchievements}
          className="p-3.5 rounded-3xl bg-white border border-slate-100 hover:border-purple-200 shadow-sm transition cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-purple-600 uppercase">
              <Award className="w-3 h-3" />
              {language === 'fr' ? 'Médaille Récente' : language === 'en' ? 'Recent Badge' : 'Medalla Reciente'}
            </div>
            <div className="text-xs font-bold text-slate-900 mt-1">
              {language === 'fr' ? 'Premier Pas' : language === 'en' ? 'First Step' : 'Primer paso'}
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {language === 'fr' ? 'Entraînement commencé' : language === 'en' ? 'Training started' : 'Entrenamiento iniciado'}
            </p>
          </div>
          <div className="mt-3 text-[10px] font-bold text-cyan-600 flex items-center gap-1">
            <span>{language === 'fr' ? 'Voir toutes' : language === 'en' ? 'View all' : 'Ver todas'} ({profile.unlockedBadges.length})</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </motion.div>
      </div>

      {/* SKILL PROGRESS PREVIEW */}
      <div className="shrink-0 p-4 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
          <span>{t('profile.skillsTitle')}</span>
          <span className="text-[10px] text-cyan-600 font-bold">{t('common.level')} 3</span>
        </div>

        <div className="space-y-2">
          {/* Skill 1: Privacidad */}
          <div>
            <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-1">
              <span>{t('profile.skills.privacidad')}</span>
              <span className="text-cyan-600">{profile.skills.privacidad}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-500 rounded-full"
                style={{ width: `${profile.skills.privacidad}%` }}
              />
            </div>
          </div>

          {/* Skill 2: Contraseñas */}
          <div>
            <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-1">
              <span>{t('profile.skills.contrasenas')}</span>
              <span className="text-purple-600">{profile.skills.contrasenas}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full"
                style={{ width: `${profile.skills.contrasenas}%` }}
              />
            </div>
          </div>

          {/* Skill 3: Phishing */}
          <div>
            <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-1">
              <span>{t('profile.skills.phishing')}</span>
              <span className="text-amber-600">{profile.skills.phishing}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${profile.skills.phishing}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
