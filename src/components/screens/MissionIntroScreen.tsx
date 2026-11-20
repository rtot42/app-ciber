import React from 'react';
import {
  ArrowLeft,
  Play,
  ShieldAlert,
  Sparkles,
  Award,
  Target,
  Coins,
  ShieldCheck,
} from 'lucide-react';
import { ChildAgeGroup, GameType, Mission } from '../../types';
import { CiberMascot } from '../CiberMascot';
import { useLanguage } from '../../i18n/LanguageContext';
import { getAgeTierMeta } from '../../utils/ageDifficulty';

interface MissionIntroScreenProps {
  mission: Mission;
  ageGroup?: ChildAgeGroup;
  onStartGame: () => void;
  onBack: () => void;
}

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

export const MissionIntroScreen: React.FC<MissionIntroScreenProps> = ({
  mission,
  ageGroup = '8–10' as ChildAgeGroup,
  onStartGame,
  onBack,
}) => {
  const { t, language } = useLanguage();
  const tier = getAgeTierMeta(ageGroup, language);

  return (
    <div className="flex-1 min-h-0 w-full max-w-full flex flex-col justify-between p-4 sm:p-6 bg-slate-50 text-slate-800 select-none overflow-y-auto overflow-x-hidden scrollbar-none space-y-5 sm:space-y-6 pb-8">
      {/* Top Bar with Back */}
      <div className="flex items-center justify-between shrink-0 gap-2">
        <button
          type="button"
          onClick={onBack}
          className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition cursor-pointer shadow-xs active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-wider px-3.5 py-1.5 rounded-2xl bg-cyan-50 text-cyan-800 border border-cyan-200">
          <span>{t('missionIntro.briefing')}</span>
          <span aria-hidden="true">·</span>
          <span>{tier.name}</span>
        </div>
      </div>

      {/* Center Content */}
      <div className="flex flex-col items-center text-center space-y-5 my-auto w-full max-w-md mx-auto">
        <div className="relative w-full rounded-3xl overflow-hidden border border-slate-100 shadow-md bg-gradient-to-b from-sky-50 via-cyan-50/50 to-white flex flex-col items-center justify-center p-6 sm:p-7 space-y-3">
          <div className="w-24 h-24 rounded-3xl bg-white border-2 border-slate-200 flex items-center justify-center text-5xl shadow-md mb-1">
            {GAME_ICON_MAP[mission.gameType] || '🛡️'}
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {mission.title}
          </div>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xs font-medium">
            {mission.subtitle}
          </p>

          <div className="mt-2 text-amber-900 bg-amber-100 border border-amber-200 text-xs sm:text-sm font-black px-4 py-2 rounded-2xl flex items-center gap-2 shadow-2xs">
            <ShieldAlert className="w-4.5 h-4.5 text-amber-600 shrink-0" />
            <span>{t('missionIntro.interactiveChallenge')}</span>
          </div>
        </div>

        {/* Title & Age Tier Calibration */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-black text-slate-500">
            <ShieldCheck className="w-4 h-4 text-cyan-600" />
            <span>{tier.difficultyLabel}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {mission.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-sm mx-auto leading-relaxed font-medium">
            {mission.description || mission.subtitle}
          </p>
        </div>

        {/* Mascot Advice Box */}
        <div className="w-full bg-cyan-50/90 border border-cyan-100 rounded-3xl p-5 flex items-start gap-4 text-left shadow-xs">
          <CiberMascot size="md" expression="thinking" className="shrink-0 mt-0.5" />
          <div className="flex-1 text-sm text-cyan-950 leading-relaxed space-y-1 min-w-0">
            <span className="font-black text-cyan-800 block text-sm sm:text-base">
              {t('missionIntro.cyberTipTitle')}
            </span>
            <p className="text-cyan-900 font-medium text-xs sm:text-sm">{t('missionIntro.cyberTipBody')}</p>
          </div>
        </div>

        {/* Mission Objectives Breakdown */}
        <div className="w-full bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 text-left space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-slate-700">
            <Target className="w-5 h-5 text-cyan-600" />
            <span>{t('missionIntro.objectives')}</span>
          </div>
          <ul className="text-sm text-slate-700 space-y-2 list-disc list-inside pl-1 leading-relaxed font-medium">
            <li>{t('missionIntro.obj1')}</li>
            <li>{t('missionIntro.obj2')}</li>
            <li>{t('missionIntro.obj3')}</li>
          </ul>
        </div>
      </div>

      {/* Rewards & Start CTA */}
      <div className="space-y-4 pt-2 shrink-0 w-full max-w-md mx-auto">
        <div className="flex items-center justify-around py-4 px-4 rounded-2xl bg-white border border-slate-100 text-sm font-black shadow-xs tabular-nums">
          <div className="flex items-center gap-1.5 text-cyan-600 font-black">
            <Sparkles className="w-5 h-5 text-cyan-500" />
            <span>+{mission.xpReward} XP</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-700 font-black">
            <Coins className="w-5 h-5 text-amber-500 fill-amber-400" />
            <span>+{mission.coinReward} {t('common.coins')}</span>
          </div>
          <div className="flex items-center gap-1.5 text-purple-700 font-black">
            <Award className="w-5 h-5 text-purple-500" />
            <span>{t('common.badge')}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onStartGame}
          className="w-full py-4.5 sm:py-5 rounded-2xl font-black text-base sm:text-lg tracking-wide bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-xl shadow-cyan-500/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.98]"
        >
          <Play className="w-5 h-5 fill-white stroke-[2.5]" />
          <span>{t('missionIntro.startMission')}</span>
        </button>
      </div>
    </div>
  );
};
