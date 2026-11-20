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
    <div
      className="flex-1 min-h-0 w-full max-w-full flex flex-col justify-between px-4 sm:px-5 pt-3.5 bg-slate-50 text-slate-800 select-none overflow-y-auto overflow-x-hidden scrollbar-none space-y-4"
      style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom, 0px))' }}
    >
      {/* Top Bar with Back */}
      <div className="flex items-center justify-between shrink-0 gap-2">
        <button
          type="button"
          onClick={onBack}
          aria-label="Volver"
          className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition cursor-pointer shadow-xs active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl bg-cyan-50 text-cyan-800 border border-cyan-200">
          <span>{t('missionIntro.briefing')}</span>
          <span aria-hidden="true">·</span>
          <span>{tier.name}</span>
        </div>
      </div>

      {/* Center Content */}
      <div className="flex flex-col items-center text-center space-y-4 my-auto w-full max-w-md mx-auto">
        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-100 shadow-sm bg-gradient-to-b from-sky-50 via-cyan-50/50 to-white flex flex-col items-center justify-center p-4 sm:p-5 space-y-2.5">
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center text-4xl shadow-sm mb-0.5">
            {GAME_ICON_MAP[mission.gameType] || '🛡️'}
          </div>
          <div className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
            {mission.title}
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xs font-medium">
            {mission.subtitle}
          </p>

          <div className="mt-1 text-amber-900 bg-amber-100 border border-amber-200 text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-2xs">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{t('missionIntro.interactiveChallenge')}</span>
          </div>
        </div>

        {/* Title & Age Tier Calibration */}
        <div className="space-y-1 px-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <ShieldCheck className="w-4 h-4 text-cyan-600" />
            <span>{tier.difficultyLabel}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
            {mission.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed font-medium">
            {mission.description || mission.subtitle}
          </p>
        </div>

        {/* Mascot Advice Box */}
        <div className="w-full bg-cyan-50/90 border border-cyan-100 rounded-2xl sm:rounded-3xl p-4 flex items-start gap-3 text-left shadow-xs">
          <CiberMascot size="sm" expression="thinking" className="shrink-0 mt-0.5" />
          <div className="flex-1 text-sm text-cyan-950 leading-relaxed space-y-0.5 min-w-0">
            <span className="font-bold text-cyan-800 block text-xs sm:text-sm">
              {t('missionIntro.cyberTipTitle')}
            </span>
            <p className="text-cyan-900 font-medium text-xs sm:text-sm">{t('missionIntro.cyberTipBody')}</p>
          </div>
        </div>

        {/* Mission Objectives Breakdown */}
        <div className="w-full bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-4 text-left space-y-2.5 shadow-sm">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700">
            <Target className="w-4.5 h-4.5 text-cyan-600" />
            <span>{t('missionIntro.objectives')}</span>
          </div>
          <ul className="text-xs sm:text-sm text-slate-700 space-y-1.5 list-disc list-inside pl-1 leading-relaxed font-medium">
            <li>{t('missionIntro.obj1')}</li>
            <li>{t('missionIntro.obj2')}</li>
            <li>{t('missionIntro.obj3')}</li>
          </ul>
        </div>
      </div>

      {/* Rewards & Start CTA */}
      <div className="space-y-3 pt-1 shrink-0 w-full max-w-md mx-auto">
        <div className="flex items-center justify-around py-3 px-3 rounded-2xl bg-white border border-slate-100 text-xs sm:text-sm font-bold shadow-xs tabular-nums">
          <div className="flex items-center gap-1.5 text-cyan-600">
            <Sparkles className="w-4 h-4 text-cyan-500" />
            <span>+{mission.xpReward} XP</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-700">
            <Coins className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>+{mission.coinReward} {t('common.coins')}</span>
          </div>
          <div className="flex items-center gap-1.5 text-purple-700">
            <Award className="w-4 h-4 text-purple-500" />
            <span>{t('common.badge')}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onStartGame}
          className="w-full min-h-[48px] py-3.5 px-5 rounded-2xl font-bold text-base tracking-wide bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
        >
          <Play className="w-4.5 h-4.5 fill-white stroke-[2.2]" />
          <span>{t('missionIntro.startMission')}</span>
        </button>
      </div>
    </div>
  );
};
